import { annotationType } from "./annotationType";

export type VideoFormInputs = {
  videoInput: FileList;
  numSpeakers: number;
  annotationType: annotationType;
  fontSize: number;
  captionBlackText: boolean;
  speakerColours: Array<string>;
  // TODO add settings
};

export const NUM_SPEAKERS_MIN = 1;
export const NUM_SPEAKERS_MAX = 10; // TODO max as per resolution and models?
