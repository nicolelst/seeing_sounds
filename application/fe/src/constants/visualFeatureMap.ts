import { VisualFeatureType } from "@/types/videoFormInputs";

export const visualFeatureMap: Record<VisualFeatureType, string> = {
  both: "Both lip movement and facial attributes",
  lipmotion: "Lip movement only",
  identity: "Facial attributes only",
};
