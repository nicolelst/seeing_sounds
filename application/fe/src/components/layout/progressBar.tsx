import { Button } from "@/shadcn/components/ui/button";
import { Progress } from "@/shadcn/components/ui/progress";
import { ReactElement } from "react";

interface ProgressBarProps {
	formStageNames: Array<string>;
	formStageNum: number;
	setFormStageNum: React.Dispatch<React.SetStateAction<number>>;
}
export default function ProgressBar({
	formStageNames,
	formStageNum,
}: // setFormStageNum, // TODO allow changing page by clicking button
ProgressBarProps): ReactElement {
	return (
		<div className="flex flex-col items-center justify-center">
			<div
				className="flex flex-row py-2"
			>
				{formStageNames.map((name, index) => (
					<div className="flex items-center">
						<StageDisplay
							key={index}
							stageName={name}
							stageNum={index + 1}
							colour={
								formStageNum >= index + 1
									? "slate-900"
									: "gray-400"
							}
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
	colour: string;
}

function StageDisplay({
	stageName,
	stageNum,
	colour,
}: StageDisplayProps): ReactElement {
	return (
		<div className="flex flex-col justify-center items-center gap-2">
			<Button
				className={`rounded-full w-20 h-20 text-3xl font-semibold bg-${colour} hover:bg-${colour}`}
			>
				{stageNum}
			</Button>
			<p className="font-semibold">{stageName}</p>
		</div>
	);
}
