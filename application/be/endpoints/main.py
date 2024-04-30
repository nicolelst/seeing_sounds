from typing import Union

from fastapi import FastAPI, UploadFile
from pydantic import BaseModel

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
    return {"filename": video.filename, "filetype": video.content_type, "settings_test": VideoSettings(name=name, price=price)}
