import { ReactNode, ReactElement } from "react";
import { FieldError } from "react-hook-form";
import { Label } from "@/shadcn/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shadcn/components/ui/tooltip";

interface SettingItemProps {
	label: string;
	// description: string;
	children: ReactNode;
	error: FieldError | undefined;
}

export default function SettingItem({
	label,
	// description,
	children,
	error,
}: SettingItemProps): ReactElement {
	return (
		<div className="grid grid-cols-5 items-center gap-4">
			<Label className="col-span-2 justify-end flex flex-row">
				{label}
			</Label>
			<div className="col-span-3 flex flex-col">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>{children}</TooltipTrigger>
						{error && (
							<TooltipContent
								className={`ml-2 border text-wrap break-words hyphens-auto max-w-60 ${
									error
										? "border-red-200 bg-red-100 text-red-600"
										: "border-gray-200 bg-gray-100 text-black"
								}`}
								side="right"
							>
								{/* {
									error ? ( */}
								<p className="text-red-600">{error.message}</p>
								{/* )
									: (
									 	<p>{description}</p>
									 )
								} */}
							</TooltipContent>
						)}
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
}
