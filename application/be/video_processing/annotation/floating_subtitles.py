import json
import os
import numpy as np 

from moviepy.video.compositing.CompositeVideoClip import CompositeVideoClip
from moviepy.video.VideoClip import TextClip
from moviepy.video.io.VideoFileClip import VideoFileClip

from utils.preprocessing_config import FPS
from utils.video_name_constants import get_annot_temp_filename
from utils.process_video_settings import VideoSettings
from video_processing.annotation.annotation_utils import *


def add_floating_subtitles_to_video(
        asr_json_list, 
        bbox_npz_list, 
        video_filepath, 
        output_filepath, 
        video_settings: VideoSettings, 
        show_bbox=True
):
    if show_bbox:
        bbox_video_filepath = get_annot_temp_filename(video_filepath)
        add_bbox_to_video(
            input_filepath = video_filepath, 
            output_filepath = bbox_video_filepath, 
            bbox_npz_list = bbox_npz_list, 
            colour_list = video_settings.colour_list
        )
        video_clip = VideoFileClip(bbox_video_filepath)
    else:
        video_clip = VideoFileClip(video_filepath)

    video_components = [video_clip]
    for i in range(video_settings.num_speakers): 
        bbox_list = np.load(bbox_npz_list[i])["data"]
        subtitle_list = json.load(open(asr_json_list[i], "r"))["segments"]

        for segment in subtitle_list:
            # 'id', 'seek', 'start', 'end', 'text', 'tokens', 'temperature', 'avg_logprob', 'compression_ratio', 'no_speech_prob'
            start_time_s = segment["start"] 
            start_frame = int(start_time_s * FPS)
            end_time_s = segment["end"]
            end_frame = int(end_time_s * FPS)

            bbox_coords = np.mean(bbox_list[start_frame:end_frame+1, :], axis=0) # TODO match text, check for loooooong segments, split chunks
            bbox_width_mean = bbox_coords[2]-bbox_coords[0]
            # bbox_height_mean = bbox_coords[3]-bbox_coords[1]
            # print(i+1, start_time_s, end_time_s, (bbox_coords[0], bbox_coords[3]), segment["text"])
            
            chunks = get_caption_chunks(segment["text"], start_time_s, end_time_s)
            for j in range(len(chunks["text"])):
                subtitle_clip = TextClip(
                    txt= chunks["text"][j],
                    font= 'Georgia-Regular',
                    fontsize= video_settings.font_size,
                    color= video_settings.text_colour.as_rgb().replace(" ", ""),
                    bg_color= video_settings.colour_list[i].as_rgb().replace(" ", ""),
                    method= "caption", # "label" for no wrap
                    size= (bbox_width_mean, None)
                ).set_start(chunks["time_start"][j])\
                .set_end(chunks["time_end"][j])\
                .set_position((bbox_coords[0], bbox_coords[3])) # top left, mean
                # .set_position(lambda t: (bbox_list[int(t*FPS), 0], bbox_list[int(t*FPS), 3])) # top left, dynamic 
                # TODO wobbly and reads last speaker bbox only bc its from the list value at composite time

                video_components.append(subtitle_clip) 

    output_video = CompositeVideoClip(video_components)
    output_video.write_videofile(output_filepath, logger=None) 
    if show_bbox:
        os.remove(bbox_video_filepath)
