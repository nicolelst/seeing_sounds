import aiofiles
from fastapi import FastAPI, HTTPException, UploadFile
import os
from threading import Thread
from typing import Union
import uuid

import sys
sys.path.insert(0, '..')
from utils.annotation_types import AnnotationInterface
from utils.path_constants import STORAGE_DIR
from utils.video_name_constants import get_input_video_filename
from utils.video_settings import VideoSettings
from video_processing.process_video import process_video


app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/uploadvideo/", status_code=202)
async def upload_video(video: UploadFile, annotation_type: AnnotationInterface, num_speakers: int, colour_list_str: Union[str, None] = ""):
    # https://fastapi.tiangolo.com/tutorial/request-files/ 
    # settings in query params, video file in request body - https://github.com/tiangolo/fastapi/issues/2257#issuecomment-717522156

    # request validation
    if not video.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail=f"Invalid filetype: {video.content_type} not a valid video format")
    
    # parse settings
    colour_list = [x.strip() for x in colour_list_str.split(";")]
    if annotation_type != AnnotationInterface.TRADITIONAL and len(colour_list) < num_speakers:
        raise HTTPException(status_code=400, detail=f"Insufficient colours ({len(colour_list)}) specified for {num_speakers} speakers: {video.content_type}")
    video_settings = VideoSettings(annotation_type=annotation_type, colour_list=colour_list, num_speakers=num_speakers)

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
    
    video_proc_thread = Thread(
        name = request_id, 
        target = process_video, 
        kwargs = {
            "request_dir": request_dir, 
            "input_video_filename": save_filename, 
            "video_settings": video_settings
        },
        daemon = True
    )
    print(f"[{request_id}] starting video processing")
    video_proc_thread.start()
    # TODO websocket
    # TODO request_dir monitoring thread
    # TODO error codes if any issues

    return {"request_id": request_id, "filename": video.filename, "filetype": video.content_type, "settings": video_settings}