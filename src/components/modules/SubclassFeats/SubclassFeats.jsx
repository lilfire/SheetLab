import defaultStyles from './SubclassFeats.module.css'
import modernStyles from './SubclassFeats.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'

const TEMPLATE_MAP = { modern: modernStyles }

export default function SubclassFeats({ preset, templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  const subclass = preset?.modules?.subclassFeats
  const title = subclass?.title ?? 'Subclass Feats'
  const slots = subclass?.slots ?? 8

  return (
    <section className={`module-box ${styles.feats}`}>
      <h3 className="section-header">{title}</h3>
      <ul className={styles.list}>
        {[...Array(slots)].map((_, i) => (
          <li key={i} className={styles.slot}>
            <span className={styles.index}>{i + 1}.</span>
            <span className="write-line" />
          </li>
        ))}
      </ul>
    </section>
  )
}
