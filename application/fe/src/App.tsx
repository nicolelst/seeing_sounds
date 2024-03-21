import { useState } from "react";
import Header from "./components/layout/header";
import ProgressBar from "./components/layout/progressBar";
import Footer from "./components/layout/footer";
import UploadStage from "./components/stages/uploadStage";
import SettingsStage from "./components/stages/settingsStage";
import ResultsStage from "./components/stages/resultsStage";
import InvalidStage from "./components/stages/invalidStage";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInputs } from "./types/formInputs";

function App() {
	const [formStageNum, setFormStageNum] = useState(1);
	// TODO num stages & names should be calculated from a list of components
	const formStageNames = ["Upload video", "Adjust settings", "Done!"];

	function nextStage() {
		setFormStageNum((formStageNum % formStageNames.length) + 1);
	}

	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		watch,
		trigger,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<FormInputs>({
		defaultValues: {
			numSpeakers: 2,
			annotationType: "floating",
			fontSize: 24,
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
								register={register}
								getValues={getValues}
								setValue={setValue}
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
