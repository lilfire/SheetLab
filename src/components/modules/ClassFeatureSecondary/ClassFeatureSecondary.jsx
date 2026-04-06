import defaultStyles from './ClassFeatureSecondary.module.css'
import modernStyles from './ClassFeatureSecondary.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'

const TEMPLATE_MAP = { modern: modernStyles }

export default function ClassFeatureSecondary({ preset, templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  const feature = preset?.modules?.classFeatureSecondary

  return (
    <section className={`module-box ${styles.feature}`}>
      <h3 className="section-header">Class Feature (Secondary)</h3>
      <div className={styles.content}>
        <p className={styles.title}>{feature?.title ?? 'Secondary Feature'}</p>
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
            <span className="pen-checkbox">○</span>
            <span className="write-line" />
            <span className="write-line" />
          </div>
        ))}
      </div>
      <div className={styles.notes}>
        <span className="write-line" />
      </div>
    </section>
  )
}
