import { useState } from "react";
import { Header, Footer, ProgressBar } from "./components/layout";
import {
  UploadStage,
  SettingsStage,
  ResultsStage,
  InvalidStage,
} from "./components/stages";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInputs } from "./types/formInputs";
import { UPLOAD_VIDEO_URL } from "./routes";

function App() {
  const [formStageNum, setFormStageNum] = useState(1);
  const [videoFilepath, setVideoFilepath] = useState<string>("");
  // TODO num stages & names should be calculated from a list of components
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
  } = useForm<FormInputs>({
    defaultValues: {
      annotationType: "floating",
      fontSize: 24,
      captionBlackText: false,
    },
  });
  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    // TODO add other settings to queryURL
    const queryURL = `${UPLOAD_VIDEO_URL}?annotation_type=${encodeURIComponent(
      data.annotationType
    )}&num_speakers=${encodeURIComponent(
      data.numSpeakers
    )}&colour_list_str=${encodeURIComponent(data.speakerColours.join(";"))}`;

    console.log("POST", queryURL);

    const formData = new FormData();
    formData.append("video", data.videoInput[0]);

    const response = await fetch(queryURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    console.log(response.status, response.statusText);
    const result = await response.json();

    if (response.ok) {
			// TODO creat websocket
      console.log("REQUEST ID:", result.request_id);
      nextStage();
    } else {
      console.log(result);
      // TODO trigger a pop up
    }
  };

  return (
    // TODO: items-center dynamic sizes
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col w-screen h-screen">
        <div className="flex flex-col h-full pt-12 space-y-2 mx-32 max-w-7xl">
          <Header />
          <ProgressBar
            formStageNames={formStageNames}
            formStageNum={formStageNum}
            setFormStageNum={setFormStageNum}
          />
          <div className="flex-1">
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
                handleNext={handleSubmit(onSubmit)}
                register={register}
                getValues={getValues}
                setValue={setValue}
                watch={watch}
                errors={errors}
              />
            ) : formStageNum === 3 ? (
              <ResultsStage
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
    </form>
  );
}

export default App;
