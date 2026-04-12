import TemplateSlot from '../../template/TemplateSlot.jsx'
import './Equipment.css'

export default function Equipment({ character, settings = {} }) {
  return (
    <section className="module-box equipment">
      <TemplateSlot name="equipment:header" character={character}>
        <h3 className="section-header">Equipment</h3>
      </TemplateSlot>
      {settings.showCarryingCapacity !== false && (
        <TemplateSlot name="equipment:capacity" character={character}>
          <div className="equipment__capacity">
            <span className="equipment__capacity-label">Carrying Capacity:</span>
            <span className="equipment__capacity-value" />
            <span className="equipment__unit">lbs</span>
          </div>
        </TemplateSlot>
      )}
      <TemplateSlot name="equipment:items" character={character}>
        <div className="equipment__list">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="equipment__item">
              <span className="write-line" />
            </div>
          ))}
        </div>
      </TemplateSlot>
    </section>
  )
}
