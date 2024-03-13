import { ReactElement, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Label } from "@/shadcn/components/ui/label";
import { FormInputs } from "@/types/formInputs";
import {
	UseFormRegister,
	UseFormGetValues,
	UseFormTrigger,
	FieldErrors,
} from "react-hook-form";
import { AspectRatio } from "@/shadcn/components/ui/aspect-ratio";

interface UploadStageProps {
	register: UseFormRegister<FormInputs>;
	getValues: UseFormGetValues<FormInputs>;
	trigger: UseFormTrigger<FormInputs>;
	errors: FieldErrors<FormInputs>;
	nextStage: () => void;
}

export default function UploadStage({
	register,
	getValues,
	trigger,
	errors,
	nextStage,
}: UploadStageProps): ReactElement {
	function handleNext() {
		trigger("videoInput");
		if (getValues("videoInput") && !errors.videoInput) nextStage();
	}

	const [videoFilepath, setVideoFilepath] = useState<string>("");

	return (
		<div className="flex flex-col w-full h-full">
			<div className="grid grid-cols-3 gap-4 w-full h-full">
				<div className="col-span-1 flex flex-col h-full w-full gap-y-4">
					<div className="grid w-full items-center gap-1.5">
						{errors.videoInput ? (
							<Label className="text-red-500">
								{errors.videoInput.message}
							</Label>
						) : (
							<Label>Upload your video here</Label>
						)}
						<Input
							id="video"
							type="file"
							className={
								errors.videoInput ? "bg-red-100" : "bg-slate-50"
							}
							// TODO set value based on form values
							{...register("videoInput", {
								onChange: (e) => {
									trigger("videoInput");
									setVideoFilepath(
										URL.createObjectURL(e.target.files[0]) // TODO move this to post request ?
									);
								},
								required: "Please upload a video.",
								validate: (value: FileList) => {
									if (value.length === 0) {
										return "Please upload a video.";
									}
									const file = value[0];
									if (file.type !== "video/mp4") {
										// TODO add more valid formats
										return "Invalid video format.";
									}
									return true;
								},
							})}
						/>
					</div>
					<div className="h-full bg-purple-300">
						TODO DROPPABLE AREA
					</div>
				</div>
				<div className="col-span-2 h-full w-full flex items-center justify-center">
					<AspectRatio ratio={16 / 9}>
						<ReactPlayer
							url={errors.videoInput ? "" : videoFilepath}
							width="100%"
							height="100%"
							controls={true}
						/>
					</AspectRatio>
				</div>
			</div>
			<Button
				className="w-fit my-2 self-end"
				onClick={handleNext}
				disabled={!getValues("videoInput") || errors.videoInput}
			>
				Next
			</Button>
		</div>
	);
}
