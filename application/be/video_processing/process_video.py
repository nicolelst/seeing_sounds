import os

from utils.path_constants import *
from utils.video_name_constants import *
from utils.process_video_settings import *
from video_processing.video_preprocessing import video_preprocessing
from video_processing.speech_separation import visual_voice_speech_separation
from video_processing.speech_recognition import whisper_speech_recognition
from video_processing.annotation.video_annotation import video_annotation


def process_video(request_dir, input_video_filename, video_settings: VideoSettings, speech_sep_settings: SpeechSepSettings, speech_rec_settings: SpeechRecSettings): 
	input_video_filepath = os.path.join(request_dir, input_video_filename)
	preproc_video_filename, preproc_audio_filename = get_preprocessed_filenames(input_video_filename)

	logs_output_dir = os.path.join(request_dir, LOGS_FOLDER)
	transcript_output_dir = os.path.join(request_dir, TRANSCRIPT_FOLDER)
	final_output_dir = os.path.join(request_dir, OUTPUT_FOLDER)
	for dir in [logs_output_dir, transcript_output_dir, final_output_dir]:
		if not os.path.exists(dir):
			os.makedirs(dir, exist_ok=True)
        
	# video preprocessing -> resample video and audio, apply face detector
	bbox_list = video_preprocessing(
		input_video_filepath = input_video_filepath,
		output_dir = request_dir,
		preproc_video_filename = preproc_video_filename,
		preproc_audio_filename = preproc_audio_filename,
		num_speakers= video_settings.num_speakers, 
		logs_filepath = os.path.join(logs_output_dir, PREPROC_LOGS_FILENAME)
	)	

	# speech separation -> audio output: speaker1.wav, speaker2.wav
	visual_voice_speech_separation(
		output_dir = request_dir,
		preproc_video_filename = preproc_video_filename,
		preproc_audio_filename = preproc_audio_filename,
		num_speakers= video_settings.num_speakers, 
		logs_filepath = os.path.join(logs_output_dir, SPEECH_SEP_LOGS_FILENAME),
		settings = speech_sep_settings
	)

	# speech recognition
	transcript_list = whisper_speech_recognition(
		audio_track_dir = request_dir, 
		transcript_dir = transcript_output_dir, 
		output_format = "json",
		logs_filepath = os.path.join(logs_output_dir, SPEECH_REC_LOGS_FILENAME),
		settings = speech_rec_settings
	)

	# video annotation
	video_annotation(
		preproc_video_filepath = os.path.join(request_dir, preproc_video_filename), 
		transcript_list= transcript_list,
		bbox_list = bbox_list,
		settings = video_settings,
		output_dir = final_output_dir, 
		logs_filepath = os.path.join(logs_output_dir, ANNOTATION_LOGS_FILENAME)
	)

	print(f"[{request_dir.split('/')[-1]}] SUCCESSFULLY completed processing")

