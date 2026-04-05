import styles from './HPTracker.module.css'

export default function HPTracker({ templateId }) {
  return (
    <section className={`module-box ${styles.hpTracker} ${templateId ? (styles[templateId] || '') : ''}`}>
      <h3 className="section-header">Hit Points</h3>
      <div className={styles.orb}>
        <div className={styles.orbInner}>
          <span className={styles.orbLabel}>Current HP</span>
          <span className={styles.hpInput} aria-label="Current HP" />
          <span className={styles.divider}>/ </span>
          <span className={styles.maxInput} aria-label="Max HP" />
        </div>
      </div>
      <div className={styles.tempHp}>
        <span className={styles.tempLabel}>Temporary HP</span>
        <span className="write-line" aria-label="Temporary HP" />
      </div>
      <div className={styles.deathSaves}>
        <span className={styles.saveLabel}>Death Saves</span>
        <div className={styles.saveRow}>
          <span className={styles.saveType}>Successes</span>
          <div className={styles.bubbles}>
            {[1, 2, 3].map((i) => (
              <span key={i} className={styles.bubble} aria-label={`Success ${i}`}>○</span>
            ))}
          </div>
        </div>
        <div className={styles.saveRow}>
          <span className={styles.saveType}>Failures</span>
          <div className={styles.bubbles}>
            {[1, 2, 3].map((i) => (
              <span key={i} className={styles.bubble} aria-label={`Failure ${i}`}>○</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
