import styles from './AbilitiesFeatures.module.css'

export default function AbilitiesFeatures() {
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
              <td><input type="text" placeholder="Ability name" /></td>
              <td><input type="text" placeholder="Class / Race" /></td>
              <td><input type="text" placeholder="Brief description..." /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
