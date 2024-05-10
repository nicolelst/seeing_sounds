import { ReactElement, useEffect, useState } from "react";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { Badge } from "@/shadcn/components/ui/badge";
import { Label } from "@/shadcn/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shadcn/components/ui/popover";
import { TwitterPicker } from "react-color";
import { VideoFormInputs } from "@/types/videoFormInputs";
import { DEFAULT_HEX_10 } from "@/constants/defaultColours";

interface CaptionColourInputsProps {
  getValues: UseFormGetValues<VideoFormInputs>;
  setValue: UseFormSetValue<VideoFormInputs>;
}

export default function CaptionColourInputs({
  getValues,
  setValue,
}: CaptionColourInputsProps): ReactElement {
  // TODO set up default colours
  const [hexColours, setHexColours] = useState<Array<string>>(
    DEFAULT_HEX_10.slice(0, getValues("numSpeakers"))
  );

  useEffect(() => {
    setValue("speakerColours", hexColours);
  }, [hexColours, setValue]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-1.5 flex-wrap">
        {Array.from({ length: getValues("numSpeakers") }).map((_item, idx) => (
          <Popover key={idx + 1}>
            <PopoverTrigger>
              <Badge
                style={{ backgroundColor: hexColours[idx] }}
                className={`rounded-full ${
                  getValues("captionBlackText") ? "text-black" : "text-white"
                }`}
              >
                Speaker {idx + 1}
              </Badge>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-1.5 w-fit">
              <Label>Select colour for Speaker {idx + 1}</Label>
              <TwitterPicker
                triangle="hide"
                color={hexColours[idx]}
                onChange={(newC) => {
                  setHexColours(
                    hexColours.map((hex, i) => {
                      if (i === idx) {
                        return newC.hex;
                      } else {
                        return hex;
                      }
                    })
                  );
                }}
              />
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
}
