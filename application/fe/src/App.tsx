import { useState } from "react";
import { Header, Footer, ProgressBar } from "./components/layout";
import {
  UploadStage,
  SettingsStage,
  ResultsStage,
  InvalidStage,
} from "./components/stages";
import { useForm, SubmitHandler } from "react-hook-form";
import { VideoFormInputs } from "./types/videoFormInputs";
import { UPLOAD_VIDEO_URL } from "./constants/routes";
import { fontSizeFormatMap } from "./constants/fontSizeFormatMap";

function App() {
  const [formStageNum, setFormStageNum] = useState(1);
  const [videoFilepath, setVideoFilepath] = useState<string>("");
  const [requestID, setRequestID] = useState<string>();
  const formStageNames = ["Upload video", "Adjust settings", "Done!"];

  function nextStage() {
    setFormStageNum((formStageNum % formStageNames.length) + 1);
  }

  function resetForm() {
    reset(undefined, { keepDefaultValues: true });
    setVideoFilepath("");
  }

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    resetField,
    getValues,
    watch,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<VideoFormInputs>({
    defaultValues: {
      // video settings
      annotationType: "floating",
      fontSize: fontSizeFormatMap.Default[0],
      captionTextColour: "white",
      // speech sep settings
      hopLength: 2.55,
      numIdentityFrames: 1,
      visualFeatures: "both",
      // speech rec settings
      speechRecModel: "small",
      englishOnly: false,
    },
  });

  const onSubmit: SubmitHandler<VideoFormInputs> = async (
    data: VideoFormInputs
  ) => {
    const queryParams = {
      text_colour: data.captionTextColour,
      font_size: data.fontSize,
      annotation_type: data.annotationType,
      num_speakers: data.numSpeakers,
      colour_list_str: data.speakerColours.join(";"),
      hop_length: data.hopLength,
      num_ident_frames: data.numIdentityFrames,
      visual_feat: data.visualFeatures,
      model_size: data.speechRecModel,
      eng_only: data.englishOnly,
    };
    const paramStr = Object.entries(queryParams)
      .map((param) => `${param[0]}=${encodeURIComponent(param[1])}`)
      .join("&");
    const queryURL = `${UPLOAD_VIDEO_URL}?${paramStr}`;

    console.log("POST", queryURL);
    console.log("settings:", getValues());

    const formData = new FormData();
    formData.append("video", data.videoInput[0]);

    const response = await fetch(queryURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    console.log("POST VIDEO REQUEST:", response.status, response.statusText);
    const result = await response.json();

    if (response.ok) {
      console.log("REQUEST ID:", result.request_id);
      setRequestID(result.request_id);
      nextStage();
    } else {
      console.log(result);
      // TODO trigger a pop up
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex flex-col h-full pt-12 space-y-2 mx-32 max-w-7xl">
        <Header />
        <ProgressBar
          formStageNames={formStageNames}
          formStageNum={formStageNum}
          setFormStageNum={setFormStageNum}
        />
        <div className="flex-1 h-full">
          {formStageNum <= 2 ? (
            <form onSubmit={handleSubmit(onSubmit)} className="h-full w-full">
              {formStageNum === 1 ? (
                <UploadStage
                  videoFilepath={videoFilepath}
                  setVideoFilepath={setVideoFilepath}
                  register={register}
                  watch={watch}
                  getValues={getValues}
                  setValue={setValue}
                  resetField={resetField}
                  trigger={trigger}
                  errors={errors}
                  setError={setError}
                  clearErrors={clearErrors}
                  nextStage={nextStage}
                />
              ) : formStageNum === 2 ? (
                <SettingsStage
                  // handleNext={handleSubmit(onSubmit)}
                  register={register}
                  getValues={getValues}
                  setValue={setValue}
                  watch={watch}
                  errors={errors}
                />
              ) : (
                <InvalidStage />
              )}
            </form>
          ) : formStageNum === 3 ? (
            <ResultsStage
              requestID={requestID ?? ""}
              getValues={getValues}
              nextStage={nextStage}
              resetForm={resetForm}
            />
          ) : (
            <InvalidStage />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
