import defaultStyles from './Proficiency.module.css'
import modernStyles from './Proficiency.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'

const TEMPLATE_MAP = { modern: modernStyles }

export default function Proficiency({ templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  return (
    <section className={`module-box ${styles.proficiency}`}>
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
