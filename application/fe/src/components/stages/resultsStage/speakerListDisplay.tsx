import { ReactElement } from "react";
import { DEFAULT_HEX_10 } from "@/types/colourInfo";
import SpeakerAvatar from "./speakerAvatar";

interface SpeakerListDisplayProps {
	speakerThumbnails: File[];
}
export default function SpeakerListDisplay({
	speakerThumbnails,
}: SpeakerListDisplayProps): ReactElement {
	return (
		<div className="flex flex-row px-4 gap-x-4 gap-y-2 max-h-44 flex-wrap overflow-y-scroll">
			{/* TODO dynamic height ? */}
			{speakerThumbnails.map((img, idx) => (
				<SpeakerAvatar
					className="mx-auto"
					key={idx + 1}
					colour={DEFAULT_HEX_10[idx]}
					img={img}
					id={idx + 1}
				/>
			))}
		</div>
	);
}
