import os

import whisper
from whisper.utils import get_writer

def whisper_get_transcript(
        audio_filepath, 
        output_dir,
        output_format, # srt, vtt, tsv, json
        model_name # tiny, base, small, medium, large
    ):
    model = whisper.load_model(model_name)
    result = model.transcribe(audio_filepath)

    if output_format in ["srt", "vtt", "tsv", "json"]:
        if not os.path.exists(output_dir):
            os.mkdir(output_dir)
        output_writer = get_writer(output_format, output_dir)
        output_writer(result, audio_filepath)
    else:
        print("Invalid Whisper output format -", output_format)
    
    return result