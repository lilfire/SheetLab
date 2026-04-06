import defaultStyles from './BackgroundInfo.module.css'
import modernStyles from './BackgroundInfo.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'

const TEMPLATE_MAP = { modern: modernStyles }

export default function BackgroundInfo({ templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  return (
    <section className={`module-box ${styles.background}`}>
      <h3 className="section-header">Background &amp; Personality</h3>
      <div className={styles.grid}>
        <fieldset className={styles.field}>
          <label className={styles.label}>Background</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Alignment</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className={`${styles.field} ${styles.wide}`}>
          <label className={styles.label}>Personality Traits</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Ideals</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Bonds</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className={`${styles.field} ${styles.wide}`}>
          <label className={styles.label}>Flaws</label>
          <span className="write-line" />
        </fieldset>
      </div>
    </section>
  )
}
