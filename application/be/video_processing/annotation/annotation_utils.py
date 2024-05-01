import cv2
import numpy as np
from moviepy.video.io.VideoFileClip import VideoFileClip

def add_bbox_to_video(
        input_filepath, 
        output_filepath, 
        bbox_npz_list, 
        colour_list
):
    num_speakers = len(bbox_npz_list)
    bbox_iter_lists = [iter(np.load(bbox_npz)["data"]) for bbox_npz in bbox_npz_list]
    
    # TODO average for segment?
    def add_bbox(frame):
        try:
            for i in range(num_speakers): 
                bbox_coords = [int(x) for x in next(bbox_iter_lists[i])]
                cv2.rectangle(
                    img= frame,
                    pt1= bbox_coords[:2],
                    pt2= bbox_coords[2:],
                    color= colour_list[i].as_rgb_tuple(),
                    thickness= 6
                ) 
        except StopIteration:
            pass
        return frame
    
    video_raw = VideoFileClip(input_filepath)
    out_video = video_raw.fl_image(add_bbox)
    out_video.write_videofile(output_filepath, audio=True, logger=None)


def add_pointers_to_video(
        input_filepath, 
        output_filepath, 
        bbox_npz_list, 
        colour_list
):
    num_speakers = len(bbox_npz_list)
    bbox_iter_lists = [iter(np.load(bbox_npz)["data"]) for bbox_npz in bbox_npz_list]

    def add_pointer(frame):
        frame_h, frame_w, _ = frame.shape
        try:
            for i in range(num_speakers): 
                bbox_coords = [int(x) for x in next(bbox_iter_lists[i])]
                bbox_center_x = (bbox_coords[0] + bbox_coords[2])//2
                # bbox_center_y = (bbox_coords[1] + bbox_coords[3])//2
                
                # TODO normalise size / coords
                cv2.arrowedLine(
                    img= frame,
                    pt1= (frame_w//2, int(frame_h*0.8)),
                    pt2= (bbox_center_x, bbox_coords[3]),
                    color= colour_list[i].as_rgb_tuple(), #[::-1],  # RGB -> BGR
                    thickness= 8,
                    tipLength = 0.05
                )  
        except StopIteration:
            pass
        return frame
    
    video_raw = VideoFileClip(input_filepath)
    out_video = video_raw.fl_image(add_pointer)
    out_video.write_videofile(output_filepath, audio=True, logger=None)

def get_caption_chunks(text_segment, start_time_s, end_time_s):
    # TODO better split method, dynamic # words
    chunks = {}
    CHUNK_SIZE = 5
    word_list = text_segment.split(" ")
    if len(word_list) >= CHUNK_SIZE:
        chunks["text"] = np.array_split(word_list, len(word_list)//CHUNK_SIZE)   
        chunks["text"] = [" ".join(list(c)) for c in chunks["text"]]    
    else:
        chunks["text"] = [text_segment]

    time_chunk = (end_time_s - start_time_s) / len(chunks["text"])
    chunks["time_start"] = [start_time_s + time_chunk * i for i in range(len(chunks["text"]))]
    chunks["time_end"] = [chunk_start + time_chunk for chunk_start in chunks["time_start"]]

    return chunks