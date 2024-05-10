import { FontSize, FontSizePt } from "@/types/videoFormInputs";

export const fontSizeFormatMap: Record<FontSize, [FontSizePt, string]> = {
  Small: [24, "text-sm"],
  Default: [32, "text-base"],
  Large: [40, "text-xl"],
  Giant: [48, "text-2xl"],
};

export const fontSizePtMap: Record<FontSizePt, [FontSize, string]> = {
  24: ["Small", "text-sm"],
  32: ["Default", "text-base"],
  40: ["Large", "text-xl"],
  48: ["Giant", "text-2xl"],
};
