import os
import subprocess
from pyannote.audio import Pipeline
from pyannote.audio.pipelines.utils.hook import ProgressHook

from pyannote_config import HF_TOKEN


def convert_to_wav(filepath, reconvert=False):
    if filepath.split(".")[-1] == "wav":
        return filepath
    else:
        audio_filepath = f"{filepath[:-4]}.wav"
        if not os.path.exists(audio_filepath) or reconvert:
            command = f"ffmpeg -i {filepath} -vn {audio_filepath}"
            subprocess.call(command, shell=True)
        return audio_filepath
    
def diarize(filepath):
    pipeline = Pipeline.from_pretrained(
        "pyannote/speaker-diarization-3.1",
        use_auth_token=HF_TOKEN)

    # apply pretrained pipeline
    with ProgressHook() as hook:
        diarization = pipeline(filepath, hook=hook, num_speakers=2)
    # automatically downmixes to mono audio resampled at 16kHz 
    # outputs speaker diarization as an Annotation instance: https://pyannote.github.io/pyannote-core/structure.html#annotation

    # print the result
    for turn, _, speaker in diarization.itertracks(yield_label=True):
        time = f"[{turn.start:.2f}s - {turn.end:.2f}s]"
        print("%-25s%s" % (time, speaker))

if __name__ == "__main__":
    filepath = input("Enter path to file to be diarized: ")
    audio_filepath = convert_to_wav(filepath)
    diarize(audio_filepath)
