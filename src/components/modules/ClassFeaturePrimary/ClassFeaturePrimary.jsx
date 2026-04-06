import styles from './ClassFeaturePrimary.module.css'

export default function ClassFeaturePrimary({ preset, templateId }) {
  const feature = preset?.modules?.classFeaturePrimary

  return (
    <section className={`module-box ${styles.feature} ${templateId ? (styles[templateId] || '') : ''}`}>
      <h3 className="section-header">Class Feature (Primary)</h3>
      <div className={styles.content}>
        <p className={styles.title}>{feature?.title ?? 'Primary Feature'}</p>
        <p className={styles.description}>{feature?.description ?? 'Select a class to populate this feature.'}</p>
      </div>
      {/* Usage tracking — hidden by default, shown in modern */}
      <div className={styles.usageTracker}>
        <div className={styles.usageHeader}>
          <span className={styles.usageCol}>Used</span>
          <span className={styles.usageCol}>DMG</span>
          <span className={styles.usageCol}>Total</span>
        </div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={styles.usageRow}>
            <span className="pen-checkbox">○</span>
            <span className="write-line" />
            <span className="write-line" />
          </div>
        ))}
      </div>
      <div className={styles.notes}>
        <span className="write-line" />
      </div>
    </section>
  )
}
