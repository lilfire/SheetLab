import { useState } from 'react'
import { TEMPLATES, getTemplate } from '../../templates/index.js'
import styles from './StepTemplate.module.css'

const FONT_OPTIONS = [
  { label: 'Georgia (Serif)', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: "'Times New Roman', serif" },
  { label: 'Palatino', value: 'Palatino, serif' },
  { label: 'System Sans-Serif', value: 'system-ui, -apple-system, sans-serif' },
]

function TemplateSettingsPanel({ template, settings, onChange, onConfirm, onBack }) {
  return (
    <div className={styles.settingsPanel} role="region" aria-label="Template settings">
      <h3 className={styles.settingsHeading}>Customize {template.name}</h3>
      <div className={styles.settingsFields}>
        <label className={styles.fieldLabel}>
          Accent Color
          <input
            type="color"
            className={styles.colorInput}
            value={settings.accentColor}
            onChange={(e) => onChange({ ...settings, accentColor: e.target.value })}
            aria-label="Accent color"
          />
        </label>
        <label className={styles.fieldLabel}>
          Font Family
          <select
            className={styles.fontSelect}
            value={settings.fontFamily}
            onChange={(e) => onChange({ ...settings, fontFamily: e.target.value })}
            aria-label="Font family"
          >
            {FONT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.settingsActions}>
        <button className={styles.backBtn} onClick={onBack} type="button">
          ← Back
        </button>
        <button className={styles.continueBtn} onClick={onConfirm} type="button">
          Continue →
        </button>
      </div>
    </div>
  )
}

function getDefaultSettings(template) {
  return {
    accentColor: template.settings.accentColor || '#2563eb',
    fontFamily: template.settings.fontFamily || "'Inter', system-ui, sans-serif",
  }
}

export default function StepTemplate({ characterClass, race, onSelect, onBack }) {
  const [selectedId, setSelectedId] = useState(null)
  const [settings, setSettings] = useState(null)

  function handleCardClick(tplId) {
    const tpl = getTemplate(tplId)
    setSelectedId(tplId)
    setSettings(getDefaultSettings(tpl))
  }

  function handleConfirm() {
    onSelect(selectedId, settings)
  }

  function handleBackToGrid() {
    setSelectedId(null)
    setSettings(null)
  }

  if (selectedId && settings) {
    return (
      <div className={styles.step}>
        <h2 className={styles.heading}>Choose a Template</h2>
        <p className={styles.hint}>
          <strong>{race}</strong> — <strong>{characterClass}</strong>. Customize your layout.
        </p>
        <TemplateSettingsPanel
          template={getTemplate(selectedId)}
          settings={settings}
          onChange={setSettings}
          onConfirm={handleConfirm}
          onBack={handleBackToGrid}
        />
      </div>
    )
  }

  return (
    <div className={styles.step}>
      <h2 className={styles.heading}>Choose a Template</h2>
      <p className={styles.hint}>
        <strong>{race}</strong> — <strong>{characterClass}</strong>. Pick a sheet layout.
      </p>
      <div className={styles.grid}>
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            className={styles.card}
            onClick={() => handleCardClick(tpl.id)}
            type="button"
            aria-label={`Select ${tpl.name} template`}
          >
            <div
              className={styles.thumbnail}
              aria-hidden="true"
              style={{ backgroundColor: '#ffffff' }}
            >
              {tpl.layout === 'two-column' ? (
                <div className={styles.thumbTwoCol}>
                  <div className={styles.thumbCol} />
                  <div className={styles.thumbCol} />
                </div>
              ) : tpl.layout === 'modern' ? (
                <div className={styles.thumbModern}>
                  <div className={styles.thumbModernHeader} />
                  <div className={styles.thumbModernBody}>
                    <div className={styles.thumbCol} />
                    <div className={styles.thumbCol} />
                    <div className={styles.thumbCol} />
                  </div>
                </div>
              ) : (
                <div className={styles.thumbThreeCol}>
                  <div className={styles.thumbCol} />
                  <div className={styles.thumbCol} />
                  <div className={styles.thumbCol} />
                </div>
              )}
            </div>
            <span className={styles.templateName}>{tpl.name}</span>
            <span className={styles.templateDesc}>{tpl.description}</span>
          </button>
        ))}
      </div>
      <button className={styles.backBtn} onClick={onBack} type="button">
        ← Back
      </button>
    </div>
  )
}
