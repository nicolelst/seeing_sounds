# SCSE23-0038 The Augmented Human -- Seeing Sounds
Final Year Project submitted to the School of Computer Science and Engineering of Nanyang Technological University in 2024

[Final report](https://hdl.handle.net/10356/175150)

// TODO: attach link to demo video

## About this project 
The World Health Organisation estimates that hearing loss will impact 2.5 billion people by 2050, and such conditions will be disabling for 10% of the global population. The growing demand for assistive technology for hearing impairment can be attributed to a globally ageing population and unsafe listening practices among young adults. 

“Dinner table syndrome” describes the isolation faced by many deaf people due to difficulties engaging in group conversations with multiple non-signing hearing people. Participating in such conversations can be difficult for those with hearing loss due to the time required to process auditory inputs, reluctance to ask for repetition, and missing common verbal cues for turn-taking such as intonational change and pauses. The need to compensate for missing or unclear speech may require additional cognitive effort, which can lead to excess fatigue. As such, the exclusion of deaf people from avenues for bonding and socialisation, such as the dinner table, can result in isolation and loneliness.

This project explores the design and implementation of an application which provides accessibility to hearing impaired users, specifically in the context of conversations involving multiple speakers. The proposed application differentiates itself from existing solutions for automated captioning, by identifying the active speaker in addition to providing captions for what is being said. After uploading a video, selecting an annotation interface and specifying other settings, the user is able to download an annotated video with captions for each speaker as well as a transcript. The application aims to reduce barriers to understanding group conversations for those with hearing loss, and could be used for recorded panel discussions, meetings, and interviews.

## Directory structure
```
.
├── application                                     # TODO desc
│   ├── be                                          # desc
│   │   ├── endpoints
│   │   │   ├── ...
│   │   │   └── main.py
│   │   ├── utils
│   │   ├── video_processing
│   │   │   ├── annotation
│   │   │   ├── transcript
│   │   │   ├── VisualVoice
│   │   │   ├── process_video.py
│   │   │   ├── speech_recognition.py
│   │   │   ├── speech_separation.py
│   │   │   ├── video_preprocessing.py
│   │   │   └── visual_voice_changes.md
│   │   └── requirements.txt
│   ├── fe                                          # desc
│   │   ├── ...
│   │   ├── src
│   │   │   ├── ...
│   │   │   ├── components
│   │   │   ├── shadcn
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   └── vite.config.ts
│   ├── port_config.json
│   └── run_application.sh
├── speaker_diarization
│   ├── TODO                                        # description
│   └── README.md
├── .gitignore
└── README.md
```


## Frontend (React JS)
*see `application/fe`*

Web page developed with [React Vite](https://vitejs.dev/) using components from [shadcn/ui](https://ui.shadcn.com/)

#### Install dependencies and update packages
```
cd application/fe
pnpm install
pnpm update
```

## Backend (Python)
*see `application/be`*

Backend built with [FastAPI](https://fastapi.tiangolo.com/) in Python 3.8.9. A list of packages and versions used can be found in [requirements.txt](./application/be/requirements.txt).

#### Install requirements for FastAPI
```
pip install fastapi
pip install python-multipart
pip install "uvicorn[standard]"
pip install websockets
```

#### Install requirements for speech separation with VisualVoice
```
brew install ffmpeg

pip install face-alignment 
pip install facenet-pytorch
pip install h5py
pip install av

pip install -U openmim
mim install mmcv
```

#### Download VisualVoice pretrained models 
Follow instructions [here](https://github.com/facebookresearch/VisualVoice?tab=readme-ov-file#demo-with-the-pre-trained-models) to download pretrained model weights into `application/be/video_processing/VisualVoice/pretrained_models`.
```
cd application/be/video_processing/VisualVoice/pretrained_models
wget http://dl.fbaipublicfiles.com/VisualVoice/av-speech-separation-model/facial_best.pth
wget http://dl.fbaipublicfiles.com/VisualVoice/av-speech-separation-model/lipreading_best.pth
wget http://dl.fbaipublicfiles.com/VisualVoice/av-speech-separation-model/unet_best.pth
wget http://dl.fbaipublicfiles.com/VisualVoice/av-speech-separation-model/vocal_best.pth
```


Install requirements for speech recognition with Whisper
```
pip install setuptools-rust
pip install -U openai-whisper
```

Install requirements for generating transcript as word document (.docx)
```
pip install python-docx
```


## Running the application 
Port numbers are specified in [port_config.json](./application/port_config.json).

### Run using bash script 
These commands were tested on a Mac zsh terminal.
```
sudo chmod +x application/run_application.sh
./application/run_application.sh
```

### Run manually
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


## System flow
Input: video file of multiple speakers

1. Face detection with [MTCNN](https://github.com/timesler/facenet-pytorch?tab=readme-ov-file#guide-to-mtcnn-in-facenet-pytorch)
2. Speech separation with [VisualVoice](https://github.com/facebookresearch/VisualVoice/tree/main) (modifications are detailed in [visual_voice_changes.md](./application/be/video_processing/visual_voice_changes.md))
3. Automated Speech Recognition (ASR) with [Whisper](https://github.com/openai/whisper)
4. Video annotation with [MoviePy](https://zulko.github.io/moviepy/)

Output: annotated video with captions and speaker identification 


## Acknowledgements
[VisualVoice](https://github.com/facebookresearch/VisualVoice/tree/main) is licensed under CC BY-NC ([Attribution-NonCommercial 4.0 International](https://creativecommons.org/licenses/by-nc/4.0/)). Licensing information can be found [here](https://github.com/facebookresearch/VisualVoice?tab=License-1-ov-file#readme). Changes are documented in [visual_voice_changes.md](./application/be/video_processing/visual_voice_changes.md).