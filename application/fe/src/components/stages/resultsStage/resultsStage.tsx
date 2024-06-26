import { ReactElement, useState } from "react";
import { UseFormGetValues } from "react-hook-form";
import { Button } from "@/shadcn/components/ui/button";
import { VideoFormInputs } from "@/types/videoFormInputs";
import CompleteResults from "./completeResults";
import LoadingResults from "./loadingResults";

interface ResultsStageProps {
  requestID: string;
  getValues: UseFormGetValues<VideoFormInputs>;
  nextStage: () => void;
  resetForm: () => void;
}

export function ResultsStage({
  requestID,
  getValues,
  nextStage,
  resetForm,
}: ResultsStageProps): ReactElement {
  // toggle between loading screen and final results
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <div className="flex flex-col w-full h-full">
      {isLoading ? (
        <LoadingResults
          requestID={requestID}
          filename={getValues("videoInput")[0].name}
          setIsLoading={setIsLoading}
        />
      ) : (
        <CompleteResults
          requestID={requestID}
          filename={getValues("videoInput")[0].name}
          annotationType={getValues("annotationType")}
          speakerColours={getValues("speakerColours")}
          numSpeakers={getValues("numSpeakers")}
        />
      )}
      <Button
        className="w-fit my-3 self-end"
        disabled={isLoading} 
        type="button"
        onClick={() => {
          resetForm();
          nextStage();
        }}
      >
        Start over
      </Button>
    </div>
  );
}
