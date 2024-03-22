import { ReactElement, useState } from "react";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { Badge } from "@/shadcn/components/ui/badge";
import { Label } from "@/shadcn/components/ui/label";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/shadcn/components/ui/popover";
import { TwitterPicker } from "react-color";
import { FormInputs } from "@/types/formInputs";
import {
	DEFAULT_HEX_10,
	DEFAULT_RGB_10,
	RGBString,
	getRGBstring,
} from "@/types/colourInfo";

interface CaptionColourInputsProps {
	getValues: UseFormGetValues<FormInputs>;
	setValue: UseFormSetValue<FormInputs>;
}

export default function CaptionColourInputs({
	getValues,
	setValue,
}: CaptionColourInputsProps): ReactElement {
	// TODO set up default colours
	// TODO these arrays dont expand for more speakers, shifted numSpeakers to prev page
	const [hexColours, setHexColours] = useState<Array<string>>(
		// Array.from<string>({ length: watch("numSpeakers") }).fill("#000000")
		// ["#1f77b4", "#4e72b3", "#2ba02b", "#d62727", "#9467bd", "#8c564c", "#e377c3", "#7f7f7f", "#bcbd21", "#15becf"].slice(0, getValues("numSpeakers"))
		// ["#4c72b0", "#de8554", "#57a867", "#c84d50", "#8071b2", "#91785f", "#da8ac4", "#8c8c8c", "#cbbb73", "#64b5ce"].slice(0, getValues("numSpeakers"))
		DEFAULT_HEX_10.slice(0, getValues("numSpeakers"))
	);
	setValue(
		"speakerColours",
		// Array.from<RGBString>({ length: getValues("numSpeakers") }).fill("rgb(0,0,0)")
		// ["rgb(31,119,180)", "rgb(255,127,15)", "rgb(43,160,43)", "rgb(214,39,39)", "rgb(148,103,189)", "rgb(140,86,76)", "rgb(227,119,195)", "rgb(127,127,127)", "rgb(188,189,33)", "rgb(21,190,207)"].slice(0, getValues("numSpeakers")) as Array<RGBString>
		DEFAULT_RGB_10.slice(0, getValues("numSpeakers")) as Array<RGBString>
	);
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-row gap-1.5 flex-wrap">
				{Array.from({ length: getValues("numSpeakers") }).map(
					(_item, idx) => (
						<Popover key={idx + 1}>
							<PopoverTrigger type="button">
								<Badge
									style={{ backgroundColor: hexColours[idx] }}
									className={`rounded-full ${
										getValues("captionBlackText")
											? "text-black"
											: "text-white"
									}`}
								>
									Speaker {idx + 1}
								</Badge>
							</PopoverTrigger>
							<PopoverContent className="flex flex-col gap-1.5 w-fit">
								<Label>
									Select colour for Speaker {idx + 1}
								</Label>
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
										setValue(
											"speakerColours",
											getValues("speakerColours").map(
												(rgb, i) => {
													if (i === idx) {
														return getRGBstring(
															newC
														);
													} else {
														return rgb;
													}
												}
											)
										);
									}}
								/>
							</PopoverContent>
						</Popover>
					)
				)}
			</div>
		</div>
	);
}
