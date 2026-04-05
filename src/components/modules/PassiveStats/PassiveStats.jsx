import styles from './PassiveStats.module.css'

export default function PassiveStats() {
  return (
    <section className={`module-box ${styles.passive}`}>
      <h3 className="section-header">Passive Stats</h3>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.label}>Passive Perception</span>
          <span className={styles.value} />
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Passive Investigation</span>
          <span className={styles.value} />
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Passive Insight</span>
          <span className={styles.value} />
        </div>
      </div>
    </section>
  )
}
