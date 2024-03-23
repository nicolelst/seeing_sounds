import { ReactElement } from "react";
import { UseFormGetValues } from "react-hook-form";
import ReactPlayer from "react-player";
import { AspectRatio } from "@/shadcn/components/ui/aspect-ratio";
import { Button } from "@/shadcn/components/ui/button";
import { Pencil2Icon, VideoIcon } from "@radix-ui/react-icons";
import { FormInputs } from "@/types/formInputs";
import { annotationTypeMap } from "@/types/annotationType";
import SpeakerListDisplay from "./speakerListDisplay";

import myVideo from "/Users/User/Documents/fyp/feb_test_interfaces/cinna_short/floating_subtitles_bbox.mp4";

interface ResultsStageProps {
	getValues: UseFormGetValues<FormInputs>;
	nextStage: () => void;
	resetForm: () => void;
}

export function ResultsStage({
	getValues,
	nextStage,
	resetForm,
}: ResultsStageProps): ReactElement {
	// TODO remove mock, replace w api response
	const MOCK_RESULT = {
		filename: getValues("videoInput")[0].name,
		annotationType: getValues("annotationType"),
		speakerThumbnails: [
			new File([""], "image_one"),
			new File([""], "image_two"),
			new File([""], "image_three"),
			new File([""], "image_four"),
			new File([""], "image_five"),
			new File([""], "image_six"),
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
							url={myVideo}
							// TODO remove mock result url={URL.createObjectURL(MOCK_RESULT.video)}
							width="100%"
							height="100%"
							controls={true}
						/>
					</AspectRatio>
				</div>
				<div className="col-span-1 flex flex-col gap-y-4 py-3 px-4 ml-2 justify-center">
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
								<b>Speakers </b>(
								{MOCK_RESULT.speakerThumbnails.length}):
							</p>
							<SpeakerListDisplay
								speakerThumbnails={
									MOCK_RESULT.speakerThumbnails
								}
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
							<Pencil2Icon className="mr-2 h-5 w-5" />
							Get transcript
						</Button>
					</div>
				</div>
			</div>
			<Button
				className="w-fit my-3 self-end"
				type="reset"
				onClick={() => {
					resetForm();
					nextStage();
				}}
			>
				Start over
				{/* TODO reset form & clear videoInput field */}
			</Button>
		</div>
	);
}
