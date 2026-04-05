import styles from './BackgroundInfo.module.css'

export default function BackgroundInfo({ templateId }) {
  return (
    <section className={`module-box ${styles.background} ${templateId ? (styles[templateId] || '') : ''}`}>
      <h3 className="section-header">Background &amp; Personality</h3>
      <div className={styles.grid}>
        <fieldset className={styles.field}>
          <label className={styles.label}>Background</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Alignment</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className={`${styles.field} ${styles.wide}`}>
          <label className={styles.label}>Personality Traits</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Ideals</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Bonds</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className={`${styles.field} ${styles.wide}`}>
          <label className={styles.label}>Flaws</label>
          <span className="write-line" />
        </fieldset>
      </div>
    </section>
  )
}
