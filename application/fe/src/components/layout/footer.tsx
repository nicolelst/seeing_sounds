import { ReactElement } from "react";
import { Button } from "@/shadcn/components/ui/button";
import { linkInfoMap } from "@/constants/linkInfoMap";

export function Footer(): ReactElement {
  return (
    <div className="flex flex-row bg-slate-900 text-gray-500 items-center sticky bottom-0 py-2 px-8">
      <div className="flex w-full h-fit">
        <p className="font-sans text-sm italic text-white">
          Submitted to the School of Computer Science and Engineering of Nanyang
          Technological University in 2024
        </p>
      </div>
      {Object.entries(linkInfoMap).map((info, idx) => (
        <div key={idx} className="flex flex-row items-center">
          <Button variant="link" className="text-white" type="button" asChild>
            <a href={info[1].link} target="_blank">
              {info[1].icon("sm")}
              {info[0]}
            </a>
          </Button>
          |
        </div>
      ))}
    </div>
  );
}
