import { ReactNode, ReactElement } from "react";
import { FieldError } from "react-hook-form";
import { Label } from "@/shadcn/components/ui/label";

interface SettingItemProps {
	label: string;
	children: ReactNode;
	error: FieldError | undefined;
}

export default function SettingItem({
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
