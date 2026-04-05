import styles from './HPTracker.module.css'

export default function HPTracker() {
  return (
    <section className={`module-box ${styles.hpTracker}`}>
      <h3 className="section-header">Hit Points</h3>
      <div className={styles.orb}>
        <div className={styles.orbInner}>
          <span className={styles.orbLabel}>Current HP</span>
          <input type="text" className={styles.hpInput} placeholder="—" aria-label="Current HP" />
          <span className={styles.divider}>/ </span>
          <input type="text" className={styles.maxInput} placeholder="Max" aria-label="Max HP" />
        </div>
      </div>
      <div className={styles.tempHp}>
        <label className={styles.tempLabel}>Temporary HP</label>
        <input type="text" placeholder="0" aria-label="Temporary HP" />
      </div>
      <div className={styles.deathSaves}>
        <span className={styles.saveLabel}>Death Saves</span>
        <div className={styles.saveRow}>
          <span className={styles.saveType}>Successes</span>
          <div className={styles.bubbles}>
            {[1, 2, 3].map((i) => (
              <input key={i} type="checkbox" className={styles.bubble} aria-label={`Success ${i}`} />
            ))}
          </div>
        </div>
        <div className={styles.saveRow}>
          <span className={styles.saveType}>Failures</span>
          <div className={styles.bubbles}>
            {[1, 2, 3].map((i) => (
              <input key={i} type="checkbox" className={styles.bubble} aria-label={`Failure ${i}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
