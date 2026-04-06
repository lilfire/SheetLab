import defaultStyles from './RaceClassTraits.module.css'
import modernStyles from './RaceClassTraits.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'

const TEMPLATE_MAP = { modern: modernStyles }

export default function RaceClassTraits({ preset, templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  const traits = preset?.raceTraits ?? []

  return (
    <section className={`module-box ${styles.traits}`}>
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
