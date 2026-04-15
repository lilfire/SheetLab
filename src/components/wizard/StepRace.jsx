import races from '../../data/races.js'
import styles from './StepRace.module.css'

export default function StepRace({ onSelect, onSkip }) {
  return (
    <div className={styles.step}>
      <h2 className={styles.heading}>Choose Your Race</h2>
      <p className={styles.hint}>Your race determines racial traits on the character sheet.</p>
      <div className={styles.grid}>
        {races.map((race) => (
          <button
            key={race}
            className={styles.card}
            onClick={() => onSelect(race)}
            type="button"
          >
            <span className={styles.raceName}>{race}</span>
          </button>
        ))}
      </div>
      <button className={styles.skipBtn} onClick={onSkip} type="button">
        Skip Race &amp; Class →
      </button>
    </div>
  )
}
