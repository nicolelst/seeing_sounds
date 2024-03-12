import { Button } from "@/shadcn/components/ui/button";
import { FormInputs } from "@/types/formInputs";
import { ReactElement } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

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
			<div className="flex flex-col w-full h-full bg-blue-300">
				SETTINGS
				{/* <input {...register("exampleRequired", { required: true })} />
				{errors.exampleRequired && <span>This field is required</span>} */}
			</div>
			<Button className="w-fit my-2 self-end" type="submit">
				Next
			</Button>
		</div>
	);
}
