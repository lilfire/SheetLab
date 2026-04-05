import classes from '../../data/classes.js'
import styles from './StepClass.module.css'

export default function StepClass({ race, onSelect, onBack }) {
  return (
    <div className={styles.step}>
      <h2 className={styles.heading}>Choose Your Class</h2>
      <p className={styles.hint}>
        Playing as <strong>{race}</strong>. Select a class for your character.
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
      <button className={styles.backBtn} onClick={onBack} type="button">
        ← Back
      </button>
    </div>
  )
}
