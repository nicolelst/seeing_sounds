import { Button } from "@/shadcn/components/ui/button";
import { FormInputs } from "@/types/formInputs";
import { ReactElement } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface ResultsStageProps {
	register: UseFormRegister<FormInputs>;
	errors: FieldErrors<FormInputs>;
	nextStage: () => void;
}

export default function ResultsStage({
	register,
	errors,
	nextStage,
}: ResultsStageProps): ReactElement {
	return (
		<div className="flex flex-col w-full h-full">
			<div className="flex flex-col w-full h-full bg-green-300">
				RESULTS
			</div>
			<Button className="w-fit my-2 self-end" onClick={nextStage}>
				Start over
			</Button>
		</div>
	);
}
