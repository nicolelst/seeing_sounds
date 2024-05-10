import { ReactElement } from "react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import {
  SendIcon,
  PencilRulerIcon,
  MessagesSquareIcon,
  AudioLinesIcon,
  PaintbrushIcon,
  WandIcon,
} from "lucide-react";
import { processingStatus } from "@/types/processingStatus";

export type processingStatusInfo = {
  name: string;
  desc: string;
  icon: ReactElement;
};

const iconClassName = "h-16 w-16";

export const processingStatusMap: Record<
  processingStatus,
  processingStatusInfo
> = {
  RECEIVED: {
    name: "Request received!",
    desc: "The server has received your request and will begin processing your video shortly.",
    icon: <SendIcon className={iconClassName} />,
  },
  PREPROCESSING: {
    name: "Preprocessing",
    desc: "Converting your video to the appropriate frame rate and audio bitrate. Applying MTCNN face detector to track speakers.",
    icon: <PencilRulerIcon className={iconClassName} />,
  },
  SPEECH_SEP: {
    name: "Speech separation",
    desc: "Applying models from VisualVoice to extract isolated audio tracks for each speaker based on their lip motion, facial attributes, and vocal properties.",
    icon: <MessagesSquareIcon className={iconClassName} />,
  },
  SPEECH_REC: {
    name: "Speech recognition",
    desc: "Applying models from OpenAI Whisper to produce a transcript for each speaker.",
    icon: <AudioLinesIcon className={iconClassName} />,
  },
  ANNOTATION: {
    name: "Video annotation",
    desc: "Preparing your final video the way you like it.",
    icon: <PaintbrushIcon className={iconClassName} />,
  },
  COMPLETE: {
    name: "Almost there...",
    desc: "Applying the final touches...",
    icon: <WandIcon className={iconClassName} />,
  },
  ERROR: {
    name: "Error",
    desc: "An error occurred while processing your request. Please try again.",
    icon: <CrossCircledIcon className={iconClassName} />,
  },
};
