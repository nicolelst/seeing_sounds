# SCSE23-0038 The Augmented Human -- Seeing Sounds
Final Year Project submitted to the School of Computer Science and Engineering of Nanyang Technological University in 2024

[Final report](https://hdl.handle.net/10356/175150)

// TODO: attach link to demo video


## Frontend (React JS)
*see application/fe*

Web page developed with [React Vite](https://vitejs.dev/) using components from [shadcn/ui](https://ui.shadcn.com/)


## Backend (Python)
*see application/be*

Backend built with [FastAPI](https://fastapi.tiangolo.com/) in Python 3.8.9.

Install requirements for FastAPI
```
pip install fastapi
pip install python-multipart
pip install "uvicorn[standard]"
```

Install requirements for speech separation with VisualVoice
```
brew install ffmpeg

pip install face-alignment 
pip install facenet-pytorch
pip install h5py
pip install av

pip install -U openmim
mim install mmcv
```

Download VisualVoice pretrained models into `application/be/video_processing/VisualVoice/pretrained_models`.
(based on instructions [here](https://github.com/facebookresearch/VisualVoice?tab=readme-ov-file#demo-with-the-pre-trained-models))
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


## Running the application 
Run backend on http://localhost:8000
View Swagger UI on http://localhost:8000/docs 
```
cd application/be/endpoints
uvicorn main:app --reload
```

Run frontend on http://localhost:5173/
```
cd application/fe
pnpm run dev
```


## System flow
Input: video file of multiple speakers

1. Face detection with [MTCNN](https://github.com/timesler/facenet-pytorch?tab=readme-ov-file#guide-to-mtcnn-in-facenet-pytorch)
2. Speech separation with [VisualVoice](https://github.com/facebookresearch/VisualVoice/tree/main) (TODO modifications are detailed in ______.md)
3. Automated Speech Recognition (ASR) with [Whisper](https://github.com/openai/whisper)
4. Video annotation with [MoviePy](https://zulko.github.io/moviepy/)

Output: annotated video with captions and speaker identification 


## Acknowledgements
[VisualVoice](https://github.com/facebookresearch/VisualVoice/tree/main) is licensed under CC BY-NC ([Attribution-NonCommercial 4.0 International](https://creativecommons.org/licenses/by-nc/4.0/)). Licensing information can be found [here](https://github.com/facebookresearch/VisualVoice?tab=License-1-ov-file). Changes are documented in [visual_voice_changes.md](./application/be/video_processing/visual_voice_changes.md).