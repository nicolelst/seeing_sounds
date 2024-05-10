import datetime
import os
from pydantic.color import Color

from utils.annotation_types import AnnotationInterface
from utils.video_name_constants import get_annotated_filename
from utils.process_video_settings import VideoSettings

from video_processing.annotation.subtitles_colour import add_coloured_subtitles_to_video
from video_processing.annotation.subtitles_arrow import add_subtitles_pointer_to_video
from video_processing.annotation.floating_subtitles import add_floating_subtitles_to_video


def video_annotation(
		preproc_video_filepath, 
		transcript_list,
		bbox_list,
		settings: VideoSettings,
		output_dir,
        logs_filepath = None
):
	if logs_filepath != None:
		logs_file = open(logs_filepath, "a")
		print(f"[{datetime.datetime.now()}]", file=logs_file)
	else:
		logs_file = None
				
	annotated_filename = get_annotated_filename(preproc_video_filepath.split("/")[-1], settings.annotation_type)
	annotated_filepath = os.path.join(output_dir, annotated_filename)
	if settings.annotation_type == AnnotationInterface.TRADITIONAL:  
		# static traditional
		print(f"Saving static traditional static captions to {annotated_filepath}", file=logs_file)
		settings.colour_list = [Color("black")] * settings.num_speakers
		add_coloured_subtitles_to_video(
		    asr_json_list = transcript_list, 
		    bbox_npz_list = bbox_list, 
		    video_filepath = preproc_video_filepath, 
		    output_filepath = annotated_filepath,
		    video_settings = settings, 
		    show_bbox = False 
		)
	elif settings.annotation_type == AnnotationInterface.COLOUR:
		# static colour
		print(f"Saving static captions coloured by speaker to {annotated_filepath}", file=logs_file)
		add_coloured_subtitles_to_video(
		    asr_json_list = transcript_list, 
		    bbox_npz_list = bbox_list, 
		    video_filepath = preproc_video_filepath, 
		    output_filepath = annotated_filepath,
		    video_settings = settings, 
		    show_bbox=True 
		)
		"""
		MoviePy - Writing audio in colour_bboxTEMP_MPY_wvf_snd.mp3
		chunk:   0%|                                                                                             | 0/107 [00:00<?, ?it/s, now=None]Traceback (most recent call last):
		File "/Users/User/Library/Python/3.8/lib/python/site-packages/moviepy/audio/io/readers.py", line 193, in get_frame
			result[in_time] = self.buffer[indices]
		IndexError: index -100001 is out of bounds for axis 0 with size 0
		"""
	elif settings.annotation_type == AnnotationInterface.POINTER:
		# pointer
		print(f"Saving static captions with pointers to {annotated_filepath}", file=logs_file)
		add_subtitles_pointer_to_video(
			asr_json_list = transcript_list, 
			bbox_npz_list = bbox_list, 
			video_filepath = preproc_video_filepath, 
			output_filepath = annotated_filepath, 
			video_settings = settings
		)
		
	elif settings.annotation_type == AnnotationInterface.FLOATING:
		# floating 
		print(f"Saving floating captions to {annotated_filepath}", file=logs_file)
		add_floating_subtitles_to_video(
			asr_json_list = transcript_list, 
			bbox_npz_list = bbox_list, 
			video_filepath = preproc_video_filepath, 
			output_filepath = annotated_filepath,
			video_settings = settings,
			show_bbox = True
		)

	if logs_file != None:
		logs_file.close()
				
