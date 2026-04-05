import styles from './RaceClassInfo.module.css'

export default function RaceClassInfo({ preset, templateId }) {
  return (
    <section className={`module-box ${styles.raceClass} ${templateId ? (styles[templateId] || '') : ''}`}>
      <h3 className="section-header">Race, Class &amp; Experience</h3>
      <div className={styles.fields}>
        <fieldset className={styles.field}>
          <label className={styles.label}>Race</label>
          <input type="text" defaultValue={preset?.race ?? ''} placeholder="Race" />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Class</label>
          <input type="text" defaultValue={preset?.class ?? ''} placeholder="Class" />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Subclass</label>
          <input type="text" placeholder="Subclass" />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Level</label>
          <input type="text" placeholder="1" />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Experience</label>
          <input type="text" placeholder="0 XP" />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Proficiency Bonus</label>
          <input type="text" placeholder="+2" />
        </fieldset>
      </div>
    </section>
  )
}
