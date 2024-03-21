import { ColorResult } from "react-color";

export type RGBString = `rgb(${number},${number},${number})`;

export function getRGBstring(col: ColorResult): RGBString {
	return `rgb(${col.rgb.r},${col.rgb.g},${col.rgb.b})`;
}

export const DEFAULT_HEX_10: Array<string> = [
	"#E05454",
	"#F87878",
	"#E070DB",
	"#9D65C8",
	"#8177EA",
	"#4D74AE",
	"#65B8C4",
	"#539F67",
	"#64BF73",
	"#A27A4D",
];
export const DEFAULT_RGB_10: Array<RGBString> = [
	"rgb(224,84,84)",
	"rgb(248,120,120)",
	"rgb(224,112,219)",
	"rgb(157,101,200)",
	"rgb(129,119,234)",
	"rgb(77,116,174)",
	"rgb(101,184,196)",
	"rgb(83,159,103)",
	"rgb(100,191,115)",
	"rgb(162,122,77)",
];
