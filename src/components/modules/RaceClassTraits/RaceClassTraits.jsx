import styles from './RaceClassTraits.module.css'

export default function RaceClassTraits({ preset, templateId }) {
  const traits = preset?.raceTraits ?? []

  return (
    <section className={`module-box ${styles.traits} ${templateId ? (styles[templateId] || '') : ''}`}>
      <h3 className="section-header">Race &amp; Class Traits</h3>
      <ul className={styles.list}>
        {traits.length > 0
          ? traits.map((trait, i) => (
              <li key={i} className={styles.trait}>{trait}</li>
            ))
          : <li className={styles.placeholder}>Select race and class to see traits</li>
        }
        {/* Extra blank rows for handwriting */}
        {[...Array(Math.max(0, 6 - traits.length))].map((_, i) => (
          <li key={`blank-${i}`} className={styles.blank}>
            <span className="write-line" />
          </li>
        ))}
      </ul>
    </section>
  )
}
