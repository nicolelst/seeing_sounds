import { ReactElement } from "react";
import { DEFAULT_HEX_10 } from "@/types/colourInfo";
import SpeakerAvatar from "./speakerAvatar";

import img1 from "/Users/User/Documents/fyp/report_moist/faces/speaker1_best.png"
import img2 from "/Users/User/Documents/fyp/report_moist/faces/speaker2_best.png"

interface SpeakerListDisplayProps {
	speakerThumbnails: File[];
}
export default function SpeakerListDisplay({
	speakerThumbnails,
}: SpeakerListDisplayProps): ReactElement {
	return (
		<div className="flex flex-row px-4 gap-x-4 gap-y-2 max-h-44 flex-wrap overflow-y-scroll">
			{/* TODO dynamic height ? */}
			{/* {speakerThumbnails.map((imgFile, idx) => ( */}
			{[img1, img2].map((imgFile, idx) => (
				<SpeakerAvatar
					// className="mx-auto"
					key={idx + 1}
					colour={["#E05454", "#4D74AE"][idx]}//{DEFAULT_HEX_10[idx]}
					// img={URL.createObjectURL(imgFile)}
					img={imgFile}
					id={idx + 1}
				/>
			))}
		</div>
	);
}
