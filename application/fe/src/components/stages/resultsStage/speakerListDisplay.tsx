import { ReactElement } from "react";
import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from "@/shadcn/components/ui/avatar";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import { DEFAULT_HEX_10 } from "@/types/colourInfo";

interface SpeakerListDisplayProps {
	speakers: {
		name: string;
		thumbnail: File;
	}[];
}
export default function SpeakerListDisplay({
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
