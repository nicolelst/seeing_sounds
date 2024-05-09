import { ReactElement, useEffect, useState } from "react";
import { UseFormGetValues } from "react-hook-form";
import useWebSocket, { ReadyState } from "react-use-websocket";
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const websocketURL = `${WEBSOCKET_BASE_URL}/${encodeURIComponent(requestID)}`;
  const { lastMessage, readyState, getWebSocket } = useWebSocket(websocketURL, {
    share: false,
    onOpen: () => console.log("opened websocket", websocketURL),
    onClose: () => console.log("websocket closed"),
    onError: (event) => console.log("websocket error", event),
    shouldReconnect: () => isLoading, // attempt to reconnect on all close events unless complete
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const msgData = JSON.parse(lastMessage.data);
      setStatus(msgData.status);
      if (msgData.status == "COMPLETE") {
        setIsLoading(false);
        getWebSocket()?.close(1000, "request completed");
      }
    }
  }, [getWebSocket, lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];
  useEffect(() => {
    console.log(connectionStatus);
  }, [connectionStatus]);

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

  return (
    <div className="flex flex-col w-full h-full">
      {isLoading ? (
        <LoadingResults
          filename={getValues("videoInput")[0].name}
          status={status}
        />
      ) : (
        <CompleteResults
          filename={getValues("videoInput")[0].name}
          annotationType={getValues("annotationType")}
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
