from pydantic import BaseModel
from pydantic.color import Color
from typing import List

from utils.annotation_types import AnnotationInterface


class VideoSettings(BaseModel):
    num_speakers: int = 2
    annotation_type: AnnotationInterface = AnnotationInterface.FLOATING
    text_colour: Color = Color("white")
    font_size: int = 32
    colour_list: List[Color] = []