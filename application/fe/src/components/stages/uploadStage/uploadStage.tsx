import { ReactElement } from "react";
import {
	UseFormRegister,
	UseFormGetValues,
	UseFormSetValue,
	UseFormSetError,
	UseFormClearErrors,
	UseFormTrigger,
	FieldErrors,
	UseFormWatch,
} from "react-hook-form";
import { AspectRatio } from "@/shadcn/components/ui/aspect-ratio";
import { Button } from "@/shadcn/components/ui/button";
import ReactPlayer from "react-player";
import { FormInputs } from "@/types/formInputs";
import FileDropzone from "./fileDropzone";
import Instructions from "./instructions";

interface UploadStageProps {
	videoFilepath: string;
	setVideoFilepath: React.Dispatch<React.SetStateAction<string>>;
	register: UseFormRegister<FormInputs>;
	watch: UseFormWatch<FormInputs>;
	getValues: UseFormGetValues<FormInputs>;
	setValue: UseFormSetValue<FormInputs>;
	trigger: UseFormTrigger<FormInputs>;
	errors: FieldErrors<FormInputs>;
	setError: UseFormSetError<FormInputs>;
	clearErrors: UseFormClearErrors<FormInputs>;
	nextStage: () => void;
}

export function UploadStage({
	videoFilepath,
	setVideoFilepath,
	watch,
	register,
	getValues,
	setValue,
	trigger,
	errors,
	setError,
	clearErrors,
	nextStage,
}: UploadStageProps): ReactElement {
	function handleNext() {
		trigger("videoInput");
		if (getValues("videoInput") && !errors.videoInput) nextStage();
	}

	return (
		<div className="flex flex-col w-full h-full">
			<div className="grid grid-cols-3 gap-4 w-full h-full">
				<div className="col-span-1 flex flex-col h-full w-full gap-y-4">
					<FileDropzone
						errors={errors}
						register={register}
						setValue={setValue}
						getValues={getValues}
						setError={setError}
						clearErrors={clearErrors}
						videoFilepath={videoFilepath}
						setVideoFilepath={setVideoFilepath}
					/>
				</div>
				<div className="col-span-2 h-full w-full flex flex-col items-center justify-center">
					{getValues("videoInput") && !errors.videoInput ? (
						<div className="flex flex-col w-full h-full justify-center">
							<AspectRatio ratio={16 / 9}>
								<ReactPlayer
									url={errors.videoInput ? "" : videoFilepath}
									width="100%"
									height="100%"
									controls={true}
								/>
							</AspectRatio>
						</div>
					) : (
						<Instructions />
					)}
				</div>
			</div>
			<Button
				className="w-fit my-2 self-end"
				onClick={handleNext}
				disabled={
					!watch("videoInput") ||
					errors.videoInput ||
					!watch("numSpeakers") ||
					errors.numSpeakers
				}
			>
				Next
			</Button>
		</div>
	);
}
