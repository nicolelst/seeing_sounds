import os
import re

from video_name_constants import *
from annotation_types import Annotation
from speech_separation import * 
from speech_recognition import *

from subtitles_colour import add_coloured_subtitles_to_video
from subtitles_arrow import add_subtitles_pointer_to_video
from floating_subtitles import add_floating_subtitles_to_video

def process_video(request_dir, input_video_filename, annotation_type: Annotation): 
	input_video_filepath = os.path.join(request_dir, input_video_filename)
	preproc_video_filename, preproc_audio_filename = get_preprocessed_filenames(input_video_filename)

	bbox_output_dir = os.path.join(request_dir, "bbox")
	transcript_output_dir = os.path.join(request_dir, "transcripts")
	final_output_dir = os.path.join(request_dir, "outputs")
	if not os.path.exists(final_output_dir):
		os.mkdir(final_output_dir)
        
	colour_list = [(224,84,84), (77,116,174)] # TODO take input

	# speech separation -> audio output: speaker1.wav, speaker2.wav
	visual_voice_speech_separation(
		input_video_filepath = input_video_filepath,
		visual_voice_dir = "./VisualVoice",
		visual_voice_models_dir = "./VisualVoice/pretrained_models", 
		output_dir = request_dir,
		preproc_video_filename = preproc_video_filename,
		preproc_audio_filename = preproc_audio_filename
	)

	# speech recognition
	# TODO swap all over to JSON
	transcript_formats = ["srt", "json"] # srt, vtt, tsv, json
	for filename in os.listdir(request_dir):
		if re.match("speaker[0-9]+.wav", filename):
			print("Getting transcript for", filename)
			for format in transcript_formats:
				result = whisper_get_transcript(
					audio_filepath = os.path.join(request_dir, filename),
					output_dir = transcript_output_dir,
					output_format = format, 
					model_name = "small" # 244 M params, ~6x relative speed, Librispeech clean WER 3.4
				)
    
	transcript_lists = {}
	for format in transcript_formats:
		transcript_lists[format] = [os.path.join(transcript_output_dir, file) for file in os.listdir(transcript_output_dir) if file.endswith("." + format)]
		transcript_lists[format].sort()
	bbox_list = [os.path.join(bbox_output_dir, file) for file in os.listdir(bbox_output_dir) if file.endswith(".npz")]
	bbox_list.sort()

	# video annotation
	annotated_filename = get_annotated_filename(preproc_video_filename, annotation_type)
	if annotation_type == Annotation.TRADITIONAL:  
		# static traditional
		add_coloured_subtitles_to_video(
		    srt_subtitles_list = transcript_lists["srt"], 
		    bbox_npz_list = bbox_list, 
		    video_filepath = preproc_video_filename, 
		    output_filepath = os.path.join(final_output_dir, annotated_filename),
		    colour_list=[(0,0,0)]*2,
		    show_bbox=False
		)
	elif annotation_type == Annotation.COLOUR:
		# static colour
		add_coloured_subtitles_to_video(
		    srt_subtitles_list = transcript_lists["srt"], 
		    bbox_npz_list = bbox_list, 
		    video_filepath = preproc_video_filename, 
		    output_filepath = os.path.join(final_output_dir, annotated_filename),
		    colour_list=colour_list,
		    show_bbox=True 
		)
		"""
		MoviePy - Writing audio in colour_bboxTEMP_MPY_wvf_snd.mp3
		chunk:   0%|                                                                                             | 0/107 [00:00<?, ?it/s, now=None]Traceback (most recent call last):
		File "/Users/User/Library/Python/3.8/lib/python/site-packages/moviepy/audio/io/readers.py", line 193, in get_frame
			result[in_time] = self.buffer[indices]
		IndexError: index -100001 is out of bounds for axis 0 with size 0
		"""
	elif annotation_type == Annotation.POINTER:
		# pointer
		add_subtitles_pointer_to_video(
		    srt_subtitles_list = transcript_lists["srt"], 
		    bbox_npz_list = bbox_list, 
		    video_filepath = preproc_video_filename, 
		    output_filepath = os.path.join(final_output_dir, annotated_filename),
		    colour_list=colour_list,
		)
	elif annotation_type == Annotation.FLOATING:
		# floating 
		add_floating_subtitles_to_video(
			json_asr_list = transcript_lists["json"], 
			bbox_npz_list = bbox_list, 
			video_filepath = preproc_video_filename, 
			output_filepath = os.path.join(final_output_dir, annotated_filename),
			colour_list=colour_list,
			show_bbox=True
		)

            
# if __name__ == "__main__":
#     # stuff only to run when not called via 'import' here
#     process_video(request_dir, input_video_filename, annotation_type: Annotation): 
