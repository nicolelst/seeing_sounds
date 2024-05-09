import { ReactElement } from "react";
import { UseFormSetValue } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/shadcn/components/ui/select";
import { annotationType, annotationTypeMap } from "@/types/annotationType";
import { VideoFormInputs } from "@/types/videoFormInputs";

interface InterfaceSelectorProps {
  disabled?: boolean;
  selectedValue?: annotationType;
  setValue: UseFormSetValue<VideoFormInputs>;
}

export default function InterfaceSelector({
  disabled,
  selectedValue,
  setValue,
}: InterfaceSelectorProps): ReactElement {
  return (
    <Select
      disabled={disabled ?? false}
      defaultValue={selectedValue ?? "floating"}
      onValueChange={(value) =>
        setValue("annotationType", value as annotationType)
      }
    >
      <SelectTrigger type="button">
        <SelectValue placeholder="Select an interface" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(annotationTypeMap).map((anotType) => (
            <SelectItem key={anotType[0]} value={anotType[0]}>
              {anotType[1]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
