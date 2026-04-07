import { useEffect, useRef } from 'react'
import { MODULE_SETTINGS_SCHEMA, STYLE_SETTING_KEYS } from '../../data/moduleSettings.js'
import styles from './ModuleSettingsModal.module.css'

/**
 * ModuleSettingsModal — native <dialog> modal for editing per-module settings.
 *
 * Props:
 *   moduleKey        — which module is being configured
 *   moduleName       — display name for the heading
 *   settings         — current settings values { [settingKey]: value }
 *   onSettingsChange — (moduleKey, newSettings) => void
 *   onClose          — called to close the modal
 */
export default function ModuleSettingsModal({ moduleKey, moduleName, settings, onSettingsChange, onClose }) {
  const dialogRef = useRef(null)
  const schema = MODULE_SETTINGS_SCHEMA[moduleKey] ?? []
  const firstStyleKey = schema.find((d) => STYLE_SETTING_KEYS.has(d.key))?.key

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) {
      dialog.showModal()
    }
    return () => { if (dialog?.open) dialog.close() }
  }, [])

  function handleBackdropClick(e) {
    if (e.target === dialogRef.current) onClose()
  }

  function handleSelectChange(settingKey, value) {
    onSettingsChange(moduleKey, { [settingKey]: value })
  }

  function handleToggle(settingKey, currentValue) {
    // Cycle: null → true → false → null
    let next
    if (currentValue === null) next = true
    else if (currentValue === true) next = false
    else next = null
    onSettingsChange(moduleKey, { [settingKey]: next })
  }

  function handleColorChange(settingKey, value) {
    onSettingsChange(moduleKey, { [settingKey]: value })
  }

  return (
    <dialog
      ref={dialogRef}
      className={`no-print ${styles.dialog}`}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{moduleName} Settings</h3>
        <button type="button" className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>
      <div className={styles.fieldList}>
        {schema.map((def) => (
          <div key={def.key}>
            {def.key === firstStyleKey && (
              <div className={styles.sectionDivider}>
                <span className={styles.sectionLabel}>Style Overrides</span>
              </div>
            )}
            <div className={styles.field}>
              <span className={styles.fieldLabel}>{def.label}</span>
              {def.type === 'select' && (
                <select
                  className={styles.select}
                  value={settings[def.key] ?? def.default ?? ''}
                  onChange={(e) => handleSelectChange(def.key, e.target.value)}
                >
                  {def.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
              {def.type === 'toggle' && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    type="button"
                    role="switch"
                    className={styles.toggle}
                    aria-checked={settings[def.key] === true ? 'true' : 'false'}
                    onClick={() => handleToggle(def.key, settings[def.key])}
                  >
                    <span className={styles.toggleKnob} />
                  </button>
                  {settings[def.key] === null && (
                    <span className={styles.toggleNull}>auto</span>
                  )}
                </div>
              )}
              {def.type === 'color' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={settings[def.key] ?? '#000000'}
                    onChange={(e) => handleColorChange(def.key, e.target.value)}
                    aria-label={def.label}
                  />
                  {settings[def.key] != null && (
                    <button
                      type="button"
                      className={styles.resetBtn}
                      onClick={() => handleColorChange(def.key, null)}
                    >
                      Reset
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </dialog>
  )
}
