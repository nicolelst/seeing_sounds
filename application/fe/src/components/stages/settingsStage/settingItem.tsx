import { ReactNode, ReactElement } from "react";
import { FieldError, Merge } from "react-hook-form";
import { Label } from "@/shadcn/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shadcn/components/ui/tooltip";
import { CircleHelpIcon, TriangleAlertIcon } from "lucide-react";

interface SettingItemProps {
  label: string;
  description: string;
  children: ReactNode;
  triggerAsChild?: boolean;
  error: Merge<FieldError, (FieldError | undefined)[]> | undefined;
}

export default function SettingItem({
  label,
  description,
  children,
  error,
}: SettingItemProps): ReactElement {
  return (
    <div className="grid grid-cols-5 items-center gap-4">
      <div className="col-span-2 flex flex-row justify-end items-center gap-x-2 pr-4">
        <Label>{label}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger type="button">
              {error ? (
                <TriangleAlertIcon className="h-5 w-5 stroke-red-600 fill-red-100" />
              ) : (
                <CircleHelpIcon className="h-5 w-5 stroke-gray-500" />
              )}
            </TooltipTrigger>
            <TooltipContent
              className={`py-2 px-3 border ${
                error
                  ? "border-red-200 bg-red-100 text-red-600"
                  : "border-slate-200 bg-slate-900 text-white"
              }`}
              side="bottom"
            >
              <div className="max-w-60 text-balance break-words">
                <p className="inline text-sm hyphens-auto ">
                  {error ? error.message : description}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="col-span-3">{children}</div>
    </div>
  );
}
