import { ReactElement, useEffect, useState } from "react";
import { UseFormGetValues } from "react-hook-form";
import { Button } from "@/shadcn/components/ui/button";
import { FormInputs } from "@/types/formInputs";
import CompleteResults from "./completeResults";
import LoadingResults from "./loadingResults";
import { processingStatus } from "@/types/processingStatus";
import { WEBSOCKET_BASE_URL } from "@/routes";

interface ResultsStageProps {
  requestID: string;
  getValues: UseFormGetValues<FormInputs>;
  nextStage: () => void;
  resetForm: () => void;
}

export function ResultsStage({
  requestID,
  getValues,
  nextStage,
  resetForm,
}: ResultsStageProps): ReactElement {
  // TODO set status w websocket msg updates
  const [status, setStatus] = useState<processingStatus>("RECEIVED");

  useEffect(() => {
    const websocketURL = WEBSOCKET_BASE_URL + encodeURIComponent(requestID);
    const websocket = new WebSocket(websocketURL);
    console.log("websocket URL:", websocket.url);
    console.log("websocket state:", websocket.readyState);

    websocket.onopen = () => {
      console.log("websocket opened");
      websocket.send("HELLO FROM FE");
    };
    websocket.onclose = () => console.log("websocket closed");
    websocket.onerror = () => console.log("websocket error");
    websocket.onmessage = (event) => {
      console.log("websocket received", JSON.parse(event.data));
      // TODO not refreshing on new messages
      // setStatus TODO
      // websocket.close(1000, "request completed")
    };

    // return () => {
    //     websocket.close();
    // };
  }, [requestID]);

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
