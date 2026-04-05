import { resolvePreset } from '../../presets/index.js'
import styles from './StepPreview.module.css'

export default function StepPreview({ race, characterClass, onGenerate, onBack }) {
  const preset = resolvePreset(race, characterClass)

  return (
    <div className={styles.step}>
      <h2 className={styles.heading}>Review Your Character</h2>

      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Race</span>
          <span className={styles.summaryValue}>{race}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Class</span>
          <span className={styles.summaryValue}>{characterClass}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Primary Feature</span>
          <span className={styles.summaryValue}>{preset.modules.classFeaturePrimary.title}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Secondary Feature</span>
          <span className={styles.summaryValue}>{preset.modules.classFeatureSecondary.title}</span>
        </div>
        {preset.raceTraits.length > 0 && (
          <div className={styles.traitsSection}>
            <span className={styles.summaryLabel}>Racial Traits</span>
            <ul className={styles.traitsList}>
              {preset.raceTraits.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.backBtn} onClick={onBack} type="button">
          ← Back
        </button>
        <button className={styles.generateBtn} onClick={onGenerate} type="button">
          Generate Sheet →
        </button>
      </div>
    </div>
  )
}
