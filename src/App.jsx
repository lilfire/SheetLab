import { useState } from 'react'
import Wizard from './components/wizard/Wizard.jsx'
import SheetPreview from './components/sheet/SheetPreview.jsx'
import { getTemplate } from './templates/index.js'

export default function App() {
  const [sheetData, setSheetData] = useState(null)
  const [layoutConfig, setLayoutConfig] = useState(null)

  function handleWizardComplete(data) {
    const tpl = getTemplate(data.template)
    setLayoutConfig(tpl.defaultLayoutConfig)
    setSheetData(data)
  }

  function handleReset() {
    setSheetData(null)
    setLayoutConfig(null)
  }

  if (sheetData) {
    return (
      <SheetPreview
        character={sheetData.character}
        preset={sheetData.preset}
        template={sheetData.template}
        templateSettings={sheetData.templateSettings}
        layoutConfig={layoutConfig}
        setLayoutConfig={setLayoutConfig}
        onReset={handleReset}
      />
    )
  }

  return <Wizard onComplete={handleWizardComplete} />
}
