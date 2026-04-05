import { MODULE_REGISTRY } from '../../data/moduleRegistry.js'
import styles from './ComponentPicker.module.css'

/**
 * ComponentPicker — lists all 18 modules and lets the user toggle visibility.
 *
 * Props:
 *   layoutConfig  { [key]: { visible: boolean } }
 *   onToggle      (key: string) => void
 */
export default function ComponentPicker({ layoutConfig, onToggle }) {
  return (
    <div className={`no-print ${styles.panel}`}>
      <h3 className={styles.heading}>Modules</h3>
      <ul className={styles.list}>
        {MODULE_REGISTRY.map((mod) => {
          const visible = layoutConfig[mod.key]?.visible ?? true
          return (
            <li key={mod.key} className={styles.item}>
              <button
                type="button"
                className={`${styles.toggle} ${visible ? styles.on : styles.off}`}
                onClick={() => onToggle(mod.key)}
                aria-pressed={visible}
                title={visible ? `Hide ${mod.name}` : `Show ${mod.name}`}
              >
                <span className={styles.indicator}>{visible ? '✓' : '+'}</span>
                <span className={styles.label}>{mod.name}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
