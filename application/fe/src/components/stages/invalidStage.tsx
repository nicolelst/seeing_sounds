import { ReactElement } from "react";

export function InvalidStage(): ReactElement {
	return (
		<div className="flex w-full h-full items-center justify-center bg-red-300">
			{/* TODO */}
			<h1>Something went wrong. Please try again.</h1>
		</div>
	);
}
