import { ReactElement } from "react";
import { RGBString } from "@/types/colourInfo";
import SpeakerAvatar from "./speakerAvatar";

interface SpeakerListDisplayProps {
  speakerThumbnailURLs: Array<string>;
  speakerColours: Array<RGBString>;
}
export default function SpeakerListDisplay({
  speakerThumbnailURLs,
  speakerColours,
}: SpeakerListDisplayProps): ReactElement {
  return (
    <div className="flex flex-row px-4 gap-x-4 gap-y-2 max-h-44 flex-wrap overflow-y-scroll">
      {/* TODO dynamic height ? */}
      {speakerThumbnailURLs.map((imgURL, idx) => (
        <SpeakerAvatar
          // className="mx-auto"
          key={idx + 1}
          colour={speakerColours[idx]}
          img={imgURL}
          id={idx + 1}
        />
      ))}
    </div>
  );
}
