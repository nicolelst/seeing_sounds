# SCSE23-0038 The Augmented Human -- Seeing Sounds
Final Year Project submitted to the School of Computer Science and Engineering of Nanyang Technological University in 2024

[Final report](https://hdl.handle.net/10356/175150)

// TODO: attach link to demo video


## Frontend (React JS)
*see application/fe*

Web page developed with [React Vite](https://vitejs.dev/) using components from [shadcn/ui](https://ui.shadcn.com/)

#### Install dependencies and update packages
```
cd application/fe
pnpm install
pnpm update
```

## Backend (Python)
*see application/be*

Backend built with [FastAPI](https://fastapi.tiangolo.com/) in Python 3.8.9.

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