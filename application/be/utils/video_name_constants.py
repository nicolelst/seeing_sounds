from utils.annotation_types import AnnotationInterface


def get_input_video_filename(request_id, filetype):
	return "%s_raw.%s" % (request_id, filetype)

def get_preprocessed_filenames(input_video_filename):
	filename, filetype = input_video_filename.split(".")
	preproc_video_filename = filename.replace("_raw", "_preproc") + ".mp4" # + "." + filetype
	preproc_audio_filename = filename.replace("_raw", "_preproc") + ".wav"
	return (preproc_video_filename, preproc_audio_filename)

def get_annot_temp_filename(preproc_video_filename):
		return preproc_video_filename.replace("_preproc", "_annot_temp")
	
def get_annotated_filename(preproc_video_filename, annotation_type: AnnotationInterface):
	if annotation_type == AnnotationInterface.TRADITIONAL:  
		return preproc_video_filename.replace("_preproc", "_traditional")
	elif annotation_type == AnnotationInterface.COLOUR:
		return preproc_video_filename.replace("_preproc", "_colour")
	elif annotation_type == AnnotationInterface.POINTER:
		return preproc_video_filename.replace("_preproc", "_pointer")
	elif annotation_type == AnnotationInterface.FLOATING:
		return preproc_video_filename.replace("_preproc", "_floating")