import os
from utils.path_constants import *
from utils.annotation_types import AnnotationInterface


def get_req_dir(request_id):
	return os.path.join(STORAGE_DIR, request_id)

def get_input_video_filename(request_id, filetype):
	return f"{request_id}_{INPUT_TAG}.{filetype}"

def get_preprocessed_filenames(input_video_filename):
	filename = input_video_filename.split(".")[0]
	preproc_video_filename = filename.replace(INPUT_TAG, PREPROC_TAG) + ".mp4" 
	preproc_audio_filename = filename.replace(INPUT_TAG, PREPROC_TAG) + ".wav"
	return (preproc_video_filename, preproc_audio_filename)

def get_annot_temp_filename(preproc_video_filename):
		return preproc_video_filename.replace(PREPROC_TAG, ANNOT_TEMP_TAG)
	
def get_annotated_filename(preproc_video_filename, annotation_type: AnnotationInterface):
	return preproc_video_filename.replace(PREPROC_TAG, ANNOTATION_TAG_DICT[annotation_type])

def get_output_video_filename(request_id):
	req_output_dir = os.path.join(get_req_dir(request_id), OUTPUT_FOLDER)

	if not os.path.isdir(req_output_dir): # invalid request ID
		return None
	
	for outputfile in os.listdir(req_output_dir):
		if outputfile.endswith(".mp4"):
			return os.path.join(req_output_dir, outputfile)
	
	# no video output found
	return None 

def get_annotation_type(filename) -> AnnotationInterface:
  try: 
    annot = filename.split("_")[-1].split(".")[0]
    return AnnotationInterface(annot)
  except:
    return None
