# SCSE23-0038 The Augmented Human -- Seeing Sounds
Final Year Project submitted to the School of Computer Science and Engineering of Nanyang Technological University in 2024

[Final report](https://hdl.handle.net/10356/175150)

// TODO: attach link to demo video

## About this project 
The World Health Organisation estimates that hearing loss will impact 2.5 billion people by 2050, and such conditions will be disabling for 10% of the global population. The growing demand for assistive technology for hearing impairment can be attributed to a globally ageing population and unsafe listening practices among young adults. 

“Dinner table syndrome” describes the isolation faced by many deaf people due to difficulties engaging in group conversations with multiple non-signing hearing people. Participating in such conversations can be difficult for those with hearing loss due to the time required to process auditory inputs, reluctance to ask for repetition, and missing common verbal cues for turn-taking such as intonational change and pauses. The need to compensate for missing or unclear speech may require additional cognitive effort, which can lead to excess fatigue. As such, the exclusion of deaf people from avenues for bonding and socialisation, such as the dinner table, can result in isolation and loneliness.

This project explores the design and implementation of an application which provides accessibility to hearing impaired users, specifically in the context of conversations involving multiple speakers. The proposed application differentiates itself from existing solutions for automated captioning, by identifying the active speaker in addition to providing captions for what is being said. After uploading a video, selecting an annotation interface and specifying other settings, the user is able to download an annotated video with captions for each speaker as well as a transcript. The application aims to reduce barriers to understanding group conversations for those with hearing loss, and could be used for recorded panel discussions, meetings, and interviews.

## Getting started 
Port numbers are specified in [port_config.json](./application/port_config.json).

### Install dependencies
#### Frontend packages
```
cd application/fe
pnpm install
pnpm update
```

#### FastAPI requirements
```
pip install fastapi
pip install python-multipart
pip install "uvicorn[standard]"
pip install websockets
```

#### VisualVoice speech separation requirements
```
brew install ffmpeg

pip install face-alignment 
pip install facenet-pytorch
pip install h5py
pip install av

pip install -U openmim
mim install mmcv
```

#### VisualVoice pretrained models 
Follow instructions [here](https://github.com/facebookresearch/VisualVoice?tab=readme-ov-file#demo-with-the-pre-trained-models) to download pretrained model weights into `application/be/video_processing/VisualVoice/pretrained_models`.
```
cd application/be/video_processing/VisualVoice/pretrained_models
wget http://dl.fbaipublicfiles.com/VisualVoice/av-speech-separation-model/facial_best.pth
wget http://dl.fbaipublicfiles.com/VisualVoice/av-speech-separation-model/lipreading_best.pth
wget http://dl.fbaipublicfiles.com/VisualVoice/av-speech-separation-model/unet_best.pth
wget http://dl.fbaipublicfiles.com/VisualVoice/av-speech-separation-model/vocal_best.pth
```

#### Whisper speech recognition requirements
```
pip install setuptools-rust
pip install -U openai-whisper
```

#### Transcript generation requirements 
```
pip install python-docx
```

### Run application

#### Run application using bash script 
These commands were tested on a Mac zsh terminal.
```
sudo chmod +x application/run_application.sh
./application/run_application.sh
```

#### Run application manually
Run backend on http://localhost:8000
View Swagger UI on http://localhost:8000/docs 
```
cd application/be/endpoints
uvicorn main:app --reload --port 8000
```

Run frontend on http://localhost:8001/
```
cd application/fe
pnpm run dev
```

## Directory structure
```
.
├── application                                     # Final application
│   ├── be                                          # Backend
│   │   ├── endpoints                               # FastAPI endpoints
│   │   │   ├── ...
│   │   │   └── main.py                             # Backend server entry point
│   │   ├── utils
│   │   ├── video_processing                        # Logic for captioning + speaker identification
│   │   │   ├── annotation                          # Video annotation 
│   │   │   ├── transcript                          # Transcript generation 
│   │   │   ├── VisualVoice                         # Speech separation code from VisualVoice
│   │   │   ├── process_video.py                    # Video processing main function
│   │   │   ├── speech_recognition.py               # Speech recognition with Whisper
│   │   │   ├── speech_separation.py                # Speech separation with VisualVoice
│   │   │   ├── video_preprocessing.py              # Video preprocessing: resampling, face detection
│   │   │   └── visual_voice_changes.md             # Modifications to VisualVoice code
│   │   └── requirements.txt                        # Required packages for backend
│   ├── fe                                          # Frontend
│   │   ├── ...
│   │   ├── src
│   │   │   ├── ...
│   │   │   ├── components                          # Custom components 
│   │   │   ├── shadcn                              # shadcn/ui components
│   │   │   ├── App.tsx
│   │   │   └── main.tsx                            # Frontend entry point to React application
│   │   └── vite.config.ts                          # Frontend server config
│   ├── port_config.json                            # Application config for port numbers
│   └── run_application.sh                          # Bash script to start BE and FE servers
├── speaker_diarization                             # Alternative approach initial implementations
│   ├── mediapipe_config.py
│   ├── mediapipe_test.py                           # Active speaker detection with WebRTC VAD and MediaPipe facial landmarks
│   ├── pyannote_config.py                          # TODO: create this file and add HF_TOKEN
│   ├── pyannote_test.py                            # Speaker diarization
│   ├── README.md
│   └── requirements.txt                            # Required packages
├── .gitignore
└── README.md
```

## Frontend (React JS)
*see `application/fe`*

Web page developed with [React Vite](https://vitejs.dev/) using components from [shadcn/ui](https://ui.shadcn.com/)

## Backend (Python)
*see `application/be`*

Backend built with [FastAPI](https://fastapi.tiangolo.com/) in Python 3.8.9. A list of packages and versions used can be found in [requirements.txt](./application/be/requirements.txt).

### Video processing flow
Input: video file of multiple speakers

1. Preprocessing of raw video input with [FFmpeg](https://ffmpeg.org/about.html)
2. Face detection with [MTCNN](https://github.com/timesler/facenet-pytorch?tab=readme-ov-file#guide-to-mtcnn-in-facenet-pytorch)
3. Speech separation with [VisualVoice](https://github.com/facebookresearch/VisualVoice/tree/main) (modifications are detailed in [visual_voice_changes.md](./application/be/video_processing/visual_voice_changes.md))
4. Automated Speech Recognition (ASR) with [Whisper](https://github.com/openai/whisper)
5. Video annotation with [MoviePy](https://zulko.github.io/moviepy/)
6. Transcript generation with [python-docx](https://python-docx.readthedocs.io/en/latest/)

Output: annotated video + transcript with captions and speaker identification 

### API endpoints
1. POST /upload_video
   - Expected response
     - 202 Accepted
     - returns request ID
   - query parameters
     - video settings: annotation interface, caption text colour, caption font size, number of speakers, speaker colours 
     - speech separation model settings: hop length, number of identity frames per speaker, VisualVoice visual feature type (lipmotion/identity/both)
     - speech recognition model settings: Whisper model size, whether to use english only model (not available for large model)
     - query body: input video file (mp4)
2. OPEN WEBSOCKET /ws/status/{request_id}
   - message format from BE
   ```json
   {
    request_id: "request id",
    status: "processing status",
    message: "error message if any"
   }
   ```
3. GET /download_annotated
   - query params: request ID
   - returns zip folder (`.zip`) with annotated video file (`.mp4`) and subfolder of speaker thumbnail images (`.png`)
4. GET /download_transcript"
   - query params
     - request ID
     - speaker names
     - speaker colours
   - returns annotated transcript (`.docx`)

## Acknowledgements
[VisualVoice](https://github.com/facebookresearch/VisualVoice/tree/main) is licensed under CC BY-NC ([Attribution-NonCommercial 4.0 International](https://creativecommons.org/licenses/by-nc/4.0/)). Licensing information can be found [here](https://github.com/facebookresearch/VisualVoice?tab=License-1-ov-file#readme). Changes are documented in [visual_voice_changes.md](./application/be/video_processing/visual_voice_changes.md).