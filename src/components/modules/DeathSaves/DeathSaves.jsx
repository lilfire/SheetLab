import TemplateSlot from '../../template/TemplateSlot.jsx'
import './DeathSaves.css'

export default function DeathSaves({ character, settings = {} }) {
  return (
    <section className="module-box death-saves">
      <TemplateSlot name="death-saves:header" character={character} settings={settings}>
        <h3 className="section-header">Death Saves</h3>
      </TemplateSlot>

      <TemplateSlot name="death-saves:content" character={character} settings={settings}>
        <div className="death-saves__row">
          <span className="death-saves__type">Successes</span>
          <div className="death-saves__bubbles">
            {[1, 2, 3].map((i) => (
              <span key={i} className="death-saves__bubble" aria-label={`Success ${i}`}>○</span>
            ))}
          </div>
        </div>
        <div className="death-saves__row">
          <span className="death-saves__type">Failures</span>
          <div className="death-saves__bubbles">
            {[1, 2, 3].map((i) => (
              <span key={i} className="death-saves__bubble" aria-label={`Failure ${i}`}>○</span>
            ))}
          </div>
        </div>
      </TemplateSlot>
    </section>
  )
}
