import { ReactElement } from "react";
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

interface SettingsStageProps {
  register: UseFormRegister<VideoFormInputs>;
  getValues: UseFormGetValues<VideoFormInputs>;
  setValue: UseFormSetValue<VideoFormInputs>;
  watch: UseFormWatch<VideoFormInputs>;
  errors: FieldErrors<VideoFormInputs>;
}

// TODO: Warning: validateDOMNesting(...): <button> cannot appear as a descendant of <button>.
// for all settings except font slider ???
// type="button": https://github.com/shadcn-ui/ui/issues/2358
// asChild: https://github.com/shadcn-ui/ui/issues/2764

export function SettingsStage({
  // register,
  getValues,
  setValue,
  watch,
}: // errors,
SettingsStageProps): ReactElement {
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
              // description="How should captions be displayed?"
              error={undefined}
              // TODO add error
            >
              {/* TODO info button for interface preview/explanation */}
              {/* TODO register annotationType */}
              {/* TODO enable when options available */}
              {/* TODO change value based on form */}
              <InterfaceSelector
                selectedValue={getValues("annotationType")}
                setValue={setValue}
              />
            </SettingItem>
            <SettingItem
              label="Font size"
              // description="How large should captions be?"
              error={undefined}
              // TODO add error
            >
              <FontSizeSlider
                getValues={getValues}
                setValue={setValue}
                watch={watch}
              />
            </SettingItem>
            <SettingItem
              label="Caption text colour"
              // description="What colour should caption text be?"
              error={undefined}
              // TODO add error
            >
              <div className="flex items-center space-x-2">
                <Switch
                  checked={getValues("captionBlackText")}
                  onCheckedChange={(value) =>
                    setValue("captionBlackText", value)
                  }
                />
                <p>{watch("captionBlackText") ? "Black" : "White"}</p>
              </div>
            </SettingItem>
            <SettingItem
              label="Speaker colours"
              // description="Click to select colours for each speaker."
              error={undefined}
              // TODO add error
            >
              <CaptionColourInputs getValues={getValues} setValue={setValue} />
            </SettingItem>
          </div>
        </SettingsAccordionItem>
        {/* <SettingsAccordionItem
					value="transcript"
					header="Video transcript settings"
				>
					<div className="flex flex-col gap-4">
						<SettingItem
							label="Setting"
							// description="desc"
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
				</SettingsAccordionItem> */}
        <SettingsAccordionItem
          value="speechSep"
          header="Speech separation model parameters"
        >
          <div className="flex flex-col gap-4">
            <SettingItem
              label="Setting"
              // description="desc"
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
              // description="desc"
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
