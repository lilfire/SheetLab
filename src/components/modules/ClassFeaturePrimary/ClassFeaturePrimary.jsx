import styles from './ClassFeaturePrimary.module.css'

export default function ClassFeaturePrimary({ preset }) {
  const feature = preset?.modules?.classFeaturePrimary

  return (
    <section className={`module-box ${styles.feature}`}>
      <h3 className="section-header">Class Feature (Primary)</h3>
      <div className={styles.content}>
        <p className={styles.title}>{feature?.title ?? 'Primary Feature'}</p>
        <p className={styles.description}>{feature?.description ?? 'Select a class to populate this feature.'}</p>
      </div>
      <div className={styles.notes}>
        <input type="text" placeholder="Notes..." />
      </div>
    </section>
  )
}
