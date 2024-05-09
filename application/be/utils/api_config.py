from enum import Enum
import json


port_config = json.load(open("../../port_config.json", "r"))
CORS_ORIGINS = [
    f"http://localhost:{port_config['fe']}",
    f"http://localhost:{port_config['be']}",
]

STATUS_POLLING_DELAY_SEC = 5

class Routes(str, Enum):
    POST_UPLOAD_VIDEO = "/upload_video"
    STATUS_WEBSOCKET = "/ws/status"
    GET_ANNOTATED_VIDEO = "/download_annotated"