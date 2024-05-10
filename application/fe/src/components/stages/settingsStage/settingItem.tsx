import { ReactNode, ReactElement } from "react";
import { FieldError } from "react-hook-form";
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
  error: FieldError | undefined;
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
              className={`ml-2 border text-sm text-wrap break-words hyphens-auto max-w-60 ${
                error
                  ? "border-red-200 bg-red-100 text-red-600"
                  : "border-gray-300 bg-gray-100 text-slate-700"
              }`}
              side="bottom"
            >
              <p>{error ? error.message : description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="col-span-3">{children}</div>
    </div>
  );
}
