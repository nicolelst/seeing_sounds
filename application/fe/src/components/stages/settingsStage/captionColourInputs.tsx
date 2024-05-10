import { ReactElement, useState } from "react";
import { Badge } from "@/shadcn/components/ui/badge";
import { Label } from "@/shadcn/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shadcn/components/ui/popover";
import { TwitterPicker } from "react-color";
import { DEFAULT_HEX_10 } from "@/constants/defaultColours";

interface CaptionColourInputsProps {
  getValue: (idx: number) => string | undefined;
  updateValue: (newValue: string, idx: number) => void;
  numSpeakers: number;
  captionTextColour: "black" | "white";
}

export default function CaptionColourInputs({
  getValue,
  updateValue,
  numSpeakers,
  captionTextColour,
}: CaptionColourInputsProps): ReactElement {
  const getColour = (idx: number) => getValue(idx) ?? DEFAULT_HEX_10[idx];

  const [bgColours, setBgColours] = useState<Array<string>>(
    Array.from(Array(numSpeakers).keys()).map((idx) => {
      const col = getColour(idx);
      updateValue(col, idx); // set defaults on first render
      return col;
    })
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-1.5 flex-wrap">
        {Array.from({ length: numSpeakers }).map((_item, idx) => (
          <Popover key={idx + 1} modal>
            <PopoverTrigger>
              <Badge
                style={{ backgroundColor: bgColours[idx] }}
                className={`rounded-full ${
                  captionTextColour == "black" ? "text-black" : "text-white"
                }`}
              >
                Speaker {idx + 1}
              </Badge>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-1.5 w-fit mt-1">
              <Label>Select colour for Speaker {idx + 1}</Label>
              <TwitterPicker
                triangle="hide"
                color={getColour(idx)}
                onChange={(newC) => {
                  updateValue(newC.hex, idx);
                  setBgColours(bgColours.map((_col, idx) => getColour(idx)));
                }}
              />
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
}
