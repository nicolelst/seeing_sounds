import datetime
import os
import subprocess
import sys

from utils.path_constants import *
from utils.preprocessing_config import *


def video_preprocessing(
	input_video_filepath, 
	output_dir, 
	preproc_video_filename = "video_resampled.mp4", 
	preproc_audio_filename = "audio_resampled.wav",
	num_speakers = 2,
	logs_filepath = None
):
	if not os.path.exists(output_dir):
		os.mkdir(output_dir)
		
	bbox_output_dir = os.path.join(output_dir, "bbox")
	if not os.path.exists(bbox_output_dir):
		os.makedirs(bbox_output_dir, exist_ok=True)
    
	if logs_filepath != None:
		logs_file = open(logs_filepath, "w")
		print(f"[{datetime.datetime.now()}]", file=logs_file)
	else:
		logs_file = None

	# resample video
	preproc_video_filepath = os.path.join(output_dir, preproc_video_filename)
	subprocess.run(
		f"ffmpeg -i {input_video_filepath} -filter:v fps=fps={FPS} {preproc_video_filepath}",
		shell=True,
		stdout=logs_file,
		stderr=subprocess.STDOUT
    ) 

	# resample audio to single-channel 
	preproc_audio_filepath = os.path.join(output_dir, preproc_audio_filename)
	subprocess.run(
		f"ffmpeg -i {preproc_video_filepath} -vn -ar {AUDIO_SAMPLING_FREQ} -ac 1 -ab {AUDIO_BITRATE} -f wav {preproc_audio_filepath}", 
		shell=True,
		stdout=logs_file,
		stderr=subprocess.STDOUT
    ) 

	# apply MTCNN face detector
	subprocess.run(
        f"{sys.executable} ./{VISUAL_VOICE_DIR}/utils/detectFaces.py --video_input_path {preproc_video_filepath} --output_path {output_dir} --number_of_speakers {num_speakers} --scalar_face_detection 1.5 --detect_every_N_frame 8", 
        shell=True,
        stdout=logs_file,
        stderr=subprocess.STDOUT
    ) 

	bbox_list = [os.path.join(bbox_output_dir, file) for file in os.listdir(bbox_output_dir) if file.endswith(".npz")]
	bbox_list.sort()

	if logs_file != None:
		logs_file.close()

	return bbox_list