import { ReactElement, useEffect, useState } from "react";
import { Card, CardContent } from "@/shadcn/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselApi,
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
  const statusIndex = Object.keys(processingStatusMap).findIndex(
    (s) => s === status
  );

  const [api, setApi] = useState<CarouselApi>();
  useEffect(() => {
    // automatically scroll to current index on status update
    api?.scrollTo(statusIndex);
  }, [api, statusIndex]);

  return (
    <Carousel className="w-4/5 max-w-2xl" setApi={setApi}>
      <CarouselContent>
        {Object.entries(processingStatusMap).map(
          (procStatus, idx) =>
            procStatus[0] != "ERROR" && (
              <CarouselItem key={idx}>
                <div className="px-12">
                  <Card>
                    <CardContent
                      className={`aspect-[4/3] flex flex-col gap-y-4 items-center justify-center text-center text-balance p-10 ${
                        idx < statusIndex
                          ? "bg-green-100" // done
                          : idx === statusIndex
                          ? "bg-amber-100" // in progress
                          : "bg-gray-100 text-slate-500" // yet to do
                      }`}
                    >
                      {procStatus[1].icon}
                      <span className="text-4xl font-semibold">
                        {procStatus[1].name}
                      </span>
                      <p className="text-lg">{procStatus[1].desc}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            )
        )}
      </CarouselContent>
      <CarouselPrevious
        type="button"
        className="bg-gray-200 hover:bg-gray-300 h-16 w-16"
        arrowClassName="h-8 w-8"
      />
      <CarouselNext
        type="button"
        className="bg-gray-200 hover:bg-gray-300 h-16 w-16"
        arrowClassName="h-8 w-8"
      />
    </Carousel>
  );
}
