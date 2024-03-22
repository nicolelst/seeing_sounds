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

function App() {
	const [formStageNum, setFormStageNum] = useState(1);
	const [videoFilepath, setVideoFilepath] = useState<string>("");
	// TODO num stages & names should be calculated from a list of components
	const formStageNames = ["Upload video", "Adjust settings", "Done!"];

	function nextStage() {
		setFormStageNum((formStageNum % formStageNames.length) + 1);
	}

	const {
		register,
		handleSubmit,
		setValue,
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
	const onSubmit: SubmitHandler<FormInputs> = (data) => {
		console.log(data);
		nextStage();
	};

	return (
		// TODO: items-center dynamic sizes
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-col w-screen h-screen">
				<div className="flex flex-col h-full pt-8 space-y-2 mx-32 max-w-7xl">
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
								register={register}
								getValues={getValues}
								setValue={setValue}
								watch={watch}
								errors={errors}
							/>
						) : formStageNum === 3 ? (
							<ResultsStage
								// register={register}
								getValues={getValues}
								// errors={errors}
								nextStage={nextStage}
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
