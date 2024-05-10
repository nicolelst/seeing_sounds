import { ReactElement } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/shadcn/components/ui/select";
import { annotationType, annotationTypeMap } from "@/types/annotationType";

interface InterfaceSelectorProps {
  disabled?: boolean;
  value?: annotationType;
  updateValue: (newValue: annotationType) => void;
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
      onValueChange={(newValue) => updateValue(newValue as annotationType)}
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
