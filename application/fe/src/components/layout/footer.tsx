import { Button } from "@/shadcn/components/ui/button";
import { ReactElement } from "react";

export function Footer(): ReactElement {
	return (
		<div className="flex flex-row bg-slate-900 text-white items-center sticky bottom-0 py-2 px-8">
			<div className="flex w-full h-fit">
				<p className="font-sans text-sm italic">
					Submitted to the School of Computer Science and Engineering
					of Nanyang Technological University in 2024
				</p>
			</div>
			{/* TODO add button functionality */}
			<Button variant="link" className="text-white">
				Report
			</Button>
			<Button variant="link" className="text-white">
				Code
			</Button>
			<Button variant="link" className="text-white">
				About this FYP
			</Button>
		</div>
	);
}
