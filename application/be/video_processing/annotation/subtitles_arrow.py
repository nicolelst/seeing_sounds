import json
import os

from moviepy.video.compositing.CompositeVideoClip import CompositeVideoClip
from moviepy.video.VideoClip import TextClip
from moviepy.video.io.VideoFileClip import VideoFileClip

from utils.video_name_constants import get_annot_temp_filename
from video_processing.annotation.annotation_utils import *
from utils.process_video_settings import VideoSettings

def add_subtitles_pointer_to_video(
        asr_json_list, 
        bbox_npz_list, 
        video_filepath, 
        output_filepath, 
        video_settings: VideoSettings
):
    pointers_video_filepath = get_annot_temp_filename(video_filepath)
    add_pointers_to_video(
        input_filepath = video_filepath, 
        output_filepath = pointers_video_filepath, 
        bbox_npz_list = bbox_npz_list, 
        colour_list = video_settings.colour_list
    )
    video_clip = VideoFileClip(pointers_video_filepath)

    video_components = [video_clip]
    for i in range(video_settings.num_speakers): 
        subtitle_list = json.load(open(asr_json_list[i], "r"))["segments"]

        for segment in subtitle_list:
            # 'id', 'seek', 'start', 'end', 'text', 'tokens', 'temperature', 'avg_logprob', 'compression_ratio', 'no_speech_prob'
            start_time_s = segment["start"] 
            end_time_s = segment["end"]

            chunks = get_caption_chunks(segment["text"], start_time_s, end_time_s)
            for j in range(len(chunks["text"])):
                subtitle_clip = TextClip(
                    txt= chunks["text"][j],
                    font= 'Georgia-Regular',
                    fontsize= video_settings.font_size,
                    color= video_settings.text_colour.as_rgb().replace(" ", ""),
                    bg_color= video_settings.colour_list[i].as_rgb().replace(" ", ""),
                    method= "label"
                ).set_start(chunks["time_start"][j])\
                .set_end(chunks["time_end"][j])\
                .set_position(("center", 0.8 + i * 0.05), relative=True) 

                video_components.append(subtitle_clip) 

    output_video = CompositeVideoClip(video_components)
    output_video.write_videofile(output_filepath, logger=None) 
    os.remove(pointers_video_filepath) 
