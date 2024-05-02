import portConfig from "../../port_config.json";

const API_ORIGIN = `http://localhost:${portConfig.be}/`;
const UPLOAD_VIDEO_URL = API_ORIGIN + "upload_video/";
const DOWNLOAD_VIDEO_URL = API_ORIGIN + "download_annotated/";

export { API_ORIGIN, UPLOAD_VIDEO_URL, DOWNLOAD_VIDEO_URL };
