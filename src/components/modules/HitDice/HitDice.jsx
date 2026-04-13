import TemplateSlot from '../../template/TemplateSlot.jsx'
import './HitDice.css'

export default function HitDice({ character, settings = {} }) {
  return (
    <section className="module-box hit-dice">
      <TemplateSlot name="hit-dice:header" character={character} settings={settings}>
        <h3 className="section-header">Hit Dice</h3>
      </TemplateSlot>

      <TemplateSlot name="hit-dice:content" character={character} settings={settings}>
        <div className="hit-dice__type">
          <span className="hit-dice__label">Type</span>
          <span className="write-line hit-dice__count" aria-label="Number of hit dice" />
          <span className="hit-dice__d">d</span>
          <span className="write-line hit-dice__die" aria-label="Hit die type" />
        </div>

        <div className="hit-dice__used">
          <span className="hit-dice__label">Used</span>
          <span className="write-line hit-dice__used-input" aria-label="Hit dice used" />
        </div>
      </TemplateSlot>
    </section>
  )
}
