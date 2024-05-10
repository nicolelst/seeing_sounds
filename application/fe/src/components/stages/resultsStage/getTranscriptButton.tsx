import { ReactElement } from "react";
import { Button } from "@/shadcn/components/ui/button";
import { Pencil2Icon } from "@radix-ui/react-icons";
import GetTranscriptDialog from "./getTranscriptDialog";

interface GetTranscriptButtonProps {
  requestID: string;
  filename: string;
  speakerThumbnailURLs: Array<string>;
  speakerColours: Array<string>;
  numSpeakers: number;
}
export default function GetTranscriptButton({
  requestID,
  filename,
  speakerThumbnailURLs,
  speakerColours,
  numSpeakers,
}: GetTranscriptButtonProps): ReactElement {
  return (
    <GetTranscriptDialog
      trigger={
        <Button type="button" className="py-6 text-md w-full">
          <Pencil2Icon className="mr-2 h-5 w-5" />
          Get transcript
        </Button>
      }
      requestID={requestID}
      filename={filename}
      speakerThumbnailURLs={speakerThumbnailURLs}
      speakerColours={speakerColours}
      numSpeakers={numSpeakers}
    />
  );
}
