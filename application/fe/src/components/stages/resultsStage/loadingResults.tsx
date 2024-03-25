import { Button } from "@/shadcn/components/ui/button";
import {
	FileTextIcon,
	GitHubLogoIcon,
	InfoCircledIcon,
} from "@radix-ui/react-icons";
import { ReactElement } from "react";
import ProcessingStatusCarousel from "./processingStatusCarousel";
import { processingStatus } from "@/types/processingStatus";

interface LoadingResultsProps {
	filename: string;
	status: processingStatus;
}

export default function LoadingResults({
	filename,
	status,
}: LoadingResultsProps): ReactElement {
	return (
		<div className="grid grid-cols-3 w-full h-fit py-8">
			<div className="col-span-2 flex items-center justify-center">
				<ProcessingStatusCarousel status={status} />
			</div>
			<div className="col-span-1 flex flex-col gap-y-4 px-3 py-4 justify-start">
				<div className="flex flex-col gap-y-2">
					<h1 className="text-3xl font-bold">
						Your video is being processed!
					</h1>
					<p>
						An annotated video and transcript for
						<em> {filename} </em> will be available shortly.
					</p>
					<div className="flex flex-col gap-y-2 items-start justify-center text-lg font-semibold">
						<p className="mt-4">
							In the meantime, check out these links:
						</p>
						<Button variant="link" className="text-base underline">
							<InfoCircledIcon className="mr-2 h-6 w-6" />
							More about this FYP
						</Button>
						<Button variant="link" className="text-base underline">
							<FileTextIcon className="mr-2 h-6 w-6" />
							Read the final report
						</Button>
						<Button variant="link" className="text-base underline">
							<GitHubLogoIcon className="mr-2 h-6 w-6" />
							View the code on Github
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
