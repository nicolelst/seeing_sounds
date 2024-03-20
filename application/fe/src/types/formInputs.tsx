import { annotationType } from "./annotationType";

export type FormInputs = {
	videoInput: FileList;
	numSpeakers: number;
	annotationType: annotationType;
	// TODO add settings
};
