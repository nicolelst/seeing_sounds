from enum import Enum


class ProcessingStatus(str, Enum):
    RECEIVED = "RECEIVED"
    PREPROCESSING = "PREPROCESSING"
    SPEECH_SEP = "SPEECH_SEP"
    SPEECH_REC = "SPEECH_REC"
    ANNOTATION = "ANNOTATION"
    COMPLETE = "COMPLETE"
    ERROR = "ERROR"
