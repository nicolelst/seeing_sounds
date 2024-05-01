import datetime
import os
import re

import whisper
from whisper.utils import get_writer

ISOLATED_AUDIO_FILE_REGEX = "speaker[0-9]+.wav"
WHISPER_TRANSCRIPT_FORMATS = ["srt", "vtt", "tsv", "json"] 

def whisper_speech_recognition(
        audio_track_dir, 
        transcript_dir, 
        model_name = "small",  # tiny, base, small, medium, large
        output_format = "json", 
        logs_filepath = None
):
    if not os.path.exists(transcript_dir):
        os.mkdir(transcript_dir)

    if logs_filepath != None:
        logs_file = open(logs_filepath, "w")
        print(f"[{datetime.datetime.now()}]", file=logs_file)
    else:
        logs_file = None

    model = whisper.load_model(model_name)
    for filename in os.listdir(audio_track_dir):
        if re.match(ISOLATED_AUDIO_FILE_REGEX, filename):
            print(f"Getting transcript for {filename}", file=logs_file)
            audio_filepath = os.path.join(audio_track_dir, filename)
            result = model.transcribe(audio_filepath)

            if output_format in WHISPER_TRANSCRIPT_FORMATS:
                output_writer = get_writer(output_format, transcript_dir)
                output_writer(result, audio_filepath)
            else:
                print("[ERROR] Invalid Whisper output format -", output_format, file=logs_file)
    

    transcript_list = [os.path.join(transcript_dir, file) for file in os.listdir(transcript_dir) if file.endswith("." + output_format)]
    transcript_list.sort()

    if logs_file != None:
        logs_file.close()
    
    return transcript_list
