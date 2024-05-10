type AnnotationType = "floating" | "colour" | "pointer" | "traditional";

type CaptionTextColour = "white" | "black";

type FontSize = ["Small", "Default", "Large", "Giant"][number];

const fontsizePts = [24, 32, 40, 48];
export const FONTSIZE_PT_MIN = 24;
export const FONTSIZE_PT_MAX = 48;
export const FONTSIZE_PT_INTERVAL = 8;
type FontSizePt = (typeof fontsizePts)[number];

export const visualFeatureList = ['lipmotion', 'identity', 'both'];
type VisualFeatureType = (typeof visualFeatureList)[number];

export const whisperModelNameList = ["tiny", "base", "small", "medium", "large"];
type WhisperModelName = (typeof whisperModelNameList)[number];

type VideoFormInputs = {
  videoInput: FileList;
  numSpeakers: number;
  // video settings
  annotationType: AnnotationType;
  fontSize: FontSizePt;
  captionTextColour: CaptionTextColour;
  speakerColours: Array<string>;
  // speech sep settings
  hopLength: number;
  numIdentityFrames: number;
  visualFeatures: VisualFeatureType;
  // speech rec settings
  speechRecModel: WhisperModelName;
  englishOnly: boolean;
};

export const NUM_SPEAKERS_MIN = 1;
export const NUM_SPEAKERS_MAX = 10; // TODO max as per resolution and models?

export type {
  AnnotationType,
  CaptionTextColour,
  FontSize,
  FontSizePt,
  VisualFeatureType,
  WhisperModelName,
  VideoFormInputs,
};
