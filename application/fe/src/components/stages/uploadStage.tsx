import { Button } from "@/shadcn/components/ui/button";
import { FormInputs } from "@/types/formInputs";
import { ReactElement } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface UploadStageProps {
	register: UseFormRegister<FormInputs>;
	errors: FieldErrors<FormInputs>;
	nextStage: () => void;
}

export default function UploadStage({
	register,
	errors,
	nextStage,
}: UploadStageProps): ReactElement {
	return (
		<div className="flex flex-col w-full h-full">
			<div className="flex flex-col w-full h-full bg-yellow-300">
				UPLOAD
				<input {...register("exampleRequired", { required: true })} />
				{errors.exampleRequired && <span>This field is required</span>}
			</div>
			<Button className="w-fit my-2 self-end" onClick={nextStage}>
				Next
			</Button>
		</div>
	);
}
