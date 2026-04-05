import styles from './Equipment.module.css'

export default function Equipment({ templateId }) {
  return (
    <section className={`module-box ${styles.equipment} ${templateId ? (styles[templateId] || '') : ''}`}>
      <h3 className="section-header">Equipment</h3>
      <div className={styles.capacity}>
        <span className={styles.capacityLabel}>Carrying Capacity:</span>
        <span className={styles.capacityValue} />
        <span className={styles.unit}>lbs</span>
      </div>
      <div className={styles.list}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={styles.item}>
            <span className="write-line" />
          </div>
        ))}
      </div>
    </section>
  )
}
