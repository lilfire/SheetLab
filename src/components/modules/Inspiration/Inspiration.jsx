import defaultStyles from './Inspiration.module.css'
import modernStyles from './Inspiration.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'

const TEMPLATE_MAP = { modern: modernStyles }

export default function Inspiration({ templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  return (
    <section className={`module-box ${styles.inspiration}`}>
      <h3 className="section-header">Inspiration</h3>
      <div className={styles.tracker}>
        <div className={styles.label}>
          <span className={styles.checkbox}>○</span>
          <span className={styles.inspired}>Inspired</span>
        </div>
      </div>
    </section>
  )
}
