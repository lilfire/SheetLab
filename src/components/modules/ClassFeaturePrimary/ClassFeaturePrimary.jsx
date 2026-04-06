import defaultStyles from './ClassFeaturePrimary.module.css'
import modernStyles from './ClassFeaturePrimary.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'
import { cx } from '../../../utils/cx'

const TEMPLATE_MAP = { modern: modernStyles }

export default function ClassFeaturePrimary({ preset, templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  const feature = preset?.modules?.classFeaturePrimary

  return (
    <section className={cx('module-box', styles.moduleBox, styles.feature)}>
      <h3 className={cx('section-header', styles.sectionHeader)}>Class Feature (Primary)</h3>
      <div className={styles.content}>
        <p className={styles.title}>{feature?.title ?? 'Primary Feature'}</p>
        <p className={styles.description}>{feature?.description ?? 'Select a class to populate this feature.'}</p>
      </div>
      {/* Usage tracking — hidden by default, shown in modern */}
      <div className={styles.usageTracker}>
        <div className={styles.usageHeader}>
          <span className={styles.usageCol}>Used</span>
          <span className={styles.usageCol}>DMG</span>
          <span className={styles.usageCol}>Total</span>
        </div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={styles.usageRow}>
            <span className={cx('pen-checkbox', styles.penCheckbox)}>○</span>
            <span className={cx('write-line', styles.writeLine)} />
            <span className={cx('write-line', styles.writeLine)} />
          </div>
        ))}
      </div>
      <div className={styles.notes}>
        <span className={cx('write-line', styles.writeLine)} />
      </div>
    </section>
  )
}
