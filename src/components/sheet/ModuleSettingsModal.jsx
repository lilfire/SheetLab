import { useEffect, useState } from 'react'
import { MODULE_SETTINGS_SCHEMA, STYLE_SETTING_KEYS } from '../../data/moduleSettings.js'
import styles from './ModuleSettingsModal.module.css'

function StepperIcon({ children }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const MinusIcon = () => (
  <StepperIcon>
    <path d="M5 12h14" />
  </StepperIcon>
)

const PlusIcon = () => (
  <StepperIcon>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </StepperIcon>
)

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
 * ModuleSettingsModal — slide-in sidebar for editing per-module settings.
 */
export default function ModuleSettingsModal({
  moduleKey, moduleName, settings,
  colSpan, rowSpan, maxColumns,
  onSettingsChange, onColSpan, onRowSpan, onRemove, onClose,
}) {
  const schema = MODULE_SETTINGS_SCHEMA[moduleKey] ?? []
  const firstStyleKey = schema.find((d) => STYLE_SETTING_KEYS.has(d.key))?.key
  // Snapshot the module's currently-rendered style values once on mount so
  // controls without an explicit override show what the user actually sees.
  const [effectiveValues] = useState(() => readEffectiveStyleValues(moduleKey))

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSelectChange(settingKey, value) {
    onSettingsChange(moduleKey, { [settingKey]: value })
  }

  function setToggle(settingKey, value) {
    onSettingsChange(moduleKey, { [settingKey]: value })
  }

  const TOGGLE_OPTIONS = [
    { label: 'Auto', value: null },
    { label: 'Off', value: false },
    { label: 'On', value: true },
  ]

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
    <aside className={`no-print ${styles.sidebar}`} aria-label={`${moduleName} settings`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{moduleName} Settings</h3>
        <button type="button" className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>
      <div className={styles.fieldList}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Width</span>
          <div className={styles.stepper}>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={() => onColSpan(moduleKey, -1)}
              disabled={colSpan <= 1}
              aria-label="Decrease width"
            >
              <MinusIcon />
            </button>
            <span className={styles.stepperLabel}>{colSpan}/{maxColumns}</span>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={() => onColSpan(moduleKey, 1)}
              disabled={colSpan >= maxColumns}
              aria-label="Increase width"
            >
              <PlusIcon />
            </button>
          </div>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Height</span>
          <div className={styles.stepper}>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={() => onRowSpan(moduleKey, -1)}
              disabled={rowSpan <= 1}
              aria-label="Decrease height"
            >
              <MinusIcon />
            </button>
            <span className={styles.stepperLabel}>R{rowSpan}</span>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={() => onRowSpan(moduleKey, 1)}
              aria-label="Increase height"
            >
              <PlusIcon />
            </button>
          </div>
        </div>
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
                <div role="radiogroup" aria-label={def.label} className={styles.segmented}>
                  {TOGGLE_OPTIONS.map((opt) => {
                    const active = settings[def.key] === opt.value
                    return (
                      <button
                        key={String(opt.value)}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        className={`${styles.segment} ${active ? styles.segmentActive : ''}`}
                        onClick={() => setToggle(def.key, opt.value)}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
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
                    <button
                      type="button"
                      className={styles.resetBtn}
                      onClick={() => handleColorChange(def.key, null)}
                      style={settings[def.key] == null ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}
                    >
                      Reset
                    </button>
                  </div>
                )
              })()}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.dangerBtn}
          onClick={() => { onRemove(moduleKey); onClose() }}
        >
          Remove module
        </button>
      </div>
    </aside>
  )
}
