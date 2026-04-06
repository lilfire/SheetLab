import styles from './HeaderBanner.module.css'

export default function HeaderBanner({ character, templateId }) {
  return (
    <section className={`${styles.banner} ${templateId ? (styles[templateId] || '') : ''}`}>
      <div className={styles.scrollShape}>
        <div className={styles.scrollLeft} />
        <div className={styles.content}>
          <p className={styles.label}>Character Name</p>
          <span className={styles.nameInput}>{character?.name ?? ''}</span>
        </div>
        <div className={styles.scrollRight} />
      </div>
      {/* Extra fields — hidden by default, shown in modern */}
      <div className={styles.bannerExtra}>
        <div className={styles.lvlBadge}>
          <span className={styles.lvlLabel}>LVL</span>
          <span className={styles.lvlInput} aria-label="Level" />
        </div>
        <div className={styles.expField}>
          <span className={styles.expLabel}>Experience</span>
          <span className={styles.expInput} aria-label="Experience" />
        </div>
      </div>
    </section>
  )
}
