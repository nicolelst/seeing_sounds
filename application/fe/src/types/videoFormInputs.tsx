import { annotationType } from "./annotationType";

type CaptionTextColour = "white" | "black";

type FontSize = ["Small", "Default", "Large", "Giant"][number];

const fontsizePts = [18, 24, 30, 36];
export const FONTSIZE_PT_MIN = 18;
export const FONTSIZE_PT_MAX = 36;
export const FONTSIZE_PT_INTERVAL = 6;
type FontSizePt = (typeof fontsizePts)[number];

type VideoFormInputs = {
  videoInput: FileList;
  numSpeakers: number;
  annotationType: annotationType;
  fontSize: FontSizePt;
  captionTextColour: CaptionTextColour;
  speakerColours: Array<string>;
  // TODO add settings
};

export const NUM_SPEAKERS_MIN = 1;
export const NUM_SPEAKERS_MAX = 10; // TODO max as per resolution and models?

export type { CaptionTextColour, FontSize, FontSizePt, VideoFormInputs };
