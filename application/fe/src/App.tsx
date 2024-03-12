import { useState } from 'react'
import Header from './components/layout/header'
import ProgressBar from './components/layout/progressBar'
import Footer from './components/layout/footer'
import UploadStage from './components/stages/uploadStage'
import SettingsStage from './components/stages/settingsStage'
import ResultsStage from './components/stages/resultsStage'
import InvalidStage from './components/stages/invalidStage'
import { Button } from './shadcn/components/ui/button'

function App() {
  const [formStageNum, setFormStageNum] = useState(1);
  // TODO num stages & names should be calculated from a list of components 
  const formStageNames = ["Upload video", "Adjust settings", "Done!"];

  function nextStage() {
		setFormStageNum((formStageNum % formStageNames.length) + 1);
	}

  return (
    // TODO: items-center dynamic sizes
    <div className="flex flex-col w-screen h-screen">
      <div className="flex flex-col h-full pt-8 mx-32 max-w-7xl">
        <Header/>
        <ProgressBar formStageNames={formStageNames} formStageNum={formStageNum} setFormStageNum={setFormStageNum}/>
        <div className="flex-1 bg-slate-300">
          {
            (formStageNum === 1) ? <UploadStage/> :
            (formStageNum === 2) ? <SettingsStage/> : 
            (formStageNum === 3) ? <ResultsStage/> : 
            <InvalidStage/>
          }
        </div>
        <Button className="w-fit text-xs my-2 self-end" onClick={nextStage}>
          NEXT
        </Button>
      </div>
      <Footer/>
    </div>
  )
}

export default App
