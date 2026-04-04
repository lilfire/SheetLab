import styles from './PassiveStats.module.css'

export default function PassiveStats() {
  return (
    <section className={`module-box ${styles.passive}`}>
      <h3 className="section-header">Passive Stats</h3>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.label}>Passive Perception</span>
          <input type="text" className={styles.value} placeholder="10" />
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Passive Investigation</span>
          <input type="text" className={styles.value} placeholder="10" />
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Passive Insight</span>
          <input type="text" className={styles.value} placeholder="10" />
        </div>
      </div>
    </section>
  )
}
