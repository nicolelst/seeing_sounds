import { ReactElement } from "react";
import { Button } from "@/shadcn/components/ui/button";
import { Dialog, DialogTrigger } from "@/shadcn/components/ui/dialog";
import { Pencil2Icon } from "@radix-ui/react-icons";
import SpeakerInfoDialogContent from "./speakerInfoDialogContent";

interface GetTranscriptButtonProps {
  requestID: string;
  speakerThumbnailURLs: Array<string>;
  speakerColours: Array<string>;
  numSpeakers: number;
}
export default function GetTranscriptButton({
  requestID,
  speakerThumbnailURLs,
  speakerColours,
  numSpeakers,
}: GetTranscriptButtonProps): ReactElement {
  return (
    <Dialog>
      <DialogTrigger>
        <Button type="button" className="py-6 text-md w-full">
          <Pencil2Icon className="mr-2 h-5 w-5" />
          Get transcript
        </Button>
      </DialogTrigger>
      <SpeakerInfoDialogContent
        requestID={requestID}
        speakerThumbnailURLs={speakerThumbnailURLs}
        speakerColours={speakerColours}
        numSpeakers={numSpeakers}
      />
    </Dialog>
  );
}
