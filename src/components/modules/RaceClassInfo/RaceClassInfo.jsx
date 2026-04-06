import styles from './RaceClassInfo.module.css'

export default function RaceClassInfo({ preset, templateId }) {
  return (
    <section className={`module-box ${styles.raceClass} ${templateId ? (styles[templateId] || '') : ''}`}>
      <h3 className="section-header">Race, Class &amp; Experience</h3>
      <div className={styles.fields}>
        <fieldset className={styles.field}>
          <label className={styles.label}>Race</label>
          <span className="write-line">{preset?.race ?? ''}</span>
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Class</label>
          <span className="write-line">{preset?.class ?? ''}</span>
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Subclass</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Level</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Experience</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Proficiency Bonus</label>
          <span className="write-line" />
        </fieldset>
      </div>
      {/* Extra fields — hidden by default, shown in modern */}
      <div className={styles.extraFields}>
        <fieldset className={styles.field}>
          <label className={styles.label}>Background &amp; Alignment</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Character Features</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Character Traits</label>
          <span className="write-line" />
        </fieldset>
      </div>
    </section>
  )
}
