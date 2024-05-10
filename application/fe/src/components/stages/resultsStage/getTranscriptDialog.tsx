import { ReactElement, ReactNode, useEffect, useState } from "react";
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
import SpeakerAvatar from "./speakerAvatar";
import { Button } from "@/shadcn/components/ui/button";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { TranscriptFormInputs } from "@/types/transcriptFormInputs";
import { Progress } from "@/shadcn/components/ui/progress";
import { Label } from "@/shadcn/components/ui/label";
import { DownloadIcon } from "lucide-react";
import { DOWNLOAD_TRANSCRIPT_URL } from "@/constants/routes";
import downloadFile from "./downloadFile";

interface GetTranscriptDialogProps {
  trigger: ReactNode;
  requestID: string;
  filename: string;
  speakerThumbnailURLs: Array<string>;
  speakerColours: Array<string>;
  numSpeakers: number;
}

export default function GetTranscriptDialog({
  trigger,
  requestID,
  filename,
  speakerThumbnailURLs,
  speakerColours,
  numSpeakers,
}: GetTranscriptDialogProps): ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [transcriptURL, setTranscriptURL] = useState<string>("");

  const getDefaultSpeakerName = (idx: number) => `Speaker ${idx + 1}`;

  const { register, control, handleSubmit, reset } =
    useForm<TranscriptFormInputs>({
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
    const queryParams = {
      request_id: requestID,
      speaker_names: data.speakerInfo.map((info) => info.name).join(";"),
      speaker_colours: data.speakerInfo.map((info) => info.colour).join(";"),
    };
    const paramStr = Object.entries(queryParams)
      .map((param) => `${param[0]}=${encodeURIComponent(param[1])}`)
      .join("&");
    const queryURL = `${DOWNLOAD_TRANSCRIPT_URL}?${paramStr}`;

    console.log("GET", queryURL);
    setIsLoading(true);

    const response = await fetch(queryURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }).catch((error) => {
      console.log("ERROR FETCHING:", error);
      setErrorMsg(error);
      return;
    });

    console.log(
      "GET TRANSCRIPT REQUEST:",
      response!.status,
      response!.statusText
    );

    if (response!.ok) {
      const blob = await response!.blob();
      setTranscriptURL(URL.createObjectURL(blob));
    } else {
      const body = await response!.json();
      console.log("PROBLEM:", body);
      setErrorMsg(
        Array.from([
          response!.status,
          response!.statusText,
          "-",
          body.detail ?? "An unexpected error occurred.",
        ]).join(" ")
      );
    }
  };

  const downloadTranscript = () =>
    downloadFile(
      transcriptURL,
      `${(filename ?? "").replace(/\..+$/, "")}_transcript.docx`,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

  const handleDoneLoading = () => {
    const condition = transcriptURL || errorMsg;
    if (!condition) {
      window.setTimeout(handleDoneLoading, 500); // check every 500ms
    } else {
      setIsLoading(false);
    }
  };

  const resetComponent = () => {
    setErrorMsg("");
    setTranscriptURL("");
    setIsLoading(false);
    reset();
  };

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent
        className="w-full max-h-3/5 max-w-sm lg:max-w-xl"
        handleClose={resetComponent}
      >
        {isLoading ? (
          <div className="h-60 flex flex-col justify-center	items-center gap-2">
            <Label className="text-lg">Getting your transcript...</Label>
            <LoadingBar handleDoneLoading={handleDoneLoading} />
          </div>
        ) : errorMsg ? (
          <div className="h-60 flex flex-col justify-center items-center gap-2 text-red-600">
            <Label className="text-xl">Something went wrong</Label>
            <p className="overflow-auto mx-8">{errorMsg}</p>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  className="py-6 text-md mt-6"
                  onClick={() => resetComponent()}
                >
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        ) : transcriptURL ? (
          <div className="h-60 flex flex-col justify-center	items-center gap-2">
            <Label className="text-lg">Your transcript is ready!</Label>
            <DialogClose asChild>
              <Button
                type="button"
                className="py-6 text-md"
                disabled={!transcriptURL}
                onClick={() => {
                  downloadTranscript();
                  resetComponent();
                }}
              >
                <DownloadIcon className="mr-2 h-5 w-5" />
                Click here to download
              </Button>
            </DialogClose>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmitTranscriptForm)}>
            <DialogHeader>
              <DialogTitle className="text-xl">Speaker information</DialogTitle>
              <DialogDescription className="text-base">
                Identify speakers to generate transcript.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-y-2 max-h-96 overflow-y-auto px-2 mt-4">
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
              <Button type="submit">
                <Pencil2Icon className="mr-2 h-5 w-5" />
                Get transcript
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface LoadingBarProps {
  handleDoneLoading: () => void;
}
function LoadingBar({ handleDoneLoading }: LoadingBarProps): ReactElement {
  const init = 33;
  const increment = 15;
  const max = 92;

  const [progress, setProgress] = useState<number>(init);
  const repeater = setInterval(() => {
    setProgress((progress) => (progress > max ? max : progress + increment));
  }, 500);

  useEffect(() => {
    // console.log(progress);
    if (progress >= max) {
      clearInterval(repeater);
      handleDoneLoading();
    }
  }, [handleDoneLoading, progress, repeater]);

  return <Progress value={progress} className="w-[60%] my-4 mx-4" />;
}
