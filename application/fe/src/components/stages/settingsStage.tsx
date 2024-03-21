import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Label } from "@/shadcn/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shadcn/components/ui/select";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/shadcn/components/ui/accordion";
import { FormInputs } from "@/types/formInputs";
import { ReactElement, ReactNode } from "react";
import {
	UseFormRegister,
	FieldError,
	FieldErrors,
	UseFormGetValues,
	UseFormSetValue,
	UseFormWatch,
} from "react-hook-form";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import { annotationType, annotationTypeMap } from "@/types/annotationType";
import { Slider } from "@/shadcn/components/ui/slider";

interface SettingsStageProps {
	register: UseFormRegister<FormInputs>;
	getValues: UseFormGetValues<FormInputs>;
	setValue: UseFormSetValue<FormInputs>;
	watch: UseFormWatch<FormInputs>;
	errors: FieldErrors<FormInputs>;
}

export default function SettingsStage({
	register,
	getValues,
	setValue,
	watch,
	errors,
}: SettingsStageProps): ReactElement {
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
							label="How many speakers are in the video?"
							error={errors.numSpeakers}
						>
							<Input
								{...register("numSpeakers", {
									required: true,
									valueAsNumber: true,
									min: 1,
									// TODO reject decimals, letters
									// setValueAs: v => parseInt(v),
									// onChange: (e) => {
									//   return e.target.value.replace(/[^1-9]/g, '');
									// },
								})}
							/>
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
		18: ["xs", "Small"],
		24: ["base", "Default"],
		30: ["lg", "Large"],
		36: ["2xl", "Giant"],
	};

	return (
		<div className="h-9 grid grid-cols-4">
			<p
				className={`col-span-1 flex items-center text-${
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
	// randomly select getValues("numSpeakers") colours
	// display as black / white text on coloured background
	return (
		<div>
			TODO
		</div>
	);
}
