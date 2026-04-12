import TemplateSlot from '../../template/TemplateSlot.jsx'
import './Inspiration.css'

export default function Inspiration({ character }) {
  return (
    <section className="module-box inspiration">
      <TemplateSlot name="inspiration:header" character={character}>
        <h3 className="section-header">Inspiration</h3>
      </TemplateSlot>
      <TemplateSlot name="inspiration:bubbles" character={character}>
        <div className="inspiration__tracker">
          <div className="inspiration__label">
            <span className="inspiration__checkbox">○</span>
            <span className="inspiration__inspired">Inspired</span>
          </div>
        </div>
      </TemplateSlot>
    </section>
  )
}
