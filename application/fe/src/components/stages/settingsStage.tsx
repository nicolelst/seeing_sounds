import { ReactElement, ReactNode, useState } from "react";
import {
	UseFormRegister,
	FieldError,
	FieldErrors,
	UseFormGetValues,
	UseFormSetValue,
	UseFormWatch,
} from "react-hook-form";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/shadcn/components/ui/accordion";
import { Badge } from "@/shadcn/components/ui/badge";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Label } from "@/shadcn/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/shadcn/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shadcn/components/ui/select";
import { Slider } from "@/shadcn/components/ui/slider";
import { Switch } from "@/shadcn/components/ui/switch";
import { FormInputs } from "@/types/formInputs";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import { TwitterPicker } from "react-color";
import { annotationType, annotationTypeMap } from "@/types/annotationType";
import {
	DEFAULT_HEX_10,
	DEFAULT_RGB_10,
	RGBString,
	getRGBstring,
} from "@/types/colourInfo";

interface SettingsStageProps {
	register: UseFormRegister<FormInputs>;
	getValues: UseFormGetValues<FormInputs>;
	setValue: UseFormSetValue<FormInputs>;
	watch: UseFormWatch<FormInputs>;
	errors: FieldErrors<FormInputs>;
}

export function SettingsStage({
	// register,
	getValues,
	setValue,
	watch,
}: // errors,
SettingsStageProps): ReactElement {
	return (
		<div className="flex flex-col w-full h-full">
			{/* TODO validation + error messages */}
			{/* <input {...register("exampleRequired", { required: true })} />
				{errors.exampleRequired && <span>This field is required</span>} */}
			<Accordion
				type="single"
				collapsible
				defaultValue="video"
				className="w-full h-full max-w-2xl mx-auto"
			>
				<SettingAccordionItem value="video" header="Video annotation">
					<div className="flex flex-col gap-4">
						<SettingItem
							label="Select captioning interface"
							error={undefined}
							// TODO add error
						>
							{/* TODO info button for interface preview/explanation */}
							{/* TODO register annotationType */}
							{/* TODO enable when options available */}
							{/* TODO change value based on form */}
							<InterfaceSelector
								selectedValue={getValues("annotationType")}
								setValue={setValue}
							/>
						</SettingItem>
						<SettingItem
							label="Font size"
							error={undefined}
							// TODO add error
						>
							<FontSlider
								getValues={getValues}
								setValue={setValue}
								watch={watch}
							/>
						</SettingItem>
						<SettingItem
							label="Caption text colour"
							error={undefined}
							// TODO add error
						>
							<div className="flex items-center space-x-2">
								<Switch
									checked={getValues("captionBlackText")}
									onCheckedChange={(value) =>
										setValue("captionBlackText", value)
									}
								/>
								<p>
									{watch("captionBlackText")
										? "Black"
										: "White"}
								</p>
							</div>
						</SettingItem>
						<SettingItem
							label="Speaker colours"
							error={undefined}
							// TODO add error
						>
							<CaptionColourInputs
								getValues={getValues}
								setValue={setValue}
							/>
						</SettingItem>
					</div>
				</SettingAccordionItem>
				<SettingAccordionItem
					value="transcript"
					header="Video transcript"
				>
					<div className="flex flex-col gap-4">
						<SettingItem
							label="Setting"
							error={undefined}
							// errors.numSpeakers
						>
							<Input
							// {...register("numSpeakers", {
							// 	required: true,
							// })}
							/>
						</SettingItem>
					</div>
				</SettingAccordionItem>
				<SettingAccordionItem
					value="speechSep"
					header="Speech separation model parameters"
				>
					<div className="flex flex-col gap-4">
						<SettingItem
							label="Setting"
							error={undefined}
							// errors.numSpeakers
						>
							<Input
							// {...register("numSpeakers", {
							// 	required: true,
							// })}
							/>
						</SettingItem>
					</div>
				</SettingAccordionItem>
				<SettingAccordionItem
					value="speechRec"
					header="Speech recognition model parameters"
				>
					<div className="flex flex-col gap-4">
						<SettingItem
							label="Setting"
							error={undefined}
							// errors.numSpeakers
						>
							<Input
							// {...register("numSpeakers", {
							// 	required: true,
							// })}
							/>
						</SettingItem>
					</div>
				</SettingAccordionItem>
			</Accordion>
			<Button className="w-fit my-2 self-end" type="submit">
				Next
			</Button>
		</div>
	);
}

interface SettingAccordionItemProps {
	value: string;
	header: string;
	children: ReactNode;
	scrollable?: boolean;
}

function SettingAccordionItem({
	value,
	header,
	children,
	scrollable,
}: SettingAccordionItemProps): ReactElement {
	return (
		<AccordionItem value={value}>
			<AccordionTrigger className="text-lg font-semibold hover:no-underline py-3">
				{header}
			</AccordionTrigger>
			<AccordionContent className="px-1 pt-1 pb-4">
				{scrollable ?? false ? (
					<ScrollArea className="h-52 pr-4">
						{/* TODO dynamically determine size based on screen */}
						{children}
					</ScrollArea>
				) : (
					children
				)}
			</AccordionContent>
		</AccordionItem>
	);
}

interface SettingItemProps {
	label: string;
	children: ReactNode;
	error: FieldError | undefined;
}

function SettingItem({
	label,
	children,
	error,
}: SettingItemProps): ReactElement {
	return (
		<div className="grid grid-cols-5 items-center gap-4">
			<Label className="col-span-2 text-right">{label}</Label>
			<div className="col-span-3 flex flex-col">
				{children}
				{/* TODO error tooltip to right of input */}
				<p className="text-red-600">{error?.message}</p>
			</div>
		</div>
	);
}

interface InterfaceSelectorProps {
	disabled?: boolean;
	selectedValue?: annotationType;
	setValue: UseFormSetValue<FormInputs>;
}
function InterfaceSelector({
	disabled,
	selectedValue,
	setValue,
}: InterfaceSelectorProps): ReactElement {
	return (
		<Select
			disabled={disabled ?? false}
			defaultValue={selectedValue ?? "floating"}
			onValueChange={(value) =>
				setValue("annotationType", value as annotationType)
			}
		>
			<SelectTrigger>
				<SelectValue placeholder="Select an interface" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{Object.entries(annotationTypeMap).map((anotType) => (
						<SelectItem key={anotType[0]} value={anotType[0]}>
							{anotType[1]}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

interface FontSliderProps {
	getValues: UseFormGetValues<FormInputs>;
	setValue: UseFormSetValue<FormInputs>;
	watch: UseFormWatch<FormInputs>;
}
function FontSlider({
	getValues,
	setValue,
	watch,
}: FontSliderProps): ReactElement {
	const fontSizeMap: Record<number, [string, string]> = {
		18: ["text-sm", "Small"],
		24: ["text-base", "Default"],
		30: ["text-lg", "Large"],
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

interface CaptionColourInputsProps {
	getValues: UseFormGetValues<FormInputs>;
	setValue: UseFormSetValue<FormInputs>;
}
function CaptionColourInputs({
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
							<PopoverTrigger>
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
