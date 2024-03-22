import { ReactElement } from "react";

export default function Instructions(): ReactElement {
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
