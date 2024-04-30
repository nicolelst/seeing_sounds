import os
import uuid
import aiofiles
from fastapi import FastAPI, UploadFile
from pydantic import BaseModel

from video_name_constants import * 

app = FastAPI()

# https://fastapi.tiangolo.com/#example
class VideoSettings(BaseModel):
    name: str
    price: float

class UploadVideoResponse(BaseModel):
    request_id: str
    filename: str
    filetype: str
    class Config:
        orm_mode = True


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/uploadvideo/")
async def upload_video(video: UploadFile, name: str, price: float):
    # https://fastapi.tiangolo.com/tutorial/request-files/ 
    # https://github.com/tiangolo/fastapi/issues/2257#issuecomment-717522156
    # settings in query params
    # video file in request body 
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

    # TODO check filetype is video

    # save video file to request directory
    filepath = os.path.join(request_dir, get_input_video_filename(request_id, video.content_type.split("/")[-1]))
    async with aiofiles.open(filepath, 'wb') as out_file:
        # use chunks to avoid reading entire video into memory 
        # https://stackoverflow.com/a/63581187
        while content := await video.read(1024):  
            await out_file.write(content)  

    return {"request_id": request_id, "filename": video.filename, "filetype": video.content_type, "settings_test": VideoSettings(name=name, price=price)}
