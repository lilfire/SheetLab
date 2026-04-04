import styles from './AttacksCantrips.module.css'

export default function AttacksCantrips() {
  return (
    <section className={`module-box ${styles.attacks}`}>
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
              <td><input type="text" placeholder="—" /></td>
              <td><input type="text" placeholder="5 ft" /></td>
              <td><input type="text" placeholder="+0" /></td>
              <td><input type="text" placeholder="Action" /></td>
              <td><input type="text" placeholder="1d6" /></td>
              <td><input type="text" placeholder="Notes..." /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
