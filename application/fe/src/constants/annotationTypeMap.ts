import { AnnotationType } from "@/types/videoFormInputs";

export const annotationTypeMap: Record<AnnotationType, string> = {
  floating: "Floating captions (default)",
  colour: "Static captions coloured by speaker",
  pointer: "Static captions with pointers",
  traditional: "Traditional static captions",
};
