import { ReactElement, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "@/shadcn/components/ui/button";
import { Label } from "@/shadcn/components/ui/label";
import { FormInputs } from "@/types/formInputs";
import {
	UseFormRegister,
	UseFormGetValues,
	UseFormSetValue,
	UseFormSetError,
	UseFormClearErrors,
	UseFormTrigger,
	FieldErrors,
} from "react-hook-form";
import { AspectRatio } from "@/shadcn/components/ui/aspect-ratio";
// import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone";

interface UploadStageProps {
	register: UseFormRegister<FormInputs>;
	getValues: UseFormGetValues<FormInputs>;
	setValue: UseFormSetValue<FormInputs>;
	trigger: UseFormTrigger<FormInputs>;
	errors: FieldErrors<FormInputs>;
	setError: UseFormSetError<FormInputs>;
	clearErrors: UseFormClearErrors<FormInputs>;
	nextStage: () => void;
}

export default function UploadStage({
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
						{/* <Input
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
						/> */}
					</div>
					<FileDropzone
						setValue={setValue}
						setError={setError}
						clearErrors={clearErrors}
						setVideoFilepath={setVideoFilepath}
					/>
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

interface FileDropzoneProps {
	setValue: UseFormSetValue<FormInputs>;
	setError: UseFormSetError<FormInputs>;
	clearErrors: UseFormClearErrors<FormInputs>;
	setVideoFilepath: React.Dispatch<React.SetStateAction<string>>;
}
function FileDropzone({
	setValue,
	setError,
	clearErrors,
	setVideoFilepath,
}: FileDropzoneProps): ReactElement {
	const {
		getRootProps,
		getInputProps,
		// isFocused
	} = useDropzone({
		onDrop: (acceptedFiles) => {
			if (acceptedFiles.length == 0) {
				setError("videoInput", {
					type: "dropRequired",
					message: "Please upload a video.",
				});
			} else if (acceptedFiles[0].type !== "video/mp4") {
				// TODO add more valid formats
				setError("videoInput", {
					type: "dropType",
					message: "Invalid video format.",
				});
			} else {
				clearErrors();
				setValue("videoInput", acceptedFiles as unknown as FileList);
				setVideoFilepath(
					URL.createObjectURL(acceptedFiles[0]) // TODO move this to post request ?
				);
			}
		},
		// accept: TODO file types
	});

	return (
		<div
			{...getRootProps({
				className: "h-full bg-gray-400",
				// backgroundColor: "red",
			})}
		>
			<input {...getInputProps()} />
			<p>TODO DROPPABLE AREA</p>
		</div>
	);
	// 	<Dropzone
	// 		// TODO accept types
	// 		onDrop={(acceptedFiles) => {
	// 			if (acceptedFiles.length == 0) {
	// 				setError("videoInput", {
	// 					type: "dropRequired",
	// 					message: "Please upload a video.",
	// 				});
	// 			} else if (acceptedFiles[0].type !== "video/mp4") {
	// 				// TODO add more valid formats
	// 				setError("videoInput", {
	// 					type: "dropType",
	// 					message: "Invalid video format.",
	// 				});
	// 			} else {
	// 				clearErrors();
	// 				setValue(
	// 					"videoInput",
	// 					acceptedFiles as unknown as FileList
	// 				);
	// 				setVideoFilepath(
	// 					URL.createObjectURL(acceptedFiles[0]) // TODO move this to post request ?
	// 				);
	// 			}
	// 		}}
	// 	>
	// 		{({ getRootProps, getInputProps }) => (
	// 			<section className="h-full">
	// 				<div
	// 					{...getRootProps({
	// 						className: "h-full", // bg-gray-400",
	// 						backgroundColor: "red",
	// 					})}
	// 				>
	// 					<input {...getInputProps()} />
	// 					<p>TODO DROPPABLE AREA</p>
	// 				</div>
	// 			</section>
	// 		)}
	// 	</Dropzone>
	// );
}
