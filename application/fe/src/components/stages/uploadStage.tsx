import { ReactElement, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "@/shadcn/components/ui/button";
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
import { useDropzone } from "react-dropzone";
import { UploadIcon } from "@radix-ui/react-icons";

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
					{/* <div className="grid w-full items-center gap-1.5">
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
					</div> */}
					<FileDropzone
						errors={errors}
						setValue={setValue}
						// getValues={getValues}
						setError={setError}
						clearErrors={clearErrors}
						setVideoFilepath={setVideoFilepath}
					/>
				</div>
				<div className="col-span-2 h-full w-full flex items-center justify-center">
					<AspectRatio ratio={16 / 9}>
						{getValues("videoInput") && !errors.videoInput ? (
							<ReactPlayer
								url={errors.videoInput ? "" : videoFilepath}
								width="100%"
								height="100%"
								controls={true}
							/>
						) : (
							<Instructions />
						)}
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
	errors: FieldErrors<FormInputs>;
	setValue: UseFormSetValue<FormInputs>;
	// getValues: UseFormGetValues<FormInputs>;
	setError: UseFormSetError<FormInputs>;
	clearErrors: UseFormClearErrors<FormInputs>;
	setVideoFilepath: React.Dispatch<React.SetStateAction<string>>;
}
function FileDropzone({
	errors,
	setValue,
	// getValues,
	setError,
	clearErrors,
	setVideoFilepath,
}: FileDropzoneProps): ReactElement {
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
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

	const bgColour = isDragActive
		? "gray-300"
		: errors.videoInput
		? "red-300"
		: "gray-200";

	const text = isDragActive
		? "Release to select file."
		: errors.videoInput
		? errors.videoInput.message
		: "Choose a video file or drag it here.";
	// : "Drop your video file here, or click to select a file."; // makes icon move when drag active

	return (
		<div
			{...getRootProps({
				className: `h-full dropzone bg-${bgColour}`,
			})}
		>
			<input {...getInputProps()} />
			<div className="h-full flex flex-col justify-center items-center text-center text-balance px-4">
				<UploadIcon className="h-20 w-20 my-6" />
				<p className="font-bold">{text}</p>
				<em>Accepted filetypes: MP4</em>
				{/* <p>{getValues("videoInput") ? `Selected file: ${getValues("videoInput")[0].name}` : "No file selected."}</p> */}
				{/* TODO show file name: getValues not updated when invalid file */}
				{/* TODO add more filetypes */}
			</div>
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

function Instructions(): ReactElement {
	return (
		<div className="flex flex-col py-4 px-4 gap-y-4 text-wrap">
			<InstructionItem
				num={1}
				header="Upload a video"
				description="Select a video of a conversation with multiple speakers.
					Drag and drop the video file into the box on the left, or
					click to browse files."
			/>
			<InstructionItem
				num={2}
				header="Adjust settings"
				description="Customise interface options for the final video and transcript,
				or adjust model parameters for speech separation and automatic
				speech recognition."
			/>
			<InstructionItem
				num={3}
				header="Download results"
				description="Watch the annotated video with captions and speaker
				identification, save it for later, or download an annotated
				transcript."
			/>
		</div>
	);
}

interface InstructionItemProps {
	num: number;
	header: string;
	description: string;
}
function InstructionItem({
	num,
	header,
	description,
}: InstructionItemProps): ReactElement {
	return (
		<div className="flex flex-col gap-y-1.5">
			<div className="flex flex-row text-2xl font-bold">
				<h1 className="w-8">{num}. </h1>
				<h1>{header}</h1>
			</div>
			<div className="flex flex-row">
				<div className="w-2 bg-gray-200 ml-1 mr-4" />
				<p>{description}</p>
			</div>
		</div>
	);
}
