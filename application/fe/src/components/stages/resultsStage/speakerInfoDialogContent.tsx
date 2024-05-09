import { ReactElement, useEffect, useState } from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { Input } from "@/shadcn/components/ui/input";
import SpeakerAvatar from "./speakerAvatar";
import { Button } from "@/shadcn/components/ui/button";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { TranscriptFormInputs } from "@/types/transcriptFormInputs";
import { Progress } from "@/shadcn/components/ui/progress";
import { Label } from "@/shadcn/components/ui/label";
import { DOWNLOAD_TRANSCRIPT_URL } from "@/routes";

interface SpeakerInfoDialogContentProps {
  requestID: string;
  speakerThumbnailURLs: Array<string>;
  speakerColours: Array<string>;
  numSpeakers: number;
}

export default function SpeakerInfoDialogContent({
  requestID,
  speakerThumbnailURLs,
  speakerColours,
  numSpeakers,
}: SpeakerInfoDialogContentProps): ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getDefaultSpeakerName = (idx: number) => `Speaker ${idx + 1}`;

  const { register, control, handleSubmit } = useForm<TranscriptFormInputs>({
    defaultValues: {
      speakerInfo: [...Array(numSpeakers).keys()].map((idx) => {
        return {
          name: getDefaultSpeakerName(idx),
          colour: speakerColours[idx],
        };
      }),
    },
  });
  const { fields } = useFieldArray({
    control,
    name: "speakerInfo",
    rules: { required: true, minLength: numSpeakers, maxLength: numSpeakers },
  });

  const onSubmitTranscriptForm: SubmitHandler<TranscriptFormInputs> = async (
    data: TranscriptFormInputs
  ) => {
    // set default speaker names if unspecified
    data = {
      speakerInfo: data.speakerInfo.map((info, idx) => {
        if (info.name.length === 0) {
          return { ...info, name: getDefaultSpeakerName(idx) };
        } else {
          return info;
        }
      }),
    };

    // GET request for transcript
    const queryURL = `${DOWNLOAD_TRANSCRIPT_URL}?request_id=${encodeURIComponent(
      requestID
    )}&speaker_names=${encodeURIComponent(
      data.speakerInfo.map((info) => info.name).join(";")
    )}&speaker_colours=${encodeURIComponent(
      data.speakerInfo.map((info) => info.colour).join(";")
    )}`;

    console.log("GET", queryURL);
    setIsLoading(true);

    const response = await fetch(queryURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    console.log(
      "POST TRANSCRIPT REQUEST:",
      response.status,
      response.statusText
    );

    const result = await response.json();
    console.log(result);
    // TODO download
    // TODO close dialog
  };

  return (
    <DialogContent className="w-full max-h-3/5 max-w-sm lg:max-w-xl">
      {!isLoading ? (
        <form onSubmit={handleSubmit(onSubmitTranscriptForm)}>
          <DialogHeader>
            <DialogTitle className="text-xl">Speaker information</DialogTitle>
            <DialogDescription className="text-base">
              Identify speakers to generate transcript.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-2 max-h-96 overflow-y-auto px-2 mt-4">
            {/* TODO dynamic height ? */}
            {fields.map((field, idx) => (
              <div
                key={field.id}
                className="flex flex-row gap-x-6 items-center"
              >
                <SpeakerAvatar
                  colour={speakerColours[idx]}
                  img={speakerThumbnailURLs[idx]}
                  id={idx + 1}
                />
                <Input
                  className="text-base mr-4"
                  placeholder={getDefaultSpeakerName(idx)}
                  {...register(`speakerInfo.${idx}.name`)}
                  // TODO display and handle errors: missing input
                  // TODO max length limit
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="reset" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="submit"
                // TODO close?
              >
                <Pencil2Icon className="mr-2 h-5 w-5" />
                Get transcript
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      ) : (
        <div className="h-60 flex flex-col justify-center	items-center">
          <Label className="text-lg">Getting your transcript...</Label>
          <LoadingBar />
        </div>
      )}
    </DialogContent>
  );
}

function LoadingBar(): ReactElement {
  const init = 8;
  const increment = 12;

  const [progress, setProgress] = useState<number>(init);
  const repeater = setInterval(
    () => setProgress((progress) => progress + increment),
    3500
  );
  useEffect(() => {
    // console.log(progress);
    if (progress > 100) {
      setProgress(92);
      clearInterval(repeater);
    }
  }, [progress, repeater]);

  return <Progress value={progress} className="w-[60%] my-4 mx-4" />;
}
