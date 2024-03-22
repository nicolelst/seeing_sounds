import { Button } from "@/shadcn/components/ui/button";
import {
	FileTextIcon,
	GitHubLogoIcon,
	InfoCircledIcon,
} from "@radix-ui/react-icons";
import { ReactElement } from "react";

export function Footer(): ReactElement {
	return (
		<div className="flex flex-row bg-slate-900 text-gray-500 items-center sticky bottom-0 py-2 px-8">
			<div className="flex w-full h-fit">
				<p className="font-sans text-sm italic text-white">
					Submitted to the School of Computer Science and Engineering
					of Nanyang Technological University in 2024
				</p>
			</div>
			{/* TODO add button functionality */}
			<Button variant="link" className="text-white">
				<FileTextIcon className="mr-1.5 h-4 w-4" />
				Report
			</Button>
			|
			<Button variant="link" className="text-white">
				<GitHubLogoIcon className="mr-1.5 h-4 w-4" />
				Code
			</Button>
			|
			<Button variant="link" className="text-white">
				<InfoCircledIcon className="mr-1.5 h-4 w-4" />
				About
			</Button>
		</div>
	);
}
