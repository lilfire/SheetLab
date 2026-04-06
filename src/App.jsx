import { useState } from 'react'
import Wizard from './components/wizard/Wizard.jsx'
import SheetPreview from './components/sheet/SheetPreview.jsx'

export default function App() {
  const [sheetData, setSheetData] = useState(null)

  function handleWizardComplete(data) {
    setSheetData(data)
  }

  function handleReset() {
    setSheetData(null)
  }

  if (sheetData) {
    return (
      <SheetPreview
        character={sheetData.character}
        preset={sheetData.preset}
        template={sheetData.template}
        templateSettings={sheetData.templateSettings}
        initialModuleStyles={sheetData.moduleStyles}
        onReset={handleReset}
      />
    )
  }

  return <Wizard onComplete={handleWizardComplete} />
}
