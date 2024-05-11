import cv2
import mediapipe as mp
import pyaudio
import time
import webrtcvad
from mediapipe_config import *

RED_BGR = (35, 35, 255)
GREEN_BGR = (35, 255, 35)

def dist_btw_lm(lm1, lm2):
    # euclidean distance in xy plane, normalized by image size 
    return ( (lm1.x - lm2.x) ** 2 + (lm1.y - lm2.y) ** 2 ) ** 0.5

def annotate_connected_lms(video_frame, face_landmarks):
    mp_drawing = mp.solutions.drawing_utils
    mp_drawing_styles = mp.solutions.drawing_styles
    mp_face_mesh = mp.solutions.face_mesh
    # drawing_spec = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)

    mp_drawing.draw_landmarks(
        image=video_frame,
        landmark_list=face_landmarks,
        connections=mp_face_mesh.FACEMESH_TESSELATION,
        landmark_drawing_spec=None,
        connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_tesselation_style())
    mp_drawing.draw_landmarks(
        image=video_frame,
        landmark_list=face_landmarks,
        connections=mp_face_mesh.FACEMESH_CONTOURS,
        landmark_drawing_spec=None,
        connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_contours_style())
    mp_drawing.draw_landmarks(
        image=video_frame,
        landmark_list=face_landmarks,
        connections=mp_face_mesh.FACEMESH_IRISES,
        landmark_drawing_spec=None,
        connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_iris_connections_style())

def annotate_lms(video_frame, face_landmarks):
    img_height, img_width, img_channels = video_frame.shape
    for (lm_id, landmark) in enumerate(face_landmarks.landmark):
        # convert normalized xyz coordinates to pixel coordinates 
        x = int(landmark.x * img_width)
        y = int(landmark.y * img_height)
        cv2.drawMarker(
            img= video_frame,
            position= (x, y),
            color= (0, 255, 255), 
            markerType= cv2.MARKER_CROSS,
            markerSize= 10,
            thickness= 1
        )

        if lm_id == 10:
            top_coords = (x, y)

    return top_coords

def annotate_speaker(video_frame, x, y, text, colour):
    cv2.putText(
        img= video_frame, 
        text= text, 
        org= (x - len(text)//2*20, y - 10), 
        fontFace= cv2.FONT_HERSHEY_SIMPLEX, 
        fontScale= 1.25, 
        color= colour,
        thickness= 3
    )

def annotate_fps(video_frame, prev_time, curr_time):
    fps = 1/(curr_time-prev_time)
    cv2.putText(
        img= video_frame, 
        text=  f'FPS:{int(fps)}', 
        org= (20, 110), 
        fontFace= cv2.FONT_HERSHEY_SIMPLEX, 
        fontScale= 1, 
        color= (255, 0, 0), # BGR
        thickness= 2
    )

def annotate_vad(video_frame, vad_is_speech):
    cv2.putText(
        img= video_frame, 
        text=  f'VAD speech detected: {vad_is_speech}', 
        org= (20, 150), 
        fontFace= cv2.FONT_HERSHEY_SIMPLEX, 
        fontScale= 1, 
        color= GREEN_BGR if vad_is_speech else RED_BGR,
        thickness= 2
    )

def annotate_quit_instructions(video_frame, quit_key):
    cv2.putText(
        img= video_frame, 
        text=  f'PRESS {quit_key.upper()} TO QUIT', 
        org= (20, 70), 
        fontFace= cv2.FONT_HERSHEY_SIMPLEX, 
        fontScale= 1, 
        color= (255, 0, 0), # BGR
        thickness= 2
    )

def detect_speaker_stream(audio_stream, video_stream, mpFaceMesh, vad):
    prev_time = 0
    while True:
        audio_frame = audio_stream.read(CHUNK, exception_on_overflow = False)

        result, video_frame = video_stream.read()  # read frames from video
        curr_time = time.time()
        if result is False: 
            print("Error reading frame from video input... Exiting.")
            break  

        frameRGB = cv2.cvtColor(video_frame, cv2.COLOR_BGR2RGB)
        results = mpFaceMesh.process(frameRGB) 
        if not results.multi_face_landmarks:
            print("Error getting facial landmarks... Skipping frame.")
            continue
        
        # detect speech w voice activity detector
        vad_is_speech = vad.is_speech(audio_frame, RATE)

        # show VAD results
        annotate_vad(video_frame, vad_is_speech)

        # detect open mouth w facial landmarks
        for (face_id, face_landmarks) in enumerate(results.multi_face_landmarks):
            # calculate lip distance
            lip_distance_middle = dist_btw_lm(face_landmarks.landmark[13], face_landmarks.landmark[14])
            lip_distance_left = dist_btw_lm(face_landmarks.landmark[82], face_landmarks.landmark[87])
            lip_distance_right = dist_btw_lm(face_landmarks.landmark[312], face_landmarks.landmark[317])
            lip_distance_avg = (lip_distance_middle + lip_distance_left + lip_distance_right) / 3

            # speaker_annotation = f'avg={lip_distance_left:0.3f} {lip_distance_left:0.3f}/{lip_distance_middle:0.3f}/{lip_distance_right:0.3f}'
            if vad_is_speech and lip_distance_avg > LIP_THRESHOLD: 
                speaker_annotation = f'ID {face_id}: SPEAKING (dist={lip_distance_avg:0.5f})'
                speaker_colour = GREEN_BGR
            else: 
                speaker_annotation = f'ID {face_id}: NOT SPEAKING (dist={lip_distance_avg:0.5f})'
                speaker_colour = RED_BGR

            # show landmark results
            if REFINE_LANDMARKS:
                # connect landmarks, only works if refine_landmarks=True in FaceMesh init
                annotate_connected_lms(video_frame, face_landmarks)
            
            # annotate video frames with landmarks
            x, y = annotate_lms(video_frame, face_landmarks)
            annotate_speaker(video_frame, x, y, speaker_annotation, speaker_colour)

        # show FPS
        annotate_fps(video_frame, prev_time, curr_time)
        prev_time = curr_time
        
        # show quit instructions 
        quit_key = "q"
        annotate_quit_instructions(video_frame, quit_key)
        
        # display annotated stream in output window
        cv2.imshow("Detected facial landmarks", video_frame)  
        # press q to quit, delay in milliseconds
        if cv2.waitKey(1) & 0xFF == ord(quit_key): 
            break

def vad_landmark():
    # set up camera input for video stream
    video_capture = cv2.VideoCapture(0) # default camera

    # set up microphone input for audio stream
    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    # set up voice activity detector for speech detection
    vad = webrtcvad.Vad() 
    vad.set_mode(VAD_AGGRESSION) 

    # set up mediapipe facemesh for facial landmark detection
    mpFaceMesh = mp.solutions.face_mesh.FaceMesh(
        max_num_faces=MAX_NUM_FACES, 
        refine_landmarks=REFINE_LANDMARKS 
    )

    # annotated video stream opens in new window
    detect_speaker_stream(
        audio_stream = stream,
        video_stream = video_capture,
        mpFaceMesh = mpFaceMesh,
        vad = vad
    )

    # clean up: close video stream and output window
    video_capture.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    vad_landmark()