import TemplateSlot from '../../template/TemplateSlot.jsx'
import './Notes.css'

export default function Notes({ character, settings = {} }) {
  return (
    <section className="module-box notes">
      <TemplateSlot name="notes:header" character={character}>
        <h3 className="section-header">Notes</h3>
      </TemplateSlot>
      <TemplateSlot name="notes:lines" character={character}>
        <div className="notes__lines">
          {[...Array(settings.lineCount ?? 10)].map((_, i) => (
            <div key={i} className="notes__line">
              <span className="write-line" />
            </div>
          ))}
        </div>
      </TemplateSlot>
    </section>
  )
}
