import { ReactElement } from "react";
import { UseFormGetValues } from "react-hook-form";
import { Button } from "@/shadcn/components/ui/button";
import { FormInputs } from "@/types/formInputs";
import CompleteResults from "./completeResults";
import LoadingResults from "./loadingResults";
import { processingStatus } from "@/types/processingStatus";

interface ResultsStageProps {
  getValues: UseFormGetValues<FormInputs>;
  nextStage: () => void;
  resetForm: () => void;
}

export function ResultsStage({
  getValues,
  nextStage,
  resetForm,
}: ResultsStageProps): ReactElement {
  // TODO remove mock, replace w api response
  const MOCK_RESULT = {
    filename: getValues("videoInput")[0].name,
    annotationType: getValues("annotationType"),
    speakerThumbnails: [
      new File([""], "image_one"),
      new File([""], "image_two"),
      new File([""], "image_three"),
      new File([""], "image_four"),
      new File([""], "image_five"),
      new File([""], "image_six"),
    ],
    video: new File([""], "video_out"),
    transcript: new File([""], "transcript_out"),
  };

  // TODO POST request with form values
  // TODO loading while await
  const isLoading = true;
  // TODO set status w websocket msg updates
  const status: processingStatus = "PREPROCESSING";

  return (
    <div className="flex flex-col w-full h-full">
      {isLoading ? (
        <LoadingResults filename={MOCK_RESULT.filename} status={status} />
      ) : (
        <CompleteResults
          filename={MOCK_RESULT.filename}
          annotationType={MOCK_RESULT.annotationType}
          speakerThumbnails={MOCK_RESULT.speakerThumbnails}
        />
      )}
      <Button
        className="w-fit my-3 self-end"
        // type="reset"
        onClick={() => {
          // TODO remove this
          resetForm();
          nextStage();
        }}
      >
        Start over
        {/* TODO reset form & clear videoInput field */}
      </Button>
    </div>
  );
}
