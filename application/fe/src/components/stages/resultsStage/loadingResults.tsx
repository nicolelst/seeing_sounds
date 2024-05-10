import { ReactElement, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import { Button } from "@/shadcn/components/ui/button";
import ProcessingStatusCarousel from "./processingStatusCarousel";
import { processingStatus } from "@/types/processingStatus";
import { WEBSOCKET_BASE_URL } from "@/constants/routes";
import { linkInfoMap } from "@/constants/linkInfoMap";

interface LoadingResultsProps {
  requestID: string;
  filename: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoadingResults({
  requestID,
  filename,
  setIsLoading,
}: LoadingResultsProps): ReactElement {
  // get processing status from websocket
  const [status, setStatus] = useState<processingStatus>("RECEIVED");

  const websocketURL = `${WEBSOCKET_BASE_URL}/${encodeURIComponent(requestID)}`;
  const { lastMessage, readyState, getWebSocket } = useWebSocket(websocketURL, {
    share: false,
    onOpen: () => console.log("opened websocket", websocketURL),
    onClose: () => console.log("websocket closed"),
    onError: (event) => console.log("websocket error", event),
    shouldReconnect: () => status != "COMPLETE", // attempt to reconnect on all close events unless complete
  });
  useEffect(() => {
    if (lastMessage !== null) {
      const msgData = JSON.parse(lastMessage.data);
      setStatus(msgData.status);
      if (msgData.status == "COMPLETE") {
        getWebSocket()?.close(1000, "request completed");
        // GET and display final results
        setIsLoading(false);
      }
    }
  }, [getWebSocket, lastMessage, requestID, setIsLoading]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];
  useEffect(() => {
    console.log("websocket status:", connectionStatus);
  }, [connectionStatus]);

  return (
    <div className="grid grid-cols-3 w-full h-fit py-8">
      <div className="col-span-2 flex items-center justify-center">
        <ProcessingStatusCarousel status={status} />
      </div>
      <div className="col-span-1 flex flex-col gap-y-4 px-3 py-4 justify-start">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-3xl font-bold">Your video is being processed!</h1>
          <p>
            An annotated video and transcript for
            <em> {filename} </em> will be available shortly.
          </p>
          <div className="flex flex-col gap-y-2 items-start justify-center text-lg font-semibold">
            <p className="mt-4">In the meantime, check out these links:</p>
            {Object.entries(linkInfoMap).map((info, idx) => (
              <Button
                key={idx}
                variant="link"
                className="text-base underline"
                asChild
              >
                <a href={info[1].link} target="_blank">
                  {info[1].icon("lg")}
                  {info[1].desc}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
