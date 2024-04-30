from annotation_types import Annotation


STORAGE_DIR = "temp"

def get_input_video_filename(request_id, filetype):
	return "%s_raw.%s" % (request_id, filetype)

def get_preprocessed_filenames(input_video_filename):
	filename, filetype = input_video_filename.split(".")
	preproc_video_filename = filename.replace("_raw", "_preproc") + ".mp4" # + "." + filetype
	preproc_audio_filename = filename.replace("_raw", "_preproc") + ".wav"
	return (preproc_video_filename, preproc_audio_filename)

def get_annotated_filename(preproc_video_filename, annotation_type: Annotation):
	if annotation_type == Annotation.TRADITIONAL:  
		return preproc_video_filename.replace("_preproc", "_traditional")
	elif annotation_type == Annotation.COLOUR:
		return preproc_video_filename.replace("_preproc", "_colour")
	elif annotation_type == Annotation.POINTER:
		return preproc_video_filename.replace("_preproc", "_pointer")
	elif annotation_type == Annotation.FLOATING:
		return preproc_video_filename.replace("_preproc", "_floating")