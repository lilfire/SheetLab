import styles from './Inspiration.module.css'

export default function Inspiration() {
  return (
    <section className={`module-box ${styles.inspiration}`}>
      <h3 className="section-header">Inspiration</h3>
      <div className={styles.tracker}>
        <label className={styles.label}>
          <input type="checkbox" className={styles.checkbox} />
          <span className={styles.inspired}>Inspired</span>
        </label>
      </div>
    </section>
  )
}
