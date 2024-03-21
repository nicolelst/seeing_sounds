import { annotationType } from "./annotationType";
import { RGBString } from "./colourInfo";

export type FormInputs = {
	videoInput: FileList;
	numSpeakers: number;
	annotationType: annotationType;
	fontSize: number;
	captionBlackText: boolean;
	speakerColours: Array<RGBString>
	// TODO add settings
};
