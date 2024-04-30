import numpy as np

def rgb_to_rgb_str(rgb_tuple):
    r, g, b = rgb_tuple
    return f"rgb({r},{g},{b})"


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