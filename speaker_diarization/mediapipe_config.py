import pyaudio
from sys import platform

PREDICTION_BUFFER = 1 # time between speaker prediction updates, in seconds

# visual
MAX_NUM_FACES = 1 
LIP_THRESHOLD = 0.008
# set REFINE_LANDMARKS to true for attention mesh model on semantically meaningful face regions
# more accurate lips/eyes/irises at cost of expensive compute 
REFINE_LANDMARKS = False 

# audio
FORMAT = pyaudio.paInt16 # 16-bit mono PCM audio input
CHANNELS = 1 if platform == 'darwin' else 2
RATE = 32000 # frames / sec, sampling rate = 8000/16000/32000/48000Hz
FRAME_LENGTH = 30 * 1e-3 # audio frame duration = 10/20/30ms 
CHUNK = int(FRAME_LENGTH * RATE) # frames per buffer, used for 1 prediction
VAD_AGGRESSION = 2 # aggressiveness mode (0 = least aggressive about filtering out non-speech, max = 3)
AUDIO_FRAME_THRESHOLD = 0.5 # % audio frames with detected speech to classify as speaking
