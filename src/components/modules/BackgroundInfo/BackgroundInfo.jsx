import styles from './BackgroundInfo.module.css'

export default function BackgroundInfo({ templateId }) {
  return (
    <section className={`module-box ${styles.background} ${templateId ? (styles[templateId] || '') : ''}`}>
      <h3 className="section-header">Background &amp; Personality</h3>
      <div className={styles.grid}>
        <fieldset className={styles.field}>
          <label className={styles.label}>Background</label>
          <input type="text" placeholder="e.g. Soldier, Sage..." />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Alignment</label>
          <input type="text" placeholder="e.g. Neutral Good..." />
        </fieldset>
        <fieldset className={`${styles.field} ${styles.wide}`}>
          <label className={styles.label}>Personality Traits</label>
          <input type="text" placeholder="Personality traits..." />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Ideals</label>
          <input type="text" placeholder="Ideals..." />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Bonds</label>
          <input type="text" placeholder="Bonds..." />
        </fieldset>
        <fieldset className={`${styles.field} ${styles.wide}`}>
          <label className={styles.label}>Flaws</label>
          <input type="text" placeholder="Flaws..." />
        </fieldset>
      </div>
    </section>
  )
}
