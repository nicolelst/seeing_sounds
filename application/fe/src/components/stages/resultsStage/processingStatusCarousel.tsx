import { ReactElement } from "react";
import { Card, CardContent } from "@/shadcn/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
} from "@/shadcn/components/ui/carousel";
import {
	processingStatus,
	processingStatusMap,
} from "@/types/processingStatus";

interface ProcessingStatusCarouselProps {
	status: processingStatus;
}

export default function ProcessingStatusCarousel({
	status,
}: ProcessingStatusCarouselProps): ReactElement {
	// TODO scroll to appropriate page when update

	const statusIndex = Object.keys(processingStatusMap).findIndex(
		(s) => s === status
	);

	return (
		<Carousel className="w-4/5 max-w-2xl">
			<CarouselContent>
				{Object.entries(processingStatusMap).map((procStatus, idx) => (
					<CarouselItem key={idx}>
						<div className="px-12">
							<Card>
								<CardContent
									className={`aspect-[4/3] flex flex-col gap-y-4 items-center justify-center text-center text-balance p-10 ${
										idx < statusIndex
											? "bg-green-100" // done
											: idx === statusIndex
											? "bg-amber-100" // in progress
											: "bg-gray-100 text-slate-500" // later
									}`}
								>
									{procStatus[1].icon}
									<span className="text-4xl font-semibold">
										{procStatus[1].name}
									</span>
									<p className="text-lg">
										{procStatus[1].desc}
									</p>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious
				className="bg-gray-200 hover:bg-gray-300 h-16 w-16"
				arrowClassName="h-8 w-8"
			/>
			<CarouselNext
				className="bg-gray-200 hover:bg-gray-300 h-16 w-16"
				arrowClassName="h-8 w-8"
			/>
		</Carousel>
	);
}
