import defaultStyles from './AttacksCantrips.module.css'
import modernStyles from './AttacksCantrips.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'
import { cx } from '../../../utils/cx'

const TEMPLATE_MAP = { modern: modernStyles }

export default function AttacksCantrips({ templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  return (
    <section className={cx('module-box', styles.moduleBox, styles.attacks)}>
      <h3 className={cx('section-header', styles.sectionHeader)}>Attacks &amp; Cantrips</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Range</th>
            <th className={styles.th}>Hit/DC</th>
            <th className={styles.th}>Action</th>
            <th className={styles.th}>Damage</th>
            <th className={styles.th}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i} className={styles.row}>
              <td><span className={cx('write-line', styles.writeLine)} /></td>
              <td><span className={cx('write-line', styles.writeLine)} /></td>
              <td><span className={cx('write-line', styles.writeLine)} /></td>
              <td><span className={cx('write-line', styles.writeLine)} /></td>
              <td><span className={cx('write-line', styles.writeLine)} /></td>
              <td><span className={cx('write-line', styles.writeLine)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
