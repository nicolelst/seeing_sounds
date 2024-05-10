import asyncio
# from threading import Thread
import aiofiles
import os
import sys
from typing import Union
import uuid

from fastapi import FastAPI, HTTPException, status, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
# from fastapi.testclient import TestClient
from pydantic.color import Color

sys.path.insert(0, '..')
from endpoints.zip_results import zip_results
from utils.api_config import CORS_ORIGINS, STATUS_POLLING_DELAY_SEC, Routes
from utils.status_types import ProcessingStatus
from endpoints.processing_thread_manager import ProcessingThreadManager
from utils.annotation_types import AnnotationInterface
from utils.path_constants import ANNOTATED_VIDEO_NAME, STORAGE_DIR, THUMBNAIL_DIR_NAME
from utils.video_name_constants import get_annotation_type, get_input_video_filename
from utils.model_setting_types import VisualFeatures, WhisperModelSize
from utils.process_video_settings import SpeechRecSettings, SpeechSepSettings, VideoSettings
from utils.speaker_info import Speaker_Info
from video_processing.process_video import process_video
from video_processing.transcript.generate_transcript import generate_transcript


app = FastAPI()
proc_thread_mgr = ProcessingThreadManager()

# add CORS middleware to resolve “No Access-Control-Allow-Origin header” 
# https://fastapi.tiangolo.com/tutorial/cors/
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.get("/")
def read_root():
    return {"Hello": "World", "Seeing": "Sounds"}

@app.post(Routes.POST_UPLOAD_VIDEO, status_code=202)
async def upload_video(
    video: UploadFile, 
    annotation_type: AnnotationInterface, text_colour: str, font_size: int, num_speakers: int, colour_list_str: Union[str, None] = "", 
    hop_length: float = 2.55, num_ident_frames: int = 1, visual_feat: VisualFeatures = "both", 
    model_size: WhisperModelSize = "small", eng_only:bool = False
):
    # https://fastapi.tiangolo.com/tutorial/request-files/ 
    # settings in query params, video file in request body - https://github.com/tiangolo/fastapi/issues/2257#issuecomment-717522156

    # request validation
    if not video.content_type.startswith("video/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid filetype: {video.content_type} not a valid video format")
    
    # parse settings
    colour_list = [x.strip() for x in colour_list_str.split(";")]
    if annotation_type != AnnotationInterface.TRADITIONAL and len(colour_list) < num_speakers:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Insufficient colours ({len(colour_list)}) specified for {num_speakers} speakers: {video.colour_list}")
    try: 
        text_col = Color(text_colour)
    except: 
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error parsing text colour: {text_colour}")
    try: 
        text_colour = Color(text_colour)
        colour_list = [Color(c) for c in colour_list]
    except: 
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error parsing colours: {colour_list}")

    video_settings = VideoSettings(annotation_type=annotation_type, text_colour=text_col, font_size=font_size, colour_list=colour_list, num_speakers=num_speakers)
    speech_sep_settings = SpeechSepSettings(hop_length=hop_length, number_of_identity_frames=num_ident_frames, visual_features=visual_feat)
    speech_rec_settings = SpeechRecSettings(model_size=model_size, english_only=eng_only)

    # assign request ID and create directory
    request_id = str(uuid.uuid4())
    request_dir = os.path.join(STORAGE_DIR, request_id)
    if os.path.exists(request_dir): 
        # if request directory exists, delete contents
        for existing_file in os.listdir(request_dir):
            existing_filepath = os.path.join(request_dir, existing_file)
            if os.path.isfile(existing_filepath):
                os.remove(existing_filepath)
    else:
        # create new request directory 
        os.makedirs(request_dir, exist_ok=True)

    # save video file to request directory
    save_filename = get_input_video_filename(request_id, video.filename.split(".")[-1])
    async with aiofiles.open(os.path.join(request_dir, save_filename), 'wb') as out_file:
        # use chunks to avoid reading entire video into memory 
        # https://stackoverflow.com/a/63581187
        while content := await video.read(1024):  
            await out_file.write(content)  
    
    proc_thread_mgr.add(
        request_id= request_id,
        processing_func= process_video,
        kwargs = {
            "request_dir": request_dir, 
            "input_video_filename": save_filename, 
            "video_settings": video_settings,
            "speech_sep_settings": speech_sep_settings,
            "speech_rec_settings": speech_rec_settings
        }
    )
    
    # def test_websocket(id):
    #     client = TestClient(app)
    #     print(">> start testing websocket: id = ", id)
    #     with client.websocket_connect(f"/ws/{id}") as websocket:
    #         while True: 
    #             data = websocket.receive_json()
    #             print(">> testing websocket: id = ", id, "data =", data)
    #             if data["status"] == ProcessingStatus.COMPLETE:
    #                 break
    #     print(">> end testing websocket: id = ", id)
    # test_thread = Thread(name="test_websocket", target=test_websocket, args=[request_id], daemon=True)
    # test_thread.start()

    return {
        "request_id": request_id, 
        "filename": video.filename, 
        "filetype": video.content_type, 
        "video_settings": video_settings,
        "speech_sep_settings": speech_sep_settings,
        "speech_rec_settings": speech_rec_settings
    }

@app.websocket(Routes.STATUS_WEBSOCKET + "/{request_id}")
async def websocket_endpoint(websocket: WebSocket, request_id: str):
    print(f"[{request_id}] websocket initialised at {websocket.url}")

    await websocket.accept()
    print(f"[{request_id}] websocket accepted connection from client {websocket.client}")

    if proc_thread_mgr.is_valid(request_id): 
        print(f"[{request_id}] websocket validated request_id")
    else:
        print(f"[{request_id}] invalid request_id - websocket closed")
        # websocket status codes: https://datatracker.ietf.org/doc/html/rfc6455#section-7.4
        websocket.close(code=1000, reason=f"Invalid request_id [{request_id}]")
        return

    try: 
        prev_status = ProcessingStatus.RECEIVED 
        await websocket.send_json({"request_id": request_id,
                            "status": prev_status})
        print(f"[{request_id}] init status {prev_status} via websocket")
        while True: 
            while prev_status == proc_thread_mgr.get_status(request_id):
                # time to wait before polling again for change in status
                await asyncio.sleep(STATUS_POLLING_DELAY_SEC)
            status = proc_thread_mgr.get_status(request_id)
            print(f"[{request_id}] new status: {status}")
            if status == ProcessingStatus.ERROR: 
                error_msg = proc_thread_mgr.get_error_msg(request_id)
                msg = {
                    "request_id": request_id,
                    "status": status,
                    "message": error_msg
                }
                print(f"[{request_id}] reporting error [{error_msg}] via websocket:", msg)
            else: 
                msg = {
                    "request_id": request_id,
                    "status": status
                }
                print(f"[{request_id}] updating status {status} via websocket:", msg)
            await websocket.send_json(msg)
            prev_status = status
    except WebSocketDisconnect as d:
        print(f"[{request_id}] websocket disconnected by client ({d.code}, {d.reason})")
        

@app.get(Routes.GET_ANNOTATED_VIDEO)
async def get_annotated_video(request_id: str):
    # HTTP problem details JSON format as per https://www.rfc-editor.org/rfc/rfc7807#section-3.1
    if not proc_thread_mgr.is_valid(request_id):
        # invalid request id
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Invalid request_id. The server has never received a request with ID [{request_id}].")
    
    if proc_thread_mgr.is_in_progress(request_id):
        # request still in progress
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
            content = {
                "type": "URI", 
                "title": "Service Unavailable", 
                "status": 503,
                "detail": f"Video processing in progress. The server is still processing the request with ID [{request_id}] (status = {proc_thread_mgr.get_status(request_id)}). Please try again later.", 
            },
            headers = {
                "Retry-After": 60 # retry in 1 minute
            }
        )
    
    if proc_thread_mgr.get_status(request_id) == ProcessingStatus.ERROR:
        # error while processing request
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            content = {
                "type": "URI", 
                "title": "Internal Server Error", 
                "status": 500,
                "detail": f"{proc_thread_mgr.get_error_msg(request_id)} while processing request with ID [{request_id}]. Please create a new request with POST /upload_video.", 
            }
        )

    zip_filepath = zip_results(request_id)
    if zip_filepath == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Invalid request_id. No output video found for the request with ID [{request_id}]")

    response = FileResponse(
        path = zip_filepath,
        headers = {
            "request_id": request_id, 
            "annotation_type": get_annotation_type(zip_filepath),
            "video_filename": ANNOTATED_VIDEO_NAME,
            "thumbnail_dir": THUMBNAIL_DIR_NAME,
            "content-disposition": "attachment"
        },
        media_type = "application/zip",
        filename = zip_filepath.split("/")[-1]
    )
    return response

@app.get(Routes.GET_TRANSCRIPT)
async def get_transcript(request_id: str, speaker_names: str, speaker_colours: str):
    if not proc_thread_mgr.is_valid(request_id):
        # invalid request id
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Invalid request_id. The server has never received a request with ID [{request_id}].")

    # parse speaker info
    speaker_name_list = speaker_names.split(";")
    speaker_colour_list = [x.strip() for x in speaker_colours.split(";")]

    # validate speaker info
    if len(speaker_name_list) != len(speaker_colour_list):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Inconsistent number of speaker names ({len(speaker_name_list)}) and colours ({len(speaker_name_list)}): {speaker_name_list}, {speaker_colour_list}")
    try: 
        colour_list = [Color(c) for c in speaker_colour_list]
    except: 
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error parsing colours: {speaker_colour_list}")

    info = []
    for i in range(len(speaker_name_list)):
        s = Speaker_Info(name=speaker_name_list[i], colour=colour_list[i])
        info.append(s)
            
    transcript_filepath = generate_transcript(
        request_id=request_id, 
        speaker_info=info
    )
    response = FileResponse(
        path = transcript_filepath,
        headers = {
            "request_id": request_id, 
            "speaker_info": str([{"id": i+1, "name":info[i].name, "colour": info[i].colour.as_hex()} for i in range(len(info))]),
            "content-disposition": "attachment"
        },
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename = transcript_filepath.split("/")[-1]
    )

    return response
