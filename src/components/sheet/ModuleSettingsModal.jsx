import { useEffect, useRef, useState } from 'react'
import { MODULE_SETTINGS_SCHEMA, STYLE_SETTING_KEYS } from '../../data/moduleSettings.js'
import styles from './ModuleSettingsModal.module.css'

// Convert "rgb(r, g, b)" or "rgba(r, g, b, a)" → "#rrggbb" or "#rrggbbaa".
// Returns null if the input doesn't look like an rgb/rgba string.
function rgbToHex(rgbString) {
  if (typeof rgbString !== 'string') return null
  const m = rgbString.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/)
  if (!m) return null
  const toHex = (n) => Math.max(0, Math.min(255, parseInt(n, 10))).toString(16).padStart(2, '0')
  const hex = `#${toHex(m[1])}${toHex(m[2])}${toHex(m[3])}`
  if (m[4] === undefined) return hex
  const a = Math.max(0, Math.min(1, parseFloat(m[4])))
  if (a >= 1) return hex
  return `${hex}${Math.round(a * 255).toString(16).padStart(2, '0')}`
}

// Read effective style values for the live module element so the modal can
// initialize controls with what's actually rendered (not just stored overrides).
// Returns an object keyed by setting key with the resolved value, or null
// if the setting can't be resolved from the DOM.
function readEffectiveStyleValues(moduleKey) {
  if (typeof document === 'undefined') return {}
  const wrapper = document.querySelector(`[data-module-key="${moduleKey}"]`)
  if (!wrapper) return {}
  // The wrapper is just the grid cell — background/border live on the inner
  // .module-box child. Fall back to the wrapper if no module-box is found.
  const styled = wrapper.querySelector('.module-box') ?? wrapper
  const cs = getComputedStyle(styled)
  const out = {
    backgroundColor: rgbToHex(cs.backgroundColor),
    borderColor: rgbToHex(cs.borderTopColor),
    borderStyle: cs.borderTopStyle || null,
    borderWidth: cs.borderTopWidth || null,
    textColor: rgbToHex(cs.color),
  }
  // Probe trick for var-only settings: temporarily set a real CSS property on
  // a probe child to the bare var(...) reference, then read its computed value.
  const probe = document.createElement('span')
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  probe.style.pointerEvents = 'none'
  styled.appendChild(probe)
  try {
    const probeVar = (cssVar) => {
      probe.style.color = ''
      probe.style.color = `var(${cssVar})`
      return rgbToHex(getComputedStyle(probe).color)
    }
    out.headingColor = probeVar('--mod-heading')
    out.accentColor = probeVar('--mod-accent')
    out.mutedColor = probeVar('--mod-muted')
    // Heading fallback: if the var isn't set, look at the first heading element.
    if (!out.headingColor || out.headingColor === '#000000') {
      const heading = styled.querySelector('h1, h2, h3, h4')
      if (heading) {
        const hex = rgbToHex(getComputedStyle(heading).color)
        if (hex) out.headingColor = hex
      }
    }
  } finally {
    styled.removeChild(probe)
  }
  return out
}

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
  // Snapshot the module's currently-rendered style values once on mount so
  // controls without an explicit override show what the user actually sees.
  const [effectiveValues] = useState(() => readEffectiveStyleValues(moduleKey))

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

  // Split a stored color value into a 6-digit hex (for <input type=color>) and an alpha 0..1.
  function splitColor(value) {
    if (typeof value !== 'string') return { hex: '#000000', alpha: 1 }
    const m = value.match(/^#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/)
    if (!m) return { hex: '#000000', alpha: 1 }
    const hex = `#${m[1].toLowerCase()}`
    const alpha = m[2] ? parseInt(m[2], 16) / 255 : 1
    return { hex, alpha }
  }

  // Combine a 6-digit hex and alpha (0..1) into the stored value.
  // Omits the alpha suffix when fully opaque so existing 6-digit values stay unchanged.
  function joinColor(hex, alpha) {
    if (alpha >= 1) return hex
    const a = Math.max(0, Math.min(255, Math.round(alpha * 255)))
    return `${hex}${a.toString(16).padStart(2, '0')}`
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
              {def.type === 'select' && (() => {
                const stored = settings[def.key]
                const effective = effectiveValues[def.key]
                let displayValue = stored ?? effective ?? def.default ?? def.options[0]?.value ?? ''
                // Computed values like "0px" or "none" may not be in the option list;
                // fall back to the first option so the <select> stays valid.
                if (!def.options.some((o) => o.value === displayValue)) {
                  displayValue = def.default ?? def.options[0]?.value ?? ''
                }
                return (
                  <select
                    className={styles.select}
                    value={displayValue}
                    onChange={(e) => handleSelectChange(def.key, e.target.value)}
                  >
                    {def.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )
              })()}
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
              {def.type === 'color' && (() => {
                const colorValue = settings[def.key] ?? effectiveValues[def.key]
                const { hex, alpha } = splitColor(colorValue)
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="color"
                      className={styles.colorInput}
                      value={hex}
                      onChange={(e) => handleColorChange(def.key, joinColor(e.target.value, alpha))}
                      aria-label={def.label}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      className={styles.alphaSlider}
                      value={Math.round(alpha * 100)}
                      onChange={(e) => handleColorChange(def.key, joinColor(hex, Number(e.target.value) / 100))}
                      aria-label={`${def.label} opacity`}
                      title={`Opacity: ${Math.round(alpha * 100)}%`}
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
                )
              })()}
            </div>
          </div>
        ))}
      </div>
    </dialog>
  )
}
