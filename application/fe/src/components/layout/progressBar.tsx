import { Button } from "@/shadcn/components/ui/button";
import { Progress } from "@/shadcn/components/ui/progress";
import { ReactElement } from "react";

interface ProgressBarProps {
	formStageNames: Array<string>;
	formStageNum: number;
	setFormStageNum: React.Dispatch<React.SetStateAction<number>>;
}
export function ProgressBar({
	formStageNames,
	formStageNum,
	setFormStageNum,
}: ProgressBarProps): ReactElement {
	return (
		<div className="flex flex-col items-center justify-center">
			<div className="flex flex-row py-2">
				{formStageNames.map((name, index) => (
					<div className="flex items-center" key={index}>
						<StageDisplay
							stageName={name}
							stageNum={index + 1}
							disabled={formStageNum < index + 1}
							onClick={() => {
								setFormStageNum(index + 1);
							}}
						/>
						{index < formStageNames.length - 1 ? (
							<Progress
								value={formStageNum > index + 1 ? 100 : 0}
								className="w-32 mx-8"
							/>
						) : null}
					</div>
				))}
			</div>
		</div>
	);
}

interface StageDisplayProps {
	stageName: string;
	stageNum: number;
	disabled: boolean;
	onClick: () => void;
}

function StageDisplay({
	stageName,
	stageNum,
	disabled,
	onClick,
}: StageDisplayProps): ReactElement {
	return (
		<div className="flex flex-col justify-center items-center gap-2">
			<Button
				className={`rounded-full w-20 h-20 text-3xl font-semibold ${ disabled ? 'bg-gray-400 hover:bg-gray-400' : 'bg-slate-900 hover:bg-slate-900' }`}
				onClick={onClick}
				disabled={disabled}
				type="button"
			>
				{stageNum}
			</Button>
			<p className="font-semibold">{stageName}</p>
		</div>
	);
}
