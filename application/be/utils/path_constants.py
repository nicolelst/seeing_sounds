from utils.annotation_types import AnnotationInterface


STORAGE_DIR = "temp"
VISUAL_VOICE_DIR = "../video_processing/VisualVoice"
PRETRAINED_MODEL_DIR = "../video_processing/VisualVoice/pretrained_models"

# request dir names
LOGS_FOLDER = "logs"
TRANSCRIPT_FOLDER = "transcripts"
OUTPUT_FOLDER = "outputs"

# intermediate filenames
INPUT_TAG = "_raw"
PREPROC_TAG = "_preproc"
ANNOT_TEMP_TAG = "_annot_temp"
ANNOTATION_TAG_DICT = {
  AnnotationInterface.FLOATING: "_floating",
  AnnotationInterface.COLOUR: "_colour",
  AnnotationInterface.POINTER: "_pointer",
  AnnotationInterface.TRADITIONAL: "_traditional"
}

# logs filenames
PREPROC_LOGS_FILENAME = "preprocessing_logs.txt"
SPEECH_SEP_LOGS_FILENAME = "speech_sep_logs.txt"
SPEECH_REC_LOGS_FILENAME = "speech_rec_logs.txt"
ANNOTATION_LOGS_FILENAME = "annotation_logs.txt"
