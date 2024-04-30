# SCSE23-0038 The Augmented Human -- Seeing Sounds
Final Year Project submitted to the School of Computer Science and Engineering of Nanyang Technological University in 2024

// TODO: attach link to report
// TODO: attach link to demo video

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


## Frontend (React JS)
*see application/fe*

Web page developed with [React Vite](https://vitejs.dev/) using components from [shadcn/ui](https://ui.shadcn.com/)


## Backend (Python)
*see application/be*

Backend built with [FastAPI](https://fastapi.tiangolo.com/)


## System flow
Input: video file of multiple speakers

1. Face detection with [MTCNN](https://github.com/timesler/facenet-pytorch?tab=readme-ov-file#guide-to-mtcnn-in-facenet-pytorch)
2. Speech separation with [VisualVoice](https://github.com/facebookresearch/VisualVoice/tree/main) (TODO modifications are detailed in ______.md)
3. Automated Speech Recognition (ASR) with [Whisper](https://github.com/openai/whisper)
4. Video annotation with [MoviePy](https://zulko.github.io/moviepy/)

Output: annotated video with captions and speaker identification 