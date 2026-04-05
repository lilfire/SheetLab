import styles from './Proficiency.module.css'

export default function Proficiency({ templateId }) {
  return (
    <section className={`module-box ${styles.proficiency} ${templateId ? (styles[templateId] || '') : ''}`}>
      <h3 className="section-header">Proficiencies</h3>
      <div className={styles.grid}>
        <fieldset className={styles.group}>
          <legend className={styles.groupLabel}>Armour</legend>
          <span className="write-line" />
        </fieldset>
        <fieldset className={styles.group}>
          <legend className={styles.groupLabel}>Weapons</legend>
          <span className="write-line" />
        </fieldset>
        <fieldset className={styles.group}>
          <legend className={styles.groupLabel}>Tools</legend>
          <span className="write-line" />
        </fieldset>
        <fieldset className={styles.group}>
          <legend className={styles.groupLabel}>Languages</legend>
          <span className="write-line" />
        </fieldset>
      </div>
    </section>
  )
}
