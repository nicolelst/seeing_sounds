from utils.annotation_types import AnnotationInterface


STORAGE_DIR = "temp"
VISUAL_VOICE_DIR = "../video_processing/VisualVoice"
PRETRAINED_MODEL_DIR = "../video_processing/VisualVoice/pretrained_models"

# request dir names
LOGS_FOLDER = "logs"
TRANSCRIPT_FOLDER = "transcripts"
OUTPUT_FOLDER = "outputs"

# intermediate filenames
INPUT_TAG = "raw"
PREPROC_TAG = "preproc"
ANNOT_TEMP_TAG = "annot_temp"
ANNOTATION_TAG_DICT = {
  AnnotationInterface.FLOATING: "floating",
  AnnotationInterface.COLOUR: "colour",
  AnnotationInterface.POINTER: "pointer",
  AnnotationInterface.TRADITIONAL: "traditional"
}

# logs filenames
PREPROC_LOGS_FILENAME = "preprocessing_logs.txt"
SPEECH_SEP_LOGS_FILENAME = "speech_sep_logs.txt"
SPEECH_REC_LOGS_FILENAME = "speech_rec_logs.txt"
ANNOTATION_LOGS_FILENAME = "annotation_logs.txt"

# download results zip file
ANNOTATED_VIDEO_NAME = "annotated_video.mp4"
THUMBNAIL_DIR_NAME = "speaker_thumbnails"
