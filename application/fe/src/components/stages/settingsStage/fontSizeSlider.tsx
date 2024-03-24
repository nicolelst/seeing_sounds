import { ReactElement } from "react";
import {
	UseFormGetValues,
	UseFormSetValue,
	UseFormWatch,
} from "react-hook-form";
import { Slider } from "@/shadcn/components/ui/slider";
import { FormInputs } from "@/types/formInputs";

interface FontSizeSliderProps {
	getValues: UseFormGetValues<FormInputs>;
	setValue: UseFormSetValue<FormInputs>;
	watch: UseFormWatch<FormInputs>;
}

export default function FontSizeSlider({
	getValues,
	setValue,
	watch,
}: FontSizeSliderProps): ReactElement {
	const fontSizeMap: Record<number, [string, string]> = {
		18: ["text-sm", "Small"],
		24: ["text-base", "Default"],
		30: ["text-xl", "Large"],
		36: ["text-2xl", "Giant"],
	};

	return (
		<div className="h-9 grid grid-cols-4">
			<p
				className={`col-span-1 flex items-center ${
					fontSizeMap[watch("fontSize")][0]
				}`}
			>
				{fontSizeMap[watch("fontSize")][1]}
			</p>
			<Slider
				className="col-span-3"
				defaultValue={[getValues("fontSize")]}
				min={18}
				max={36}
				step={6}
				onValueChange={(value) => setValue("fontSize", value[0])}
			/>
		</div>
	);
}
