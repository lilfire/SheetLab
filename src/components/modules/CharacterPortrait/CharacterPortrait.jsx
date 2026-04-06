import defaultStyles from './CharacterPortrait.module.css'
import modernStyles from './CharacterPortrait.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'

const TEMPLATE_MAP = { modern: modernStyles }

export default function CharacterPortrait({ templateId }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  return (
    <section className={`module-box ${styles.portrait}`}>
      <h3 className="section-header">Portrait</h3>
      <div className={styles.frame}>
        <div className={styles.placeholder}>
          <span className={styles.icon}>⚔</span>
          <p className={styles.hint}>Paste or draw portrait here</p>
        </div>
      </div>
    </section>
  )
}
