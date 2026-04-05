import styles from './ClassFeatureSecondary.module.css'

export default function ClassFeatureSecondary({ preset }) {
  const feature = preset?.modules?.classFeatureSecondary

  return (
    <section className={`module-box ${styles.feature}`}>
      <h3 className="section-header">Class Feature (Secondary)</h3>
      <div className={styles.content}>
        <p className={styles.title}>{feature?.title ?? 'Secondary Feature'}</p>
        <p className={styles.description}>{feature?.description ?? 'Select a class to populate this feature.'}</p>
      </div>
      <div className={styles.notes}>
        <span className="write-line" />
      </div>
    </section>
  )
}
