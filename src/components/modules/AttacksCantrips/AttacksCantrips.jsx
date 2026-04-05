import styles from './AttacksCantrips.module.css'

export default function AttacksCantrips({ templateId }) {
  return (
    <section className={`module-box ${styles.attacks} ${templateId ? (styles[templateId] || '') : ''}`}>
      <h3 className="section-header">Attacks &amp; Cantrips</h3>
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
              <td><span className="write-line" /></td>
              <td><span className="write-line" /></td>
              <td><span className="write-line" /></td>
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
