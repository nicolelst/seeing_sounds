export type annotationType = "floating" | "colour" | "pointer" | "traditional";

export const annotationTypeMap: Record<annotationType, string> = {
	floating: "Floating captions (default)",
	colour: "Static captions coloured by speaker",
	pointer: "Static captions with pointers",
	traditional: "Traditional static captions",
};
