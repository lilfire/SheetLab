import styles from './Inspiration.module.css'

export default function Inspiration({ templateId }) {
  return (
    <section className={`module-box ${styles.inspiration} ${templateId ? (styles[templateId] || '') : ''}`}>
      <h3 className="section-header">Inspiration</h3>
      <div className={styles.tracker}>
        <div className={styles.label}>
          <span className={styles.checkbox}>○</span>
          <span className={styles.inspired}>Inspired</span>
        </div>
      </div>
    </section>
  )
}
