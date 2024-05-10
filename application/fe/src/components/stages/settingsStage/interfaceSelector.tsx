import { ReactElement } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/shadcn/components/ui/select";
import { AnnotationType } from "@/types/videoFormInputs";
import { annotationTypeMap } from "@/constants/annotationTypeMap";

interface InterfaceSelectorProps {
  disabled?: boolean;
  value?: AnnotationType;
  updateValue: (newValue: AnnotationType) => void;
}

export default function InterfaceSelector({
  disabled,
  value = "floating",
  updateValue,
}: InterfaceSelectorProps): ReactElement {
  return (
    <Select
      disabled={disabled ?? false}
      defaultValue={value}
      onValueChange={(newValue) => updateValue(newValue as AnnotationType)}
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
