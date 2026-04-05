import styles from './HeaderBanner.module.css'

export default function HeaderBanner({ character }) {
  return (
    <section className={styles.banner}>
      <div className={styles.scrollShape}>
        <div className={styles.scrollLeft} />
        <div className={styles.content}>
          <p className={styles.label}>Character Name</p>
          <span className={styles.nameInput}>{character?.name ?? ''}</span>
        </div>
        <div className={styles.scrollRight} />
      </div>
    </section>
  )
}
