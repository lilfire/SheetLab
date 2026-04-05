import styles from './Proficiency.module.css'

export default function Proficiency({ templateId }) {
  return (
    <section className={`module-box ${styles.proficiency} ${templateId ? (styles[templateId] || '') : ''}`}>
      <h3 className="section-header">Proficiencies</h3>
      <div className={styles.grid}>
        <fieldset className={styles.group}>
          <legend className={styles.groupLabel}>Armour</legend>
          <input type="text" placeholder="Light, Medium, Shields..." />
        </fieldset>
        <fieldset className={styles.group}>
          <legend className={styles.groupLabel}>Weapons</legend>
          <input type="text" placeholder="Simple weapons..." />
        </fieldset>
        <fieldset className={styles.group}>
          <legend className={styles.groupLabel}>Tools</legend>
          <input type="text" placeholder="Artisan's tools..." />
        </fieldset>
        <fieldset className={styles.group}>
          <legend className={styles.groupLabel}>Languages</legend>
          <input type="text" placeholder="Common, Elvish..." />
        </fieldset>
      </div>
    </section>
  )
}
