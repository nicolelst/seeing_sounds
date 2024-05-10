import { ReactElement } from "react";
import {
  FileTextIcon,
  GitHubLogoIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";

type linkType = "Report" | "Code" | "About";
const iconSizes = ["sm", "lg"];
type IconSize = (typeof iconSizes)[number];
const iconClassNameMap: Record<IconSize, string> = {
  sm: "mr-1.5 h-4 w-4",
  lg: "mr-2 h-6 w-6",
};
export type LinkInfo = {
  desc: string;
  icon: (size: IconSize) => ReactElement;
  link: string;
};

const linkInfoMap: Record<linkType, LinkInfo> = {
  Report: {
    desc: "Read the final report",
    icon: (size: IconSize) => (
      <FileTextIcon className={iconClassNameMap[size]} />
    ),
    link: "https://hdl.handle.net/10356/175150",
  },
  Code: {
    desc: "View the code on Github",
    icon: (size: IconSize) => (
      <GitHubLogoIcon className={iconClassNameMap[size]} />
    ),
    link: "https://github.com/nicolelst/seeing_sounds",
  },
  About: {
    desc: "More about this FYP",
    icon: (size: IconSize) => (
      <InfoCircledIcon className={iconClassNameMap[size]} />
    ),
    link: "https://github.com/nicolelst/seeing_sounds/?tab=readme-ov-file#readme",
  },
};

export { linkInfoMap };
