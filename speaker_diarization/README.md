# Speaker diarization approach 
Speaker diarization was considered as an alternative to speech separation in an initial implementation. Unlike speech separation, which produces isolated speech signals for each speaker, speaker diarization is a purely audio-based task which aims to predict speaker identities for each time segment. Low confidence predictions could then be corroborated using the visual inputs, by applying a face detector and determining if the mouth of a potential speaker was open based on the distance between the facial landmarks on the upper and lower lip. 

This folder contains the initial implementation efforts for this alternative approach using speaker diarization and facial landmarks. The final solution for automated captioning and speaker identification uses speech separation, and can be found in the `application/be/video_processing` directory [here](../application/be/video_processing).

Pyannote (pyannote, 2023) was used for speaker diarization and Google’s MediaPipe Face Landmarker was used to identify the relative position of each speaker’s top and bottom lips. 

## Pyannote speaker diarization 
*See [`pyannote_test.py`](./pyannote_test.py)*

Input: video or wav file (prerecorded)

Sample output:
```
[0.89s - 2.06s]          SPEAKER_01
[2.53s - 3.52s]          SPEAKER_01
[3.56s - 16.37s]         SPEAKER_01
[13.55s - 14.16s]        SPEAKER_00
[16.08s - 16.99s]        SPEAKER_00
[16.99s - 18.17s]        SPEAKER_01
[17.24s - 20.08s]        SPEAKER_00
[19.76s - 26.41s]        SPEAKER_01
```

### Install requirements
Install pyannote based on their instructions [here](https://github.com/pyannote/pyannote-audio?tab=readme-ov-file#tldr).

Create `speaker_diarization/pyannote_config.py` and add your Hugging Face user access token. Do not post/upload this token publicly.
```py
HF_TOKEN = "YOUR TOKEN HERE"
```

## Mediapipe lip motion 
*See [`mediapipe_test.py`](./mediapipe_test.py)*

Input: video + microphone stream (live)

Output: annotated video stream 
* facial landmarks (via MediaPipe FaceMesh)
* voice activity detector output (via  WebRTC Voice Activity Detector)
* whether speaker is active (speech detected and mouth is open)

Configure settings in [`mediapipe_config.py`](./mediapipe_config.py).

### Install requirements
```
pip3 install opencv-python
pip3 install mediapipe
pip3 install webrtcvad
```
Install pyaudio according to instructions [here](https://people.csail.mit.edu/hubert/pyaudio/).
```
brew install portaudio
pip3 install pyaudio
```

### References
* Landmark IDs and positions [here](https://storage.googleapis.com/mediapipe-assets/documentation/mediapipe_face_landmark_fullsize.png)
* Mediapipe documentation [docs](https://mediapipe.readthedocs.io/en/latest/solutions/face_mesh.html)
* Mediapipe landmarks for images [tutorial](https://developers.google.com/mediapipe/solutions/vision/face_landmarker/python#image)
* Mediapipe landmarks for video stream [tutorial](https://developers.google.com/mediapipe/solutions/vision/face_landmarker/python#live-stream)