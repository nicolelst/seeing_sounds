import { ReactElement } from "react";
import {
  FieldErrors,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormResetField,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Label } from "@/shadcn/components/ui/label";
import {
  UploadIcon,
  CheckCircledIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import {
  VideoFormInputs,
  NUM_SPEAKERS_MAX,
  NUM_SPEAKERS_MIN,
} from "@/types/videoFormInputs";

interface FileDropzoneProps {
  errors: FieldErrors<VideoFormInputs>;
  register: UseFormRegister<VideoFormInputs>;
  getValues: UseFormGetValues<VideoFormInputs>;
  setValue: UseFormSetValue<VideoFormInputs>;
  resetField: UseFormResetField<VideoFormInputs>;
  setError: UseFormSetError<VideoFormInputs>;
  clearErrors: UseFormClearErrors<VideoFormInputs>;
  videoFilepath: string;
  setVideoFilepath: React.Dispatch<React.SetStateAction<string>>;
}

export default function FileDropzone({
  errors,
  register,
  getValues,
  setValue,
  resetField,
  setError,
  clearErrors,
  videoFilepath,
  setVideoFilepath,
}: FileDropzoneProps): ReactElement {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length == 0) {
        setError("videoInput", {
          type: "dropRequired",
          message: "Please upload a video.",
        });
      } else if (acceptedFiles[0].type !== "video/mp4") {
        // TODO add more valid formats
        setError("videoInput", {
          type: "dropType",
          message: "Invalid video format. Please upload another file.",
        });
        resetField("numSpeakers");
      } else {
        clearErrors();
        setValue("videoInput", acceptedFiles as unknown as FileList);
        setVideoFilepath(URL.createObjectURL(acceptedFiles[0]));
      }
    },
  });

  const iconStyle = "h-20 w-20 mb-2";

  const dropzoneContents = {
    default: {
      bgColour: "bg-gray-200",
      text: "Choose a video file or drag it here.",
      icon: <UploadIcon className={iconStyle} />,
    },
    dragging: {
      bgColour: "bg-gray-300",
      text: "Release to select file.",
      icon: <UploadIcon className={iconStyle} />,
    },
    accepted: {
      bgColour: "bg-green-200",
      text: `Your video ${
        getValues("videoInput") ? getValues("videoInput")[0].name : ""
      } has been uploaded successfully.`,
      icon: <CheckCircledIcon className={iconStyle} />,
    },
    error: {
      bgColour: "bg-red-300",
      text:
        errors.videoInput?.message ??
        "There was an unexpected issue. Please try again.",
      icon: <CrossCircledIcon className={iconStyle} />,
    },
  };

  const dropzoneState = isDragActive
    ? "dragging"
    : errors.videoInput
    ? "error"
    : videoFilepath !== ""
    ? "accepted"
    : "default";

  return (
    <div
      {...getRootProps({
        className: `h-full dropzone ${dropzoneContents[dropzoneState].bgColour}`,
      })}
    >
      <input {...getInputProps()} />
      <div className="h-full flex flex-col justify-center items-center text-center text-balance px-4">
        {dropzoneContents[dropzoneState].icon}
        <p className="font-bold">{dropzoneContents[dropzoneState].text}</p>
        {dropzoneState == "accepted" ? (
          <NumSpeakersInput
            errors={errors}
            register={register}
            setValue={setValue}
            getValues={getValues}
          />
        ) : (
          <em>Accepted filetypes: MP4</em>
        )}
      </div>
    </div>
  );
}

interface NumSpeakersInputProps {
  errors: FieldErrors<VideoFormInputs>;
  register: UseFormRegister<VideoFormInputs>;
  setValue: UseFormSetValue<VideoFormInputs>;
  getValues: UseFormGetValues<VideoFormInputs>;
}

function NumSpeakersInput({
  errors,
  register,
  setValue,
  getValues,
}: NumSpeakersInputProps): ReactElement {
  return (
    <div className="flex flex-col my-6">
      <Label
        className={`text-xl font-semibold px-2 ${
          errors.numSpeakers ? "text-red-600" : "text-black"
        }`}
      >
        {errors.numSpeakers
          ? errors.numSpeakers.message
          : "How many speakers are in the video?"}
      </Label>
      <em className="text-sm">
        (minimum: {NUM_SPEAKERS_MIN}, maximum: {NUM_SPEAKERS_MAX})
      </em>
      <div className="flex flex-row items-center space-x-1 mt-2">
        <Button
          variant="outline"
          type="button"
          className={`${
            getValues("numSpeakers") === NUM_SPEAKERS_MIN
              ? "cursor-not-allowed text-slate-400 hover:text-slate-400 bg-slate-100 hover:bg-slate-100"
              : ""
          }`}
          onClick={(e: Event) => {
            e.stopPropagation();
            if (
              getValues("numSpeakers") &&
              getValues("numSpeakers") > NUM_SPEAKERS_MIN
            ) {
              setValue("numSpeakers", getValues("numSpeakers") - 1);
            } else {
              setValue("numSpeakers", NUM_SPEAKERS_MIN);
            }
          }}
        >
          -
        </Button>
        <Input
          onClick={(e) => e.stopPropagation()}
          className={`text-center text-lg ${
            errors.numSpeakers ? "bg-red-200" : "bg-white"
          }`}
          {...register("numSpeakers", {
            required: true,
            pattern: /[0-9]+/,
            maxLength: 2, // 2 digit number
            setValueAs: (v) => parseInt(v),
            onChange: (e) => {
              if (!e.target.value) {
                setValue("numSpeakers", NUM_SPEAKERS_MIN);
              } else {
                const cleanValue = parseInt(
                  e.target.value
                    .replace(/[^0-9]/g, "") // prevent non digits
                    .slice(0, 2) // prevent >2 digits
                );
                setValue(
                  "numSpeakers",
                  cleanValue >= NUM_SPEAKERS_MAX
                    ? NUM_SPEAKERS_MAX // restrict max
                    : cleanValue
                );
              }
            },
            validate: {
              notNan: (v) => !Number.isNaN(v),
              notDecimal: (v) => Number.isInteger(v),
              minCheck: (v) => v >= NUM_SPEAKERS_MIN,
              maxCheck: (v) => v <= NUM_SPEAKERS_MAX,
            },
          })}
        />
        <Button
          variant="outline"
          type="button"
          className={`${
            getValues("numSpeakers") === NUM_SPEAKERS_MAX
              ? "cursor-not-allowed text-slate-400 hover:text-slate-400 bg-slate-100 hover:bg-slate-100"
              : ""
          }`}
          onClick={(e: Event) => {
            e.stopPropagation();
            if (!getValues("numSpeakers")) {
              setValue("numSpeakers", NUM_SPEAKERS_MIN);
            } else if (getValues("numSpeakers") < NUM_SPEAKERS_MAX) {
              setValue("numSpeakers", getValues("numSpeakers") + 1);
            } else {
              setValue("numSpeakers", NUM_SPEAKERS_MAX);
            }
          }}
        >
          +
        </Button>
      </div>
    </div>
  );
}
