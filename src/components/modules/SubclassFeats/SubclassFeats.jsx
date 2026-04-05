import styles from './SubclassFeats.module.css'

export default function SubclassFeats({ preset }) {
  const subclass = preset?.modules?.subclassFeats
  const title = subclass?.title ?? 'Subclass Feats'
  const slots = subclass?.slots ?? 8

  return (
    <section className={`module-box ${styles.feats}`}>
      <h3 className="section-header">{title}</h3>
      <ul className={styles.list}>
        {[...Array(slots)].map((_, i) => (
          <li key={i} className={styles.slot}>
            <span className={styles.index}>{i + 1}.</span>
            <input type="text" placeholder={`Feat ${i + 1}...`} />
          </li>
        ))}
      </ul>
    </section>
  )
}
