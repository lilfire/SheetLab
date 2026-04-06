import { MODULE_REGISTRY } from '../../data/moduleRegistry.js'
import styles from './StepModuleStyles.module.css'

const BORDER_STYLES = ['none', 'solid', 'dashed', 'dotted']
const BORDER_WIDTHS = ['1px', '2px', '3px']

function ModuleStyleRow({ mod, overrides, defaultBg, defaultBorderColor, onChange }) {
  return (
    <div className={styles.moduleRow}>
      <span className={styles.moduleName}>{mod.name}</span>
      <label className={styles.fieldLabel}>
        Background
        <input
          type="color"
          className={styles.colorInput}
          value={overrides?.backgroundColor ?? defaultBg}
          onChange={(e) => onChange(mod.key, 'backgroundColor', e.target.value)}
          aria-label={`${mod.name} background color`}
        />
      </label>
      <label className={styles.fieldLabel}>
        Border Color
        <input
          type="color"
          className={styles.colorInput}
          value={overrides?.borderColor ?? defaultBorderColor}
          onChange={(e) => onChange(mod.key, 'borderColor', e.target.value)}
          aria-label={`${mod.name} border color`}
        />
      </label>
      <label className={styles.fieldLabel}>
        Border Style
        <select
          className={styles.selectInput}
          value={overrides?.borderStyle ?? 'none'}
          onChange={(e) => onChange(mod.key, 'borderStyle', e.target.value)}
          aria-label={`${mod.name} border style`}
        >
          {BORDER_STYLES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className={styles.fieldLabel}>
        Border Width
        <select
          className={styles.selectInput}
          value={overrides?.borderWidth ?? '1px'}
          onChange={(e) => onChange(mod.key, 'borderWidth', e.target.value)}
          aria-label={`${mod.name} border width`}
        >
          {BORDER_WIDTHS.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default function StepModuleStyles({ moduleStyles, setModuleStyles, templateSettings, onNext, onBack }) {
  const defaultBg = templateSettings?.backgroundColor ?? '#f5f0e8'
  const defaultBorderColor = templateSettings?.accentColor ?? '#8b6914'

  function handleChange(moduleKey, prop, value) {
    setModuleStyles((prev) => ({
      ...prev,
      [moduleKey]: { ...prev[moduleKey], [prop]: value },
    }))
  }

  return (
    <div className={styles.step}>
      <h2 className={styles.heading}>Customize Module Styles</h2>
      <p className={styles.hint}>
        Set individual background and border styles for each module. Leave unchanged to use the template defaults.
      </p>
      <div className={styles.moduleList}>
        {MODULE_REGISTRY.map((mod) => (
          <ModuleStyleRow
            key={mod.key}
            mod={mod}
            overrides={moduleStyles[mod.key]}
            defaultBg={defaultBg}
            defaultBorderColor={defaultBorderColor}
            onChange={handleChange}
          />
        ))}
      </div>
      <div className={styles.actions}>
        <button className={styles.backBtn} onClick={onBack} type="button">
          ← Back
        </button>
        <button className={styles.nextBtn} onClick={onNext} type="button">
          Continue →
        </button>
      </div>
    </div>
  )
}
