import { ReactElement } from "react";
import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from "@/shadcn/components/ui/avatar";
import { DEFAULT_HEX_10 } from "@/types/colourInfo";

interface SpeakerListDisplayProps {
	speakerThumbnails: File[];
}
export default function SpeakerListDisplay({
	speakerThumbnails,
}: SpeakerListDisplayProps): ReactElement {
	return (
		<div
			className={`flex flex-row px-2 gap-x-4 gap-y-2 max-h-44 flex-wrap overflow-y-scroll`}
		>
			{/* TODO dynamic height ? */}
			{speakerThumbnails.map((img, idx) => (
				<Avatar
					className="h-20 w-20 border-solid border-4"
					style={{ borderColor: DEFAULT_HEX_10[idx] }}
					// TODO use speaker colour
				>
					{/* <AvatarImage src="https://github.com/shadcn.png" /> */}
					<AvatarImage src={URL.createObjectURL(img)} />
					<AvatarFallback
						style={{ backgroundColor: DEFAULT_HEX_10[idx] }}
						// TODO use speaker colour
						className="text-white text-lg"
					>
						{idx + 1}
					</AvatarFallback>
				</Avatar>
			))}
		</div>
	);
}
