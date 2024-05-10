import { ReactElement } from "react";
import { Slider } from "@/shadcn/components/ui/slider";
import {
  FONTSIZE_PT_INTERVAL,
  FONTSIZE_PT_MAX,
  FONTSIZE_PT_MIN,
  FontSize,
} from "@/types/videoFormInputs";
import {
  fontSizeFormatMap,
  fontSizePtMap,
} from "@/constants/fontSizeFormatMap";

interface FontSizeSliderProps {
  value: FontSize;
  updateValue: (newValue: FontSize) => void;
}

export default function FontSizeSlider({
  value,
  updateValue,
}: FontSizeSliderProps): ReactElement {
  return (
    <div className="h-9 grid grid-cols-4">
      <p
        className={`col-span-1 flex items-center ${fontSizeFormatMap[value][1]}`}
      >
        {value}
      </p>
      <Slider
        className="col-span-3"
        defaultValue={[fontSizeFormatMap[value][0]]}
        min={FONTSIZE_PT_MIN}
        max={FONTSIZE_PT_MAX}
        step={FONTSIZE_PT_INTERVAL}
        onValueChange={(newValue) => updateValue(fontSizePtMap[newValue[0]][0])}
      />
    </div>
  );
}
