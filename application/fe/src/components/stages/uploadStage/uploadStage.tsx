import { ReactElement } from "react";
import {
  UseFormRegister,
  UseFormGetValues,
  UseFormSetValue,
  UseFormSetError,
  UseFormClearErrors,
  UseFormTrigger,
  FieldErrors,
  UseFormWatch,
  UseFormResetField,
} from "react-hook-form";
import { AspectRatio } from "@/shadcn/components/ui/aspect-ratio";
import { Button } from "@/shadcn/components/ui/button";
import ReactPlayer from "react-player";
import { VideoFormInputs } from "@/types/videoFormInputs";
import FileDropzone from "./fileDropzone";
import Instructions from "./instructions";

interface UploadStageProps {
  videoFilepath: string;
  setVideoFilepath: React.Dispatch<React.SetStateAction<string>>;
  register: UseFormRegister<VideoFormInputs>;
  watch: UseFormWatch<VideoFormInputs>;
  getValues: UseFormGetValues<VideoFormInputs>;
  setValue: UseFormSetValue<VideoFormInputs>;
  resetField: UseFormResetField<VideoFormInputs>;
  trigger: UseFormTrigger<VideoFormInputs>;
  errors: FieldErrors<VideoFormInputs>;
  setError: UseFormSetError<VideoFormInputs>;
  clearErrors: UseFormClearErrors<VideoFormInputs>;
  nextStage: () => void;
}

export function UploadStage({
  videoFilepath,
  setVideoFilepath,
  watch,
  register,
  getValues,
  setValue,
  resetField,
  trigger,
  errors,
  setError,
  clearErrors,
  nextStage,
}: UploadStageProps): ReactElement {
  function handleNext() {
    trigger("videoInput");
    if (getValues("videoInput") && !errors.videoInput) nextStage();
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="grid grid-cols-3 gap-4 w-full h-full">
        <div className="col-span-1 flex flex-col h-full w-full gap-y-4">
          <FileDropzone
            errors={errors}
            register={register}
            setValue={setValue}
            resetField={resetField}
            getValues={getValues}
            setError={setError}
            clearErrors={clearErrors}
            videoFilepath={videoFilepath}
            setVideoFilepath={setVideoFilepath}
          />
        </div>
        <div className="col-span-2 h-full w-full flex flex-col items-center justify-center">
          {getValues("videoInput") && !errors.videoInput ? (
            <div className="flex flex-col w-full h-full justify-center">
              <AspectRatio ratio={16 / 9}>
                <ReactPlayer
                  url={errors.videoInput ? "" : videoFilepath}
                  width="100%"
                  height="100%"
                  controls={true}
                />
              </AspectRatio>
            </div>
          ) : (
            <Instructions />
          )}
        </div>
      </div>
      <Button
        className="w-fit my-3 self-end"
        onClick={handleNext}
        disabled={
          !watch("videoInput") ||
          errors.videoInput ||
          !watch("numSpeakers") ||
          errors.numSpeakers
        }
      >
        Next
      </Button>
    </div>
  );
}
