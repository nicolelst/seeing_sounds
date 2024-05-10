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
import { VideoFormInputs, whisperModelNameList } from "@/types/videoFormInputs";
import CaptionColourInputs from "./captionColourInputs";
import FontSizeSlider from "./fontSizeSlider";
import InterfaceSelector from "./interfaceSelector";
import SettingsAccordionItem from "./settingsAccordionItem";
import SettingItem from "./settingItem";
import {
  fontSizeFormatMap,
  fontSizePtMap,
} from "@/constants/fontSizeFormatMap";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import { visualFeatureMap } from "@/constants/visualFeatureMap";

interface SettingsStageProps {
  register: UseFormRegister<VideoFormInputs>;
  getValues: UseFormGetValues<VideoFormInputs>;
  setValue: UseFormSetValue<VideoFormInputs>;
  watch: UseFormWatch<VideoFormInputs>;
  errors: FieldErrors<VideoFormInputs>;
}

export function SettingsStage({
  register,
  getValues,
  setValue,
  watch,
  errors,
}: SettingsStageProps): ReactElement {
  const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

  return (
    <div className="flex flex-col w-full h-full">
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
              // TODO add interface type preview/explanation
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
              label="VisualVoice visual input type"
              description="Type of visual features used by VisualVoice's implementation of UNet for speech separation"
              error={errors.visualFeatures}
            >
              <Select
                defaultValue={getValues("visualFeatures")}
                onValueChange={(newValue) =>
                  setValue("visualFeatures", newValue)
                }
              >
                <SelectTrigger type="button">
                  <SelectValue placeholder="Select a visual input type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(visualFeatureMap).map((featType) => (
                      <SelectItem key={featType[0]} value={featType[0]}>
                        {featType[1]}
                        {featType[0] == "both" ? " (default)" : ""}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </SettingItem>
            <SettingItem
              label="Number of identity frames"
              description="Number of frames to select as input to facial attributes model for each speaker (min: 1, max: 10)"
              error={errors.numIdentityFrames}
            >
              <Input
                type="number"
                {...register("numIdentityFrames", {
                  required: true,
                  setValueAs: (v) => parseInt(v),
                  onChange: (e) => {
                    if (!e.target.value) {
                      setValue("numIdentityFrames", 1);
                    } else {
                      const cleanValue = parseInt(
                        e.target.value
                          .replace(/[^0-9]/g, "") // prevent non digits
                          .slice(0, 2) // prevent >2 digits
                      );
                      setValue(
                        "numIdentityFrames",
                        cleanValue >= 10 ? 10 : cleanValue < 1 ? 1 : cleanValue
                      );
                    }
                  },
                  validate: {
                    notNan: (v) => !Number.isNaN(v),
                    notDecimal: (v) => Number.isInteger(v),
                    minCheck: (v) => v >= 1,
                    maxCheck: (v) => v <= 10,
                  },
                })}
              />
            </SettingItem>
            <SettingItem
              label="Sliding window hop length"
              description="Hop length to perform audio separation in a sliding window approach (min: 0.04)"
              error={errors.hopLength}
            >
              <Input
                {...register("hopLength", {
                  required: true,
                  setValueAs: (v) => parseFloat(v),
                  onChange: (e) => {
                    if (!e.target.value) {
                      setValue("hopLength", 0.04);
                    } else {
                      const cleanValue = parseFloat(
                        e.target.value.replace(/[^0-9.]/g, "") // prevent non digits or decimals
                      );
                      setValue(
                        "hopLength",
                        cleanValue >= 0.04 ? cleanValue : 0.04
                      );
                    }
                  },
                  validate: {
                    notNan: (v) => !Number.isNaN(v),
                    minCheck: (v) => v >= 0.04,
                  },
                })}
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
              label="OpenAI Whisper model"
              description={
                <div className="text-wrap">
                  see{" "}
                  <a
                    className="underline text-sky-300 hover:text-sky-500"
                    href="https://github.com/openai/whisper/blob/main/model-card.md"
                  >
                    model card
                  </a>{" "}
                  for params and performance
                </div>
              }
              error={errors.speechRecModel}
            >
              <Select
                defaultValue={getValues("speechRecModel")}
                onValueChange={(newValue) => {
                  setValue("speechRecModel", newValue);
                  if (newValue == "large") {
                    setValue("englishOnly", false);
                  }
                }}
              >
                <SelectTrigger type="button">
                  <SelectValue placeholder="Select a speech recognition model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {whisperModelNameList.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                        {model == "small" ? " (default)" : ""}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </SettingItem>
            <SettingItem
              label="Use English only model"
              description="Not available for large model. English-only models tend to perform better for tiny and base models."
              error={errors.captionTextColour}
            >
              <Switch
                disabled={watch("speechRecModel") == "large"}
                checked={watch("englishOnly")}
                onCheckedChange={(newValue) =>
                  setValue("englishOnly", newValue)
                }
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
