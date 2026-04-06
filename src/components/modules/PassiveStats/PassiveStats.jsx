import defaultStyles from './PassiveStats.module.css'
import modernStyles from './PassiveStats.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'
import { cx } from '../../../utils/cx'

const TEMPLATE_MAP = { modern: modernStyles }

export default function PassiveStats({ templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  return (
    <section className={cx('module-box', styles.moduleBox, styles.passive)}>
      <h3 className={cx('section-header', styles.sectionHeader)}>Passive Stats</h3>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.label}>Passive Perception</span>
          <span className={styles.value} />
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Passive Investigation</span>
          <span className={styles.value} />
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Passive Insight</span>
          <span className={styles.value} />
        </div>
      </div>
    </section>
  )
}
