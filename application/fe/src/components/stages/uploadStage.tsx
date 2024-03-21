import { ReactElement } from "react";
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
import {
	CheckCircledIcon,
	CrossCircledIcon,
	UploadIcon,
} from "@radix-ui/react-icons";
import { Label } from "@/shadcn/components/ui/label";
import { Input } from "@/shadcn/components/ui/input";

interface UploadStageProps {
	videoFilepath: string;
	setVideoFilepath: React.Dispatch<React.SetStateAction<string>>;
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
	videoFilepath,
	setVideoFilepath,
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
						setValue={setValue}
						// getValues={getValues}
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
							<div className="flex flex-row gap-10 my-4">
								<Label
									className={`text-lg text-nowrap px-2 ${
										errors.numSpeakers
											? "text-red-600"
											: "text-black"
									}`}
								>
									{errors.numSpeakers
										? errors.numSpeakers.message
										: "How many speakers are in the video?"}
								</Label>
								<Input
									className={`${
										errors.numSpeakers
											? "bg-red-200"
											: "bg-white"
									}`}
									{...register("numSpeakers", {
										required: true,
										valueAsNumber: true,
										min: 1,
										max: 10,
										// TODO max as per resolution and models?
										// TODO reject decimals, letters
										// TODO prevent next without this value
										// setValueAs: v => parseInt(v),
										// onChange: (e) => {
										//   return e.target.value.replace(/[^1-9]/g, '');
										// },
									})}
								/>
							</div>
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
					!getValues("videoInput") ||
					errors.videoInput ||
					errors.numSpeakers
				}
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
	videoFilepath: string;
	setVideoFilepath: React.Dispatch<React.SetStateAction<string>>;
}
function FileDropzone({
	errors,
	setValue,
	// getValues,
	setError,
	clearErrors,
	// videoFilepath,
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

	const iconStyle = "h-20 w-20 my-6";

	const dropzoneContents = {
		// TODO add one for accepted file, condition on videoFilepath existing, show name of file
		default: {
			bgColour: "bg-gray-200",
			text: "Choose a video file or drag it here.",
			icon: <UploadIcon className={iconStyle} />,
		},
		dragging: {
			bgColour: "bg-gray-300",
			text: "Release to select file.",
			icon: <CheckCircledIcon className={iconStyle} />,
		},
		error: {
			bgColour: "bg-red-300",
			text:
				errors.videoInput?.message ??
				"There was an unexpected issue. Please try again.",
			icon: <CrossCircledIcon className={iconStyle} />,
		},
	};

	const dropzoneState = isDragActive
		? "dragging"
		: errors.videoInput
		? "error"
		: "default";

	return (
		<div
			{...getRootProps({
				className: `h-full dropzone ${dropzoneContents[dropzoneState].bgColour}`,
			})}
		>
			<input {...getInputProps()} />
			<div className="h-full flex flex-col justify-center items-center text-center text-balance px-4">
				{dropzoneContents[dropzoneState].icon}
				<p className="font-bold">
					{dropzoneContents[dropzoneState].text}
				</p>
				<em>Accepted filetypes: MP4</em>
				{/* <p>{getValues("videoInput") ? `Selected file: ${getValues("videoInput")[0].name}` : "No file selected."}</p> */}
				{/* TODO show file name: getValues not updated when invalid file */}
				{/* TODO add more filetypes */}
			</div>
		</div>
	);
}

function Instructions(): ReactElement {
	return (
		<div className="flex flex-col w-full h-full py-4 px-4 gap-y-4 justify-start text-wrap">
			<InstructionItem
				num={1}
				header="Upload a video"
				description="Select a video of a conversation with multiple speakers.
					Drag and drop the video file into the box on the left, or
					click to browse files. (Accepted filetypes: MP4)"
				// TODO more filetypes
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
