import defaultStyles from './HPTracker.module.css'
import modernStyles from './HPTracker.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'
import { cx } from '../../../utils/cx'

const TEMPLATE_MAP = { modern: modernStyles }

export default function HPTracker({ templateId, settings = {} }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)

  const { orbColor, orbFill, labelColor } = settings
  const ringStyle = orbColor ? { borderColor: orbColor } : undefined
  const orbStyle = (orbColor || orbFill)
    ? { ...(orbColor && { borderColor: orbColor }), ...(orbFill && { background: orbFill }) }
    : undefined
  const lblStyle = labelColor ? { color: labelColor } : undefined

  return (
    <section className={cx('module-box', styles.moduleBox, styles.hpTracker)}>
      <h3 className={cx('section-header', styles.sectionHeader)}>Hit Points</h3>

      {/* Ring layout: 3 circles (maxHP — mainHP — tempHP) with connectors */}
      <div className={styles.ringLayout}>
        {/* Max HP satellite — hidden by default, shown in modern */}
        <div className={styles.maxHpRing} style={ringStyle}>
          <span className={styles.satelliteLabel} style={lblStyle}>Max HP</span>
          <span className={styles.satelliteInput} aria-label="Max HP (ring)" />
        </div>

        {/* Connector line — hidden by default */}
        <div className={styles.connector} style={orbColor ? { background: orbColor } : undefined} />

        {/* Main HP orb */}
        <div className={styles.orb} style={orbStyle}>
          <div className={styles.orbInner}>
            <span className={styles.orbLabel} style={lblStyle}>Current HP</span>
            <span className={styles.hpInput} aria-label="Current HP" />
            {/* Inline max HP — shown by default, hidden in modern */}
            <span className={styles.inlineMax}>
              <span className={styles.divider}>/ </span>
              <span className={styles.maxInput} aria-label="Max HP" />
            </span>
          </div>
        </div>

        {/* Connector line — hidden by default */}
        <div className={styles.connector} style={orbColor ? { background: orbColor } : undefined} />

        {/* Temp HP satellite — hidden by default, shown in modern */}
        <div className={styles.tempHpRing} style={ringStyle}>
          <span className={styles.satelliteLabel} style={lblStyle}>Temp HP</span>
          <span className={styles.satelliteInput} aria-label="Temp HP (ring)" />
        </div>
      </div>

      {/* Hit Dice row — hidden by default, shown in modern */}
      <div className={styles.hitDiceRow}>
        <span className={styles.hitDiceLabel} style={lblStyle}>Hit Dice</span>
        <span className={cx('write-line', styles.writeLine)} aria-label="Hit Dice" />
      </div>

      {/* Inline temp HP — shown by default, hidden in modern */}
      <div className={styles.tempHp}>
        <span className={styles.tempLabel} style={lblStyle}>Temporary HP</span>
        <span className={cx('write-line', styles.writeLine)} aria-label="Temporary HP" />
      </div>

      <div className={styles.deathSaves} style={orbColor ? { borderTopColor: orbColor } : undefined}>
        <span className={styles.saveLabel} style={lblStyle}>Death Saves</span>
        <div className={styles.saveRow}>
          <span className={styles.saveType}>Successes</span>
          <div className={styles.bubbles}>
            {[1, 2, 3].map((i) => (
              <span key={i} className={styles.bubble} aria-label={`Success ${i}`}>○</span>
            ))}
          </div>
        </div>
        <div className={styles.saveRow}>
          <span className={styles.saveType}>Failures</span>
          <div className={styles.bubbles}>
            {[1, 2, 3].map((i) => (
              <span key={i} className={styles.bubble} aria-label={`Failure ${i}`}>○</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
