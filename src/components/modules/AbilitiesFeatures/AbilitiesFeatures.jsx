import defaultStyles from './AbilitiesFeatures.module.css'
import modernStyles from './AbilitiesFeatures.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'

const TEMPLATE_MAP = { modern: modernStyles }

export default function AbilitiesFeatures({ templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  return (
    <section className={`module-box ${styles.abilities}`}>
      <h3 className="section-header">Abilities &amp; Features</h3>
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
              <td><span className="write-line" /></td>
              <td><span className="write-line" /></td>
              <td><span className="write-line" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
