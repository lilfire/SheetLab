import defaultStyles from './HeaderBanner.module.css'
import modernStyles from './HeaderBanner.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'

const TEMPLATE_MAP = { modern: modernStyles }

export default function HeaderBanner({ character, templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  return (
    <section className={`${styles.banner}`}>
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
