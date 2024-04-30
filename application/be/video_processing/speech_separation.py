import os
import subprocess
import sys

def visual_voice_speech_separation (
        input_video_filepath, 
        visual_voice_dir, 
        visual_voice_models_dir, 
        output_dir, 
        preproc_video_filename = "video_25fps.mp4", 
        preproc_audio_filename="audio_mono_16kHz.wav"
    ):
    if not os.path.exists(output_dir):
        os.mkdir(output_dir)

    preproc_video_filepath = os.path.join(output_dir, preproc_video_filename)
    subprocess.run(
        f"ffmpeg -i {input_video_filepath} -filter:v fps=fps=25 {preproc_video_filepath}",
        shell=True
    ) 


    subprocess.run(
        f"{sys.executable} ./{visual_voice_dir}/utils/detectFaces.py --video_input_path {preproc_video_filepath} --output_path {output_dir} --number_of_speakers 2 --scalar_face_detection 1.5 --detect_every_N_frame 8", 
        shell=True
    ) 

    preproc_audio_filepath = os.path.join(output_dir, preproc_audio_filename)
    subprocess.run(
        f"ffmpeg -i {preproc_video_filepath} -vn -ar 16000 -ac 1 -ab 192k -f wav {preproc_audio_filepath}", 
        shell=True
    ) 

    subprocess.run(
        f"{sys.executable} ./{visual_voice_dir}/utils/crop_mouth_from_video.py --video-direc {output_dir}/faces/ --landmark-direc {output_dir}/landmark/ --save-direc {output_dir}/mouthroi/ --convert-gray --filename-path {output_dir}/filename_input/{preproc_video_filename[:-4]}.csv --mean-face ./{visual_voice_dir}/utils/20words_mean_face.npy", 
        shell=True
    ) 

    subprocess.run(f"""
        {sys.executable} {visual_voice_dir}/testRealVideo.py \
        --mouthroi_root {output_dir}/mouthroi/ \
        --facetrack_root {output_dir}/faces/ \
        --audio_path {preproc_audio_filepath} \
        --weights_lipreadingnet {visual_voice_models_dir}/lipreading_best.pth \
        --weights_facial {visual_voice_models_dir}/facial_best.pth \
        --weights_unet {visual_voice_models_dir}/unet_best.pth \
        --weights_vocal {visual_voice_models_dir}/vocal_best.pth \
        --lipreading_config_path {visual_voice_dir}/configs/lrw_snv1x_tcn2x.json \
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
        --number_of_speakers 2 \
        --mask_clip_threshold 5 \
        --hop_length 2.55 \
        --lipreading_extract_feature \
        --number_of_identity_frames 1 \
        --output_dir_root {output_dir}
        """, 
        shell=True
    )

if __name__ == "__main__":
    # from application/be
    visual_voice_speech_separation (
        input_video_filepath="endpoints/temp/e7c1724d-8b8a-45b4-b6f1-f32aecf5a05c/e7c1724d-8b8a-45b4-b6f1-f32aecf5a05c_raw.mp4", 
        visual_voice_dir="video_processing/VisualVoice", 
        visual_voice_models_dir="video_processing/VisualVoice/pretrained_models", 
        output_dir="endpoints/temp/e7c1724d-8b8a-45b4-b6f1-f32aecf5a05c", 
        preproc_video_filename = "video_25fps.mp4", 
        preproc_audio_filename="audio_mono_16kHz.wav"
    )