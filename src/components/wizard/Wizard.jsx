import { useState } from 'react'
import StepRace from './StepRace.jsx'
import StepClass from './StepClass.jsx'
import StepPreview from './StepPreview.jsx'
import { resolvePreset } from '../../presets/index.js'
import styles from './Wizard.module.css'

const STEPS = ['Race', 'Class', 'Preview']

export default function Wizard({ onComplete }) {
  const [step, setStep] = useState(0)
  const [race, setRace] = useState(null)
  const [characterClass, setCharacterClass] = useState(null)

  function handleRaceSelect(selectedRace) {
    setRace(selectedRace)
    setStep(1)
  }

  function handleClassSelect(selectedClass) {
    setCharacterClass(selectedClass)
    setStep(2)
  }

  function handleGenerate() {
    const preset = resolvePreset(race, characterClass)
    onComplete({ character: { name: '', race, class: characterClass }, preset })
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1))
  }

  return (
    <div className={`wizard-container ${styles.wizard}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>SheetLab</h1>
        <p className={styles.subtitle}>RPG Character Sheet Generator</p>
        <nav className={styles.steps} aria-label="Wizard steps">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={`${styles.stepDot} ${i === step ? styles.active : ''} ${i < step ? styles.done : ''}`}
            >
              {label}
            </span>
          ))}
        </nav>
      </header>

      <main className={styles.content}>
        {step === 0 && <StepRace onSelect={handleRaceSelect} />}
        {step === 1 && <StepClass onSelect={handleClassSelect} onBack={handleBack} race={race} />}
        {step === 2 && (
          <StepPreview
            race={race}
            characterClass={characterClass}
            onGenerate={handleGenerate}
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  )
}
