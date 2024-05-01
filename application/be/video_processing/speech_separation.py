import datetime
import os
import subprocess
import sys

from utils.path_constants import VISUAL_VOICE_DIR, PRETRAINED_MODEL_DIR


def visual_voice_speech_separation (
        output_dir, 
        preproc_video_filename = "video_25fps.mp4", 
        preproc_audio_filename="audio_mono_16kHz.wav",
        num_speakers = 2,
        logs_filepath = None
):
    
    if not os.path.exists(output_dir):
        os.mkdir(output_dir)
    
    if logs_filepath != None:
        logs_file = open(logs_filepath, "w")
        print(f"[{datetime.datetime.now()}]", file=logs_file)
    else:
        logs_file = None

    subprocess.run(
        f"{sys.executable} ./{VISUAL_VOICE_DIR}/utils/crop_mouth_from_video.py --video-direc {output_dir}/faces/ --landmark-direc {output_dir}/landmark/ --save-direc {output_dir}/mouthroi/ --convert-gray --filename-path {output_dir}/filename_input/{preproc_video_filename[:-4]}.csv --mean-face ./{VISUAL_VOICE_DIR}/utils/20words_mean_face.npy", 
        shell=True,
        stdout=logs_file,
        stderr=subprocess.STDOUT
    ) 

    subprocess.run(f"""
        {sys.executable} {VISUAL_VOICE_DIR}/testRealVideo.py \
        --mouthroi_root {output_dir}/mouthroi/ \
        --facetrack_root {output_dir}/faces/ \
        --audio_path {os.path.join(output_dir, preproc_audio_filename)} \
        --weights_lipreadingnet {PRETRAINED_MODEL_DIR}/lipreading_best.pth \
        --weights_facial {PRETRAINED_MODEL_DIR}/facial_best.pth \
        --weights_unet {PRETRAINED_MODEL_DIR}/unet_best.pth \
        --weights_vocal {PRETRAINED_MODEL_DIR}/vocal_best.pth \
        --lipreading_config_path {VISUAL_VOICE_DIR}/configs/lrw_snv1x_tcn2x.json \
        --num_frames 64 \
        --audio_length 2.55 \
        --hop_size 160 \
        --window_size 400 \
        --n_fft 512 \
        --unet_output_nc 2 \
        --normalization \
        --visual_feature_type both \
        --identity_feature_dim 128 \
        --audioVisual_feature_dim 1152 \
        --visual_pool maxpool \
        --audio_pool maxpool \
        --compression_type none \
        --reliable_face \
        --audio_normalization \
        --desired_rms 0.7 \
        --number_of_speakers {num_speakers} \
        --mask_clip_threshold 5 \
        --hop_length 2.55 \
        --lipreading_extract_feature \
        --number_of_identity_frames 1 \
        --output_dir_root {output_dir}
        """, 
        shell=True,
        stdout=logs_file,
        stderr=subprocess.STDOUT
    )

    if logs_file != None:
        logs_file.close()
