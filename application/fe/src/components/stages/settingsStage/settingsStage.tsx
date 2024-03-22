import { ReactElement } from "react";
import {
	UseFormRegister,
	FieldErrors,
	UseFormGetValues,
	UseFormSetValue,
	UseFormWatch,
} from "react-hook-form";
import { Accordion } from "@/shadcn/components/ui/accordion";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Switch } from "@/shadcn/components/ui/switch";
import { FormInputs } from "@/types/formInputs";
import CaptionColourInputs from "./captionColourInputs";
import FontSizeSlider from "./fontSizeSlider";
import InterfaceSelector from "./interfaceSelector";
import SettingsAccordionItem from "./settingsAccordionItem";
import SettingItem from "./settingItem";

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
				<SettingsAccordionItem value="video" header="Video annotation">
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
							<FontSizeSlider
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
				</SettingsAccordionItem>
				<SettingsAccordionItem
					value="transcript"
					header="Video transcript"
				>
					<div className="flex flex-col gap-4">
						<SettingItem
							label="Speaker names TODO"
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
				</SettingsAccordionItem>
				<SettingsAccordionItem
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
				</SettingsAccordionItem>
				<SettingsAccordionItem
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
				</SettingsAccordionItem>
			</Accordion>
			<Button className="w-fit my-2 self-end" type="submit">
				Next
			</Button>
		</div>
	);
}