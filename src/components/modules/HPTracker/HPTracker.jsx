import styles from './HPTracker.module.css'

export default function HPTracker({ templateId }) {
  return (
    <section className={`module-box ${styles.hpTracker} ${templateId ? (styles[templateId] || '') : ''}`}>
      <h3 className="section-header">Hit Points</h3>

      {/* Ring layout: 3 circles (maxHP — mainHP — tempHP) with connectors */}
      <div className={styles.ringLayout}>
        {/* Max HP satellite — hidden by default, shown in modern */}
        <div className={styles.maxHpRing}>
          <span className={styles.satelliteLabel}>Max HP</span>
          <span className={styles.satelliteInput} aria-label="Max HP (ring)" />
        </div>

        {/* Connector line — hidden by default */}
        <div className={styles.connector} />

        {/* Main HP orb */}
        <div className={styles.orb}>
          <div className={styles.orbInner}>
            <span className={styles.orbLabel}>Current HP</span>
            <span className={styles.hpInput} aria-label="Current HP" />
            {/* Inline max HP — shown by default, hidden in modern */}
            <span className={styles.inlineMax}>
              <span className={styles.divider}>/ </span>
              <span className={styles.maxInput} aria-label="Max HP" />
            </span>
          </div>
        </div>

        {/* Connector line — hidden by default */}
        <div className={styles.connector} />

        {/* Temp HP satellite — hidden by default, shown in modern */}
        <div className={styles.tempHpRing}>
          <span className={styles.satelliteLabel}>Temp HP</span>
          <span className={styles.satelliteInput} aria-label="Temp HP (ring)" />
        </div>
      </div>

      {/* Hit Dice row — hidden by default, shown in modern */}
      <div className={styles.hitDiceRow}>
        <span className={styles.hitDiceLabel}>Hit Dice</span>
        <span className="write-line" aria-label="Hit Dice" />
      </div>

      {/* Inline temp HP — shown by default, hidden in modern */}
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
