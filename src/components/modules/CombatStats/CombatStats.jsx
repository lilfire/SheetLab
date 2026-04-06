import defaultStyles from './CombatStats.module.css'
import modernStyles from './CombatStats.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'
import { cx } from '../../../utils/cx'

const TEMPLATE_MAP = { modern: modernStyles }

export default function CombatStats({ templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  return (
    <section className={cx('module-box', styles.moduleBox, styles.combat)}>
      <h3 className={cx('section-header', styles.sectionHeader)}>Combat Stats</h3>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.circle}>
            <span className={styles.value} aria-label="Armor Class" />
          </div>
          <span className={styles.label}>Armor Class</span>
        </div>
        <div className={styles.stat}>
          <div className={styles.circle}>
            <span className={styles.value} aria-label="Speed" />
          </div>
          <span className={styles.label}>Speed</span>
        </div>
        <div className={styles.stat}>
          <div className={styles.circle}>
            <span className={styles.value} aria-label="Initiative" />
          </div>
          <span className={styles.label}>Initiative</span>
        </div>
        <div className={styles.stat}>
          <div className={styles.circle}>
            <span className={styles.value} aria-label="Proficiency Bonus" />
          </div>
          <span className={styles.label}>Prof. Bonus</span>
        </div>
      </div>
    </section>
  )
}
