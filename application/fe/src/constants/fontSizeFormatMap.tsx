import { FontSize, FontSizePt } from "@/types/videoFormInputs";

export const fontSizeFormatMap: Record<FontSize, [FontSizePt, string]> = {
  Small: [18, "text-sm"],
  Default: [24, "text-base"],
  Large: [30, "text-xl"],
  Giant: [36, "text-2xl"],
};

export const fontSizePtMap: Record<FontSizePt, [FontSize, string]> = {
  18: ["Small", "text-sm"],
  24: ["Default", "text-base"],
  30: ["Large", "text-xl"],
  36: ["Giant", "text-2xl"],
};
