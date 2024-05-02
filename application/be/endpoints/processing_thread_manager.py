import os
from threading import Thread
from typing import Any, Callable, Mapping

from utils.path_constants import *
from utils.status_types import ProcessingStatus


class ProcessingThreadManager:
    def __init__(self):
        self.threads: dict[str, Thread] = {}
    

    def add(self, request_id: str, processing_func: Callable, kwargs: Mapping[str, Any]):
        video_proc_thread = Thread(
            name = request_id, 
            target = processing_func, 
            kwargs = kwargs,
            daemon = True
        )
        self.threads[request_id] = video_proc_thread
        video_proc_thread.start()
        print(f"[{request_id}] starting video processing thread")
    

    def is_valid(self, request_id: str) -> bool: 
        if request_id in self.threads:
            return True
        else:
            return False
    

    def is_in_progress(self, request_id: str) -> bool: 
        # request still in progress, not completed or terminated due to error
        if self.is_valid(request_id):
            return self.threads[request_id].is_alive()
        else:
            return False
    

    def get_status(self, request_id: str) -> ProcessingStatus:
        if self.is_in_progress(request_id) and os.path.exists(os.path.join(STORAGE_DIR, request_id, LOGS_FOLDER, ANNOTATION_LOGS_FILENAME)):
            return ProcessingStatus.ANNOTATION
        elif not self.is_in_progress(request_id) and len(os.listdir(os.path.join(STORAGE_DIR, request_id, OUTPUT_FOLDER))) > 0:
            return ProcessingStatus.COMPLETE
        elif self.is_in_progress(request_id) and os.path.exists(os.path.join(STORAGE_DIR, request_id, LOGS_FOLDER, SPEECH_REC_LOGS_FILENAME)):
            return ProcessingStatus.SPEECH_REC
        elif self.is_in_progress(request_id) and os.path.exists(os.path.join(STORAGE_DIR, request_id, LOGS_FOLDER, SPEECH_SEP_LOGS_FILENAME)):
            return ProcessingStatus.SPEECH_SEP
        elif self.is_in_progress(request_id) and os.path.exists(os.path.join(STORAGE_DIR, request_id, LOGS_FOLDER, PREPROC_LOGS_FILENAME)):
            return ProcessingStatus.PREPROCESSING
        elif self.is_in_progress(request_id) and os.path.isdir(os.path.join(STORAGE_DIR, request_id)):
            return ProcessingStatus.RECEIVED
        else:
            return ProcessingStatus.ERROR
        

    def get_error_msg(self, request_id: str) -> str:
        if self.get_status(request_id) != ProcessingStatus.ERROR:
            return ""
        
        if os.path.exists(os.path.join(STORAGE_DIR, request_id, LOGS_FOLDER, ANNOTATION_LOGS_FILENAME)):
            return "Error occurred during ANNOTATION"
        elif os.path.exists(os.path.join(STORAGE_DIR, request_id, LOGS_FOLDER, SPEECH_REC_LOGS_FILENAME)):
            return "Error occurred during SPEECH_REC"
        elif os.path.exists(os.path.join(STORAGE_DIR, request_id, LOGS_FOLDER, SPEECH_SEP_LOGS_FILENAME)):
            return "Error occurred during SPEECH_SEP"
        elif os.path.exists(os.path.join(STORAGE_DIR, request_id, LOGS_FOLDER, PREPROC_LOGS_FILENAME)):
            return "Error occurred during PREPROCESSING"
        elif os.path.isdir(os.path.join(STORAGE_DIR, request_id)):
            return "Error occurred during RECEIVED"
        else:
            return "Unexpected error occurred"

