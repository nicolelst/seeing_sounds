import { ReactElement, useCallback } from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Accordion } from "@/shadcn/components/ui/accordion";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Switch } from "@/shadcn/components/ui/switch";
import { VideoFormInputs } from "@/types/videoFormInputs";
import CaptionColourInputs from "./captionColourInputs";
import FontSizeSlider from "./fontSizeSlider";
import InterfaceSelector from "./interfaceSelector";
import SettingsAccordionItem from "./settingsAccordionItem";
import SettingItem from "./settingItem";
import {
  fontSizeFormatMap,
  fontSizePtMap,
} from "@/constants/fontSizeFormatMap";

interface SettingsStageProps {
  register: UseFormRegister<VideoFormInputs>;
  getValues: UseFormGetValues<VideoFormInputs>;
  setValue: UseFormSetValue<VideoFormInputs>;
  watch: UseFormWatch<VideoFormInputs>;
  errors: FieldErrors<VideoFormInputs>;
}

export function SettingsStage({
  // register,
  getValues,
  setValue,
  watch,
  errors,
}: SettingsStageProps): ReactElement {
  const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

  return (
    <div className="flex flex-col w-full h-full">
      {/* TODO validation + error messages */}
      {/* <input {...register("exampleRequired", { required: true })} />
				{errors.exampleRequired && <span>This field is required</span>} */}
      <Accordion
        type="single"
        collapsible
        defaultValue="video"
        className="w-full h-full max-w-2xl mx-auto"
      >
        <SettingsAccordionItem value="video" header="Video annotation settings">
          <div className="flex flex-col gap-4">
            <SettingItem
              label="Select captioning interface"
              description="How should captions be displayed?"
              error={errors.annotationType}
              // TODO info button for interface preview/explanation
            >
              <InterfaceSelector
                value={getValues("annotationType")}
                updateValue={(newValue) => setValue("annotationType", newValue)}
              />
            </SettingItem>
            <SettingItem
              label="Font size"
              description="How large should captions be?"
              error={errors.fontSize}
            >
              <FontSizeSlider
                value={fontSizePtMap[watch("fontSize")][0]}
                updateValue={(newValue) =>
                  setValue("fontSize", fontSizeFormatMap[newValue][0])
                }
              />
            </SettingItem>
            <SettingItem
              label="Caption text colour"
              description="What colour should caption text be?"
              error={errors.captionTextColour}
            >
              <div className="flex items-center space-x-2">
                <Switch
                  checked={getValues("captionTextColour") == "black"}
                  onCheckedChange={(newValue) =>
                    setValue("captionTextColour", newValue ? "black" : "white")
                  }
                />
                <p>{capitalize(watch("captionTextColour"))}</p>
              </div>
            </SettingItem>
            <SettingItem
              label="Speaker colours"
              description="Click to select colours for each speaker."
              error={errors.speakerColours}
            >
              <CaptionColourInputs
                getValue={(idx) => {
                  return getValues(`speakerColours.${idx}`);
                }}
                updateValue={useCallback(
                  (newValue, idx) =>
                    setValue(`speakerColours.${idx}`, newValue),
                  [setValue]
                )}
                numSpeakers={getValues("numSpeakers")}
                captionTextColour={getValues("captionTextColour")}
              />
            </SettingItem>
          </div>
        </SettingsAccordionItem>
        <SettingsAccordionItem
          value="speechSep"
          header="Speech separation model parameters"
        >
          <div className="flex flex-col gap-4">
            <SettingItem
              label="Setting"
              description="desc"
              error={undefined}
              // errors.numSpeakers
            >
              <Input
              // {...register("numSpeakers", {
              // 	required: true,
              // })}
              />
            </SettingItem>
          </div>
        </SettingsAccordionItem>
        <SettingsAccordionItem
          value="speechRec"
          header="Speech recognition model parameters"
        >
          <div className="flex flex-col gap-4">
            <SettingItem
              label="Setting"
              description="desc"
              error={undefined}
              // errors.numSpeakers
            >
              <Input
              // {...register("numSpeakers", {
              // 	required: true,
              // })}
              />
            </SettingItem>
          </div>
        </SettingsAccordionItem>
      </Accordion>
      <Button className="w-fit my-3 self-end" type="submit">
        Next
      </Button>
    </div>
  );
}
