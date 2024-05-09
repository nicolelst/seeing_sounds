import { ReactElement } from "react";
import { Button } from "@/shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/components/ui/dialog";
import { Input } from "@/shadcn/components/ui/input";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { RGBString } from "@/types/colourInfo";
import SpeakerAvatar from "./speakerAvatar";

interface GetTranscriptButtonProps {
  speakerThumbnailURLs: Array<string>;
  speakerColours: Array<RGBString>;
}
export default function GetTranscriptButton({
  speakerThumbnailURLs,
  speakerColours,
}: GetTranscriptButtonProps): ReactElement {
  return (
    <Dialog>
      <DialogTrigger>
        <Button type="button" className="py-6 text-md w-full">
          <Pencil2Icon className="mr-2 h-5 w-5" />
          Get transcript
        </Button>
      </DialogTrigger>
      <SpeakerInfoDialog
        speakerThumbnailURLs={speakerThumbnailURLs}
        speakerColours={speakerColours}
      />
    </Dialog>
  );
}

interface SpeakerInfoDialogProps {
  speakerThumbnailURLs: Array<string>;
  speakerColours: Array<RGBString>;
}

function SpeakerInfoDialog({
  speakerThumbnailURLs,
  speakerColours,
}: SpeakerInfoDialogProps): ReactElement {
  return (
    <DialogContent className="max-w-sm lg:max-w-xl">
      <DialogHeader>
        <DialogTitle className="text-xl">Speaker information</DialogTitle>
        <DialogDescription className="text-base">
          Identify speakers to generate transcript.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-y-2 max-h-96 overflow-y-auto px-2">
        {/* TODO dynamic height ? */}
        {speakerThumbnailURLs.map((img, idx) => (
          <div key={idx + 1} className="flex flex-row gap-x-6 items-center">
            <SpeakerAvatar
              colour={speakerColours[idx]}
              img={img}
              id={idx + 1}
            />
            <Input
              className="text-base mr-4"
              placeholder="Who is this?"
              defaultValue={`Speaker ${idx + 1}`}
              // TODO max length limit
              // TODO regsister field array
            />
          </div>
        ))}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            type="submit"
            // onClick= {} TODO post request
          >
            <Pencil2Icon className="mr-2 h-5 w-5" />
            Get transcript
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
