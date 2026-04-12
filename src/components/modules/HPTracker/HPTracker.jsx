import TemplateSlot from '../../template/TemplateSlot.jsx'
import './HPTracker.css'

export default function HPTracker({ character, settings = {} }) {
  const { orbColor, orbFill, labelColor } = settings
  const ringStyle = orbColor ? { borderColor: orbColor } : undefined
  const orbStyle = (orbColor || orbFill)
    ? { ...(orbColor && { borderColor: orbColor }), ...(orbFill && { background: orbFill }) }
    : undefined
  const lblStyle = labelColor ? { color: labelColor } : undefined

  return (
    <section className="module-box hp-tracker">
      <TemplateSlot name="hp-tracker:header" character={character} settings={settings}>
        <h3 className="section-header">Hit Points</h3>
      </TemplateSlot>

      <TemplateSlot name="hp-tracker:ring-layout" character={character} settings={settings}>
        <div className="hp-tracker__ring-layout">
          <div className="hp-tracker__max-hp-ring" style={ringStyle}>
            <span className="hp-tracker__satellite-label" style={lblStyle}>Max HP</span>
            <span className="hp-tracker__satellite-input" aria-label="Max HP (ring)" />
          </div>

          <div className="hp-tracker__connector" style={orbColor ? { background: orbColor } : undefined} />

          <div className="hp-tracker__orb" style={orbStyle}>
            <div className="hp-tracker__orb-inner">
              <span className="hp-tracker__orb-label" style={lblStyle}>Current HP</span>
              <span className="hp-tracker__hp-input" aria-label="Current HP" />
              <span className="hp-tracker__inline-max">
                <span className="hp-tracker__divider">/ </span>
                <span className="hp-tracker__max-input" aria-label="Max HP" />
              </span>
            </div>
          </div>

          <div className="hp-tracker__connector" style={orbColor ? { background: orbColor } : undefined} />

          <div className="hp-tracker__temp-hp-ring" style={ringStyle}>
            <span className="hp-tracker__satellite-label" style={lblStyle}>Temp HP</span>
            <span className="hp-tracker__satellite-input" aria-label="Temp HP (ring)" />
          </div>
        </div>
      </TemplateSlot>

      <TemplateSlot name="hp-tracker:hit-dice" character={character} settings={settings}>
        <div className="hp-tracker__hit-dice-row">
          <span className="hp-tracker__hit-dice-label" style={lblStyle}>Hit Dice</span>
          <span className="write-line" aria-label="Hit Dice" />
        </div>
      </TemplateSlot>

      <TemplateSlot name="hp-tracker:temp-hp" character={character} settings={settings}>
        <div className="hp-tracker__temp-hp">
          <span className="hp-tracker__temp-label" style={lblStyle}>Temporary HP</span>
          <span className="write-line" aria-label="Temporary HP" />
        </div>
      </TemplateSlot>

    </section>
  )
}
