import defaultStyles from './Equipment.module.css'
import modernStyles from './Equipment.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'

const TEMPLATE_MAP = { modern: modernStyles }

export default function Equipment({ templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  return (
    <section className={`module-box ${styles.equipment}`}>
      <h3 className="section-header">Equipment</h3>
      <div className={styles.capacity}>
        <span className={styles.capacityLabel}>Carrying Capacity:</span>
        <span className={styles.capacityValue} />
        <span className={styles.unit}>lbs</span>
      </div>
      <div className={styles.list}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={styles.item}>
            <span className="write-line" />
          </div>
        ))}
      </div>
    </section>
  )
}
