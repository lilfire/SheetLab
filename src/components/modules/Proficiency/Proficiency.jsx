import defaultStyles from './Proficiency.module.css'
import modernStyles from './Proficiency.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'
import { cx } from '../../../utils/cx'

const TEMPLATE_MAP = { modern: modernStyles }

export default function Proficiency({ templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  return (
    <section className={cx('module-box', styles.moduleBox, styles.proficiency)}>
      <h3 className={cx('section-header', styles.sectionHeader)}>Proficiencies</h3>
      <div className={styles.grid}>
        <fieldset className={styles.group}>
          <legend className={styles.groupLabel}>Armour</legend>
          <span className={cx('write-line', styles.writeLine)} />
        </fieldset>
        <fieldset className={styles.group}>
          <legend className={styles.groupLabel}>Weapons</legend>
          <span className={cx('write-line', styles.writeLine)} />
        </fieldset>
        <fieldset className={styles.group}>
          <legend className={styles.groupLabel}>Tools</legend>
          <span className={cx('write-line', styles.writeLine)} />
        </fieldset>
        <fieldset className={styles.group}>
          <legend className={styles.groupLabel}>Languages</legend>
          <span className={cx('write-line', styles.writeLine)} />
        </fieldset>
      </div>
    </section>
  )
}
