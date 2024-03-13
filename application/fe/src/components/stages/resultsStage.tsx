import { Button } from "@/shadcn/components/ui/button";
import { FormInputs } from "@/types/formInputs";
import { ReactElement } from "react";
import {
	// UseFormRegister,
	UseFormGetValues,
	// FieldErrors,
} from "react-hook-form";

interface ResultsStageProps {
	// register: UseFormRegister<FormInputs>;
	getValues: UseFormGetValues<FormInputs>;
	// errors: FieldErrors<FormInputs>;
	nextStage: () => void;
}

export default function ResultsStage({
	getValues,
	nextStage,
}: ResultsStageProps): ReactElement {
	return (
		<div className="flex flex-col w-full h-full">
			<div className="flex flex-col w-full h-full bg-green-300">
				RESULTS
				<p>POST {JSON.stringify(getValues())}</p>
				{/* TODO mock loading effect */}
				{/* TODO display result */}
				{/* TODO download button */}
			</div>
			<Button
				className="w-fit my-2 self-end"
				type="reset"
				onClick={nextStage}
			>
				Start over
				{/* TODO reset form & clear videoInput field */}
			</Button>
		</div>
	);
}
