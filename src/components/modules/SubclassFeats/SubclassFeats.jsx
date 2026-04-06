import defaultStyles from './SubclassFeats.module.css'
import modernStyles from './SubclassFeats.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'
import { cx } from '../../../utils/cx'

const TEMPLATE_MAP = { modern: modernStyles }

export default function SubclassFeats({ preset, templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  const subclass = preset?.modules?.subclassFeats
  const title = subclass?.title ?? 'Subclass Feats'
  const slots = subclass?.slots ?? 8

  return (
    <section className={cx('module-box', styles.moduleBox, styles.feats)}>
      <h3 className={cx('section-header', styles.sectionHeader)}>{title}</h3>
      <ul className={styles.list}>
        {[...Array(slots)].map((_, i) => (
          <li key={i} className={styles.slot}>
            <span className={styles.index}>{i + 1}.</span>
            <span className={cx('write-line', styles.writeLine)} />
          </li>
        ))}
      </ul>
    </section>
  )
}
