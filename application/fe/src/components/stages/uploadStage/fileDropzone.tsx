import { ReactElement } from "react";
import {
	FieldErrors,
	UseFormClearErrors,
	UseFormSetError,
	UseFormSetValue,
} from "react-hook-form";
import { useDropzone } from "react-dropzone";
import {
	UploadIcon,
	CheckCircledIcon,
	CrossCircledIcon,
} from "@radix-ui/react-icons";
import { FormInputs } from "@/types/formInputs";

interface FileDropzoneProps {
	errors: FieldErrors<FormInputs>;
	setValue: UseFormSetValue<FormInputs>;
	// getValues: UseFormGetValues<FormInputs>;
	setError: UseFormSetError<FormInputs>;
	clearErrors: UseFormClearErrors<FormInputs>;
	videoFilepath: string;
	setVideoFilepath: React.Dispatch<React.SetStateAction<string>>;
}
export default function FileDropzone({
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
