from pydantic import BaseModel
from pydantic.color import Color
from typing import List, Literal

from utils.annotation_types import AnnotationInterface
from utils.model_setting_types import *


class VideoSettings(BaseModel):
    num_speakers: int = 2
    annotation_type: AnnotationInterface = AnnotationInterface.FLOATING
    text_colour: Color = Color("white")
    font_size: int = 32
    colour_list: List[Color] = []


class SpeechSepSettings(BaseModel):
    hop_length: float = 2.55
    number_of_identity_frames: int = 1
    visual_features: VisualFeatures = "both"


class SpeechRecSettings(BaseModel):
    model_size: WhisperModelSize = "small" # 244 M params, ~6x relative speed, Librispeech clean WER 3.4
    english_only: bool = False

    def get_model_name(self):
        if self.english_only and self.model_size != "large":
            return self.model_size + ".en"
        else:
            return self.model_size