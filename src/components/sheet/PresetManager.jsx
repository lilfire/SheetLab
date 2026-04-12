import { useState } from 'react'
import styles from './PresetManager.module.css'

/**
 * PresetManager — save, load, and delete layout presets.
 *
 * Props:
 *   presets          LayoutPreset[] — presets for the current template
 *   onSave           (name: string) => void
 *   onLoad           (preset: LayoutPreset) => void
 *   onDelete         (presetId: string) => void
 *   onResetToDefault () => void
 */
export default function PresetManager({ presets, onSave, onLoad, onDelete, onResetToDefault }) {
  const [saveName, setSaveName] = useState('')

  function handleSave() {
    const name = saveName.trim()
    if (!name) return
    onSave(name)
    setSaveName('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSave()
  }

  return (
    <div className={`no-print ${styles.panel}`}>
      <h3 className={styles.heading}>Layout Presets</h3>

      <div className={styles.saveRow}>
        <input
          type="text"
          className={styles.nameInput}
          placeholder="Preset name..."
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className={styles.saveBtn}
          disabled={!saveName.trim()}
          onClick={handleSave}
        >
          Save
        </button>
      </div>

      {presets.length === 0 ? (
        <p className={styles.emptyMsg}>No saved presets</p>
      ) : (
        <ul className={styles.presetList}>
          {presets.map((p) => (
            <li key={p.id} className={styles.presetItem}>
              <span className={styles.presetName} title={p.name}>{p.name}</span>
              <button type="button" className={styles.loadBtn} onClick={() => onLoad(p)}>
                Load
              </button>
              <button type="button" className={styles.deleteBtn} onClick={() => onDelete(p.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className={styles.resetBtn} onClick={onResetToDefault}>
        Reset to Default
      </button>
    </div>
  )
}
