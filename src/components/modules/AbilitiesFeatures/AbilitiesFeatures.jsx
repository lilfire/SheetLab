import defaultStyles from './AbilitiesFeatures.module.css'
import modernStyles from './AbilitiesFeatures.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'
import { cx } from '../../../utils/cx'

const TEMPLATE_MAP = { modern: modernStyles }

export default function AbilitiesFeatures({ templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  return (
    <section className={cx('module-box', styles.moduleBox, styles.abilities)}>
      <h3 className={cx('section-header', styles.sectionHeader)}>Abilities &amp; Features</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Source</th>
            <th className={styles.th}>Description</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(6)].map((_, i) => (
            <tr key={i} className={styles.row}>
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
