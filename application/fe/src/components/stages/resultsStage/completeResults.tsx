import { ReactElement, useCallback, useEffect, useState } from "react";
import JSZip from "jszip";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Button } from "@/shadcn/components/ui/button";
import { VideoIcon } from "@radix-ui/react-icons";
import ReactPlayer from "react-player";
import { annotationType, annotationTypeMap } from "@/types/annotationType";
import GetTranscriptButton from "./getTranscriptButton";
import SpeakerListDisplay from "./speakerListDisplay";
import { DOWNLOAD_VIDEO_URL } from "@/routes";
import downloadFile from "./downloadFile";

interface CompleteResultsProps {
  requestID: string;
  filename: string;
  annotationType: annotationType;
  speakerColours: Array<string>;
  numSpeakers: number;
}

export default function CompleteResults({
  requestID,
  filename,
  annotationType,
  speakerColours,
  numSpeakers,
}: CompleteResultsProps): ReactElement {
  // output URLs for displaying
  const [videoURL, setVideoURL] = useState<string>("");
  const [thumbnailURLs, setThumbnailURLs] = useState<Array<string>>([]);

  // parse results zip file from response and create URLs
  const processResponse = useCallback(async (response: Response) => {
    const blob = await response.blob();
    const zip = await JSZip.loadAsync(blob);

    const videoFilename = response.headers.get("video_filename");
    if (videoFilename) {
      const videoFile = zip.file(videoFilename);
      if (videoFile) {
        videoFile
          .async("blob")
          .then((videoBlob) => setVideoURL(URL.createObjectURL(videoBlob)));
      }
    }

    const thumbnailDir = response.headers.get("thumbnail_dir");
    if (thumbnailDir) {
      const thumbnailFiles = zip.file(new RegExp(`${thumbnailDir}/.*`));
      // sort files by speaker ID
      const thumbnailPaths = thumbnailFiles
        .map((f) => f.name)
        .sort((a, b) => {
          // parse speaker ID: remove file extension, non numerical characters
          const getSpeakerID = (filepath: string) =>
            parseInt(filepath.replace(/(\..+$|[^\d]+)/, ""));
          return getSpeakerID(a) - getSpeakerID(b);
        });
      // create thumbnail URLs
      const getNewThumbnailURLs = async (thumbnailPaths: Array<string>) => {
        const newThumbnailURLs = new Array<string>();
        for (const path of thumbnailPaths) {
          zip
            .file(path)
            ?.async("blob")
            .then((thumbnailBlob) => {
              // create URL for speaker thumbnail
              const thumbnailURL = URL.createObjectURL(thumbnailBlob);
              newThumbnailURLs.push(thumbnailURL);
            });
        }
        return newThumbnailURLs;
      };
      setThumbnailURLs(await getNewThumbnailURLs(thumbnailPaths));
    }
  }, []);

  // GET request for results
  useEffect(() => {
    const queryURL = `${DOWNLOAD_VIDEO_URL}?request_id=${encodeURIComponent(
      requestID
    )}`;
    const getResults = async () => {
      console.log("GET", queryURL);

      const response = await fetch(queryURL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      console.log(
        "GET ANNOTATED VIDEO REQUEST:",
        response.status,
        response.statusText
      );

      if (response.ok) {
        // console.log("OK:", new Map(response.headers));
        processResponse(response);
      } else {
        console.log("PROBLEM:", new Map(response.headers));
        // TODO trigger a pop up
      }
    };
    getResults();
  }, [processResponse, requestID]);

  const downloadVideo = () =>
    downloadFile(
      videoURL,
      `${filename.replace(/\..+$/, "")}_annotated_${annotationType}.mp4`,
      "video/mp4"
    );

  return (
    <div className="grid grid-cols-3 w-full h-full">
      <div className="col-span-2 flex items-center justify-center">
        <AspectRatio ratio={16 / 9}>
          <ReactPlayer
            url={videoURL}
            width="100%"
            height="100%"
            controls={true}
          />
        </AspectRatio>
      </div>
      <div className="col-span-1 flex flex-col gap-y-4 py-3 px-4 ml-2 justify-center">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-3xl font-bold">
            Thank you for trying this demo!
          </h1>
          <p>
            Your video
            <em> {filename}</em> has been processed.
          </p>
          <p>
            <b>Annotation type: </b>
            {annotationTypeMap[annotationType]}
          </p>
          <div className="flex flex-col gap-y-2">
            <p>
              <b>Speakers </b>({numSpeakers}):
              {/* TODO {MOCK_RESULT.speakerThumbnails.length}): */}
            </p>
            <SpeakerListDisplay
              speakerThumbnailURLs={thumbnailURLs}
              speakerColours={speakerColours}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 space-x-2 mt-2">
          {/* TODO download files */}
          <Button
            type="button"
            className="py-6 text-md"
            disabled={!videoURL}
            onClick={downloadVideo}
          >
            <VideoIcon className="mr-2 h-5 w-5" />
            Get video
          </Button>
          <GetTranscriptButton
            requestID={requestID}
            filename={filename}
            speakerThumbnailURLs={thumbnailURLs}
            speakerColours={speakerColours}
            numSpeakers={numSpeakers}
          />
        </div>
      </div>
    </div>
  );
}
