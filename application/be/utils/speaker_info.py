from pydantic import BaseModel
from pydantic.color import Color


class Speaker_Info(BaseModel): 
    name: str
    colour: Color