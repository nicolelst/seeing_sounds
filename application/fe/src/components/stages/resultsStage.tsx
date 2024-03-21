import { ReactElement } from "react";
import { UseFormGetValues } from "react-hook-form";
import ReactPlayer from "react-player";
import { AspectRatio } from "@/shadcn/components/ui/aspect-ratio";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shadcn/components/ui/avatar";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import { Button } from "@/shadcn/components/ui/button";
import { FileTextIcon, VideoIcon } from "@radix-ui/react-icons";
import { FormInputs } from "@/types/formInputs";
import { annotationTypeMap } from "@/types/annotationType";
import { DEFAULT_HEX_10 } from "@/types/colourInfo";

interface ResultsStageProps {
	getValues: UseFormGetValues<FormInputs>;
	nextStage: () => void;
}

export function ResultsStage({
	getValues,
	nextStage,
}: ResultsStageProps): ReactElement {
	// TODO remove mock, replace w api response
	const MOCK_RESULT = {
		filename: getValues("videoInput")[0].name,
		annotationType: getValues("annotationType"),
		speakers: [
			{
				name: "Speaker 1",
				thumbnail: new File([""], "image_one"),
			},
			{
				name: "Speaker 2",
				thumbnail: new File([""], "image_two"),
			},
			{
				name: "Speaker 3",
				thumbnail: new File([""], "image_three"),
			},
			{
				name: "Speaker 4",
				thumbnail: new File([""], "image_four"),
			},
			{
				name: "Speaker 5",
				thumbnail: new File([""], "image_five"),
			},
			{
				name: "Speaker 6",
				thumbnail: new File([""], "image_six"),
			},
		],
		video: new File([""], "video_out"),
		transcript: new File([""], "transcript_out"),
	};

	// TODO POST request with form values
	// TODO mock loading effect

	return (
		<div className="flex flex-col w-full h-full">
			<div className="grid grid-cols-3 w-full h-full">
				<div className="col-span-2 flex items-center justify-center">
					<AspectRatio ratio={16 / 9}>
						<ReactPlayer
							url={URL.createObjectURL(MOCK_RESULT.video)}
							width="100%"
							height="100%"
							controls={true}
						/>
					</AspectRatio>
				</div>
				<div className="col-span-1 flex flex-col gap-y-4 py-3 px-4">
					<div className="flex flex-col gap-y-2">
						<h1 className="text-3xl font-bold">
							Thank you for trying this demo!
						</h1>
						<p>
							Your video
							<em> {MOCK_RESULT.filename}</em> has been processed.
						</p>
						<p>
							<b>Annotation type: </b>
							{annotationTypeMap[MOCK_RESULT.annotationType]}
						</p>
						<div className="flex flex-col gap-y-2">
							<p>
								<b>Speakers </b>({MOCK_RESULT.speakers.length}):
							</p>
							<SpeakerListDisplay
								speakers={MOCK_RESULT.speakers}
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 space-x-2">
						{/* TODO download files */}
						<Button className="py-6 text-md">
							<VideoIcon className="mr-2 h-5 w-5" />
							Get video
						</Button>
						<Button className="py-6 text-md">
							<FileTextIcon className="mr-2 h-5 w-5" />
							Get transcript
						</Button>
					</div>
				</div>
			</div>
			<Button
				className="w-fit my-2 self-end"
				type="reset"
				onClick={nextStage}
			>
				Start over
				{/* TODO reset form & clear videoInput field */}
			</Button>
		</div>
	);
}

interface SpeakerListDisplayProps {
	speakers: {
		name: string;
		thumbnail: File;
	}[];
}
function SpeakerListDisplay({
	speakers,
}: SpeakerListDisplayProps): ReactElement {
	return (
		<ScrollArea
			className={`${speakers.length > 3 ? "h-36" : "h-fit"} px-2`}
		>
			{/* TODO dynamic height ? */}
			{speakers.map((speaker, idx) => (
				<div className="flex flex-row space-x-4 items-center mb-2">
					<Avatar
						className="h-16 w-16 border-solid border-4"
						style={{ borderColor: DEFAULT_HEX_10[idx] }}
						// TODO use speaker colour
					>
						{/* <AvatarImage src="https://github.com/shadcn.png" /> */}
						<AvatarImage
							src={URL.createObjectURL(speaker.thumbnail)}
						/>
						<AvatarFallback
							style={{ backgroundColor: DEFAULT_HEX_10[idx] }}
							// TODO use speaker colour
							className="text-white text-lg"
						>
							{idx + 1}
						</AvatarFallback>
					</Avatar>
					<em>{speaker.name}</em>
				</div>
			))}
		</ScrollArea>
	);
}
