import os
import re
from zipfile import ZipFile

from utils.video_name_constants import *


def zip_results(request_id):
    req_dir = get_req_dir(request_id)

    video_filepath = get_output_video_filename(request_id)
    annot_type = get_annotation_type(video_filepath)

    thumbnail_paths = []
    faces_dir = os.path.join(req_dir, "faces")
    for filename in os.listdir(faces_dir):
        if re.match("speaker[\d]+_best.png", filename):
            thumbnail_paths.append(os.path.join(faces_dir, filename))
    
    zipfile_name = os.path.join(req_dir, OUTPUT_FOLDER, f"{request_id}_{annot_type}.zip")
    with ZipFile(zipfile_name, mode="w") as zipfile:
        zipfile.write(
            filename = video_filepath,
            arcname = ANNOTATED_VIDEO_NAME,
        )
        for thumbnail_filepath in thumbnail_paths:
            archive_path = os.path.join(THUMBNAIL_DIR_NAME, thumbnail_filepath.split("/")[-1].replace("_best", ""))
            zipfile.write(
                filename = thumbnail_filepath,
                arcname = archive_path,
            )

    return zipfile_name
        