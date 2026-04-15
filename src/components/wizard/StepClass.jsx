import classes from '../../data/classes.js'
import styles from './StepClass.module.css'

export default function StepClass({ race, onSelect, onSkip, onBack }) {
  return (
    <div className={styles.step}>
      <h2 className={styles.heading}>Choose Your Class</h2>
      <p className={styles.hint}>
        {race
          ? <>Playing as <strong>{race}</strong>. Select a class for your character.</>
          : 'Select a class for your character.'}
      </p>
      <div className={styles.grid}>
        {classes.map((cls) => (
          <button
            key={cls}
            className={styles.card}
            onClick={() => onSelect(cls)}
            type="button"
          >
            <span className={styles.className}>{cls}</span>
          </button>
        ))}
      </div>
      <div className={styles.navRow}>
        <button className={styles.backBtn} onClick={onBack} type="button">
          ← Back
        </button>
        <button className={styles.skipBtn} onClick={onSkip} type="button">
          Skip Class →
        </button>
      </div>
    </div>
  )
}
