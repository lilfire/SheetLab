import styles from './CombatStats.module.css'

export default function CombatStats({ templateId }) {
  return (
    <section className={`module-box ${styles.combat} ${templateId ? (styles[templateId] || '') : ''}`}>
      <h3 className="section-header">Combat Stats</h3>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.circle}>
            <input type="text" className={styles.value} placeholder="10" aria-label="Armor Class" />
          </div>
          <span className={styles.label}>Armor Class</span>
        </div>
        <div className={styles.stat}>
          <div className={styles.circle}>
            <input type="text" className={styles.value} placeholder="30" aria-label="Speed" />
          </div>
          <span className={styles.label}>Speed</span>
        </div>
        <div className={styles.stat}>
          <div className={styles.circle}>
            <input type="text" className={styles.value} placeholder="+0" aria-label="Initiative" />
          </div>
          <span className={styles.label}>Initiative</span>
        </div>
        <div className={styles.stat}>
          <div className={styles.circle}>
            <input type="text" className={styles.value} placeholder="+2" aria-label="Proficiency Bonus" />
          </div>
          <span className={styles.label}>Prof. Bonus</span>
        </div>
      </div>
    </section>
  )
}
