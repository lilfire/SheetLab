import { MODULE_REGISTRY } from './MODULE_REGISTRY.js'
import { getTemplate } from '../../templates/index.js'
import styles from './SheetPreview.module.css'

export default function SheetPreview({ character, preset, template, templateSettings, layoutConfig, setLayoutConfig, onReset }) {
  const tpl = getTemplate(template)

  const userOverrides = {}
  if (templateSettings?.backgroundColor) userOverrides['--color-parchment'] = templateSettings.backgroundColor
  if (templateSettings?.accentColor) userOverrides['--color-gold'] = templateSettings.accentColor
  if (templateSettings?.fontFamily) userOverrides['--font-serif'] = templateSettings.fontFamily

  const templateId = tpl.id

  function handlePrint() {
    window.print()
  }

  return (
    <div className={styles.wrapper}>
      {/* Toolbar — hidden on print */}
      <div className={`no-print ${styles.toolbar}`}>
        <button className={styles.printBtn} onClick={handlePrint} type="button">
          🖨 Print Sheet
        </button>
        <button className={styles.resetBtn} onClick={onReset} type="button">
          ← New Character
        </button>
      </div>

      {/* A4 sheet */}
      <div className={`sheet-preview ${styles.sheet}`} data-template={tpl.layout} style={userOverrides}>
        <div className={`sheet-grid ${styles.grid}`}>
          {layoutConfig.filter(entry => entry.visible).map(entry => {
            const mod = MODULE_REGISTRY[entry.moduleId]
            if (!mod) return null
            const Component = mod.component
            return (
              <div key={entry.moduleId} style={{ gridArea: entry.gridArea }}>
                <Component character={character} preset={preset} templateId={templateId} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
