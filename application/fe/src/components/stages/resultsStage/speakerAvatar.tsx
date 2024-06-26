import { ReactElement } from "react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shadcn/components/ui/avatar";

interface SpeakerAvatarProps {
  colour: string;
  img?: string;
  id: number;
  className?: string;
}

export default function SpeakerAvatar({
  className,
  colour,
  img,
  id,
}: SpeakerAvatarProps): ReactElement {
  return (
    <Avatar
      className={`h-20 w-20 border-solid border-4 ${className}`}
      style={{ borderColor: colour }}
    >
      {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
      <AvatarImage src={img} />
      <AvatarFallback
        style={{ backgroundColor: colour }}
        className="text-white text-xl"
      >
        {id}
      </AvatarFallback>
    </Avatar>
  );
}
