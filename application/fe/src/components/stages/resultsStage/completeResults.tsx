import { ReactElement } from "react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Button } from "@/shadcn/components/ui/button";
import { VideoIcon } from "@radix-ui/react-icons";
import ReactPlayer from "react-player";
import { annotationType, annotationTypeMap } from "@/types/annotationType";
import GetTranscriptButton from "./getTranscriptButton";
import SpeakerListDisplay from "./speakerListDisplay";

import myVideo from "/Users/User/Documents/fyp/report_moist/outputs/floating_bbox.mp4";

interface CompleteResultsProps {
  filename: string;
  annotationType: annotationType;
  speakerThumbnails: File[];
}

export default function CompleteResults({
  filename,
  annotationType,
  speakerThumbnails,
}: CompleteResultsProps): ReactElement {
  // TODO GET request for results
  return (
    <div className="grid grid-cols-3 w-full h-full">
      <div className="col-span-2 flex items-center justify-center">
        <AspectRatio ratio={16 / 9}>
          <ReactPlayer
            url={myVideo}
            // TODO remove mock result url={URL.createObjectURL(MOCK_RESULT.video)}
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
              <b>Speakers </b>({2}):
              {/* TODO {MOCK_RESULT.speakerThumbnails.length}): */}
            </p>
            <SpeakerListDisplay speakerThumbnails={speakerThumbnails} />
          </div>
        </div>
        <div className="grid grid-cols-2 space-x-2 mt-2">
          {/* TODO download files */}
          <Button className="py-6 text-md">
            <VideoIcon className="mr-2 h-5 w-5" />
            Get video
          </Button>
          <GetTranscriptButton speakerThumbnails={speakerThumbnails} />
        </div>
      </div>
    </div>
  );
}
