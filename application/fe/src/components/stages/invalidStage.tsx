import { FrownIcon } from "lucide-react";
import { ReactElement } from "react";

export function InvalidStage(): ReactElement {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col w-full h-full mb-8 items-center justify-center bg-red-300 text-red-600">
        <FrownIcon className="h-32 w-32 mx-8 mb-8" />
        <h1 className="text-2xl">Something went wrong. Please try again.</h1>
      </div>
    </div>
  );
}
