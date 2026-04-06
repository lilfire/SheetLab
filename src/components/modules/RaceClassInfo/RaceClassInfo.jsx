import defaultStyles from './RaceClassInfo.module.css'
import modernStyles from './RaceClassInfo.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'
import { cx } from '../../../utils/cx'

const TEMPLATE_MAP = { modern: modernStyles }

export default function RaceClassInfo({ preset, templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  return (
    <section className={cx('module-box', styles.moduleBox, styles.raceClass)}>
      <h3 className={cx('section-header', styles.sectionHeader)}>Race, Class &amp; Experience</h3>
      <div className={styles.fields}>
        <fieldset className={styles.field}>
          <label className={styles.label}>Race</label>
          <span className={cx('write-line', styles.writeLine)}>{preset?.race ?? ''}</span>
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Class</label>
          <span className={cx('write-line', styles.writeLine)}>{preset?.class ?? ''}</span>
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Subclass</label>
          <span className={cx('write-line', styles.writeLine)} />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Level</label>
          <span className={cx('write-line', styles.writeLine)} />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Experience</label>
          <span className={cx('write-line', styles.writeLine)} />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Proficiency Bonus</label>
          <span className={cx('write-line', styles.writeLine)} />
        </fieldset>
      </div>
      {/* Extra fields — hidden by default, shown in modern */}
      <div className={styles.extraFields}>
        <fieldset className={styles.field}>
          <label className={styles.label}>Background &amp; Alignment</label>
          <span className={cx('write-line', styles.writeLine)} />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Character Features</label>
          <span className={cx('write-line', styles.writeLine)} />
        </fieldset>
        <fieldset className={styles.field}>
          <label className={styles.label}>Character Traits</label>
          <span className={cx('write-line', styles.writeLine)} />
        </fieldset>
      </div>
    </section>
  )
}
