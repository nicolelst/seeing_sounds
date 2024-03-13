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
import { FormInputs } from "@/types/formInputs";
import { ReactElement, ReactNode } from "react";
import { UseFormRegister, FieldError, FieldErrors } from "react-hook-form";

interface SettingsStageProps {
	register: UseFormRegister<FormInputs>;
	errors: FieldErrors<FormInputs>;
}

export default function SettingsStage({
	register,
	errors,
}: SettingsStageProps): ReactElement {
	return (
		<div className="flex flex-col w-full h-full">
			<div className="flex flex-col w-full h-full">
				{/* <input {...register("exampleRequired", { required: true })} />
				{errors.exampleRequired && <span>This field is required</span>} */}
				<div className="grid gap-4 py-4 w-full max-w-2xl mx-auto">
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
						label="Select captioning interface"
						error={undefined}
					>
						{/* TODO info button for interface preview/explanation */}
						{/* TODO register annotationType */}
						{/* TODO enable when options available */}
						<Select disabled defaultValue="floating">
							<SelectTrigger>
								<SelectValue placeholder="Select an interface" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="floating">
										Floating captions (default)
									</SelectItem>
									<SelectItem value="colour">
										Static captions coloured by speaker
									</SelectItem>
									<SelectItem value="pointer">
										Static captions with pointers
									</SelectItem>
									<SelectItem value="traditional">
										Traditional static captions
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</SettingItem>
				</div>
			</div>
			<Button className="w-fit my-2 self-end" type="submit">
				Next
			</Button>
		</div>
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
