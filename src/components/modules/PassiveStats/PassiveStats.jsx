import TemplateSlot from '../../template/TemplateSlot.jsx'
import './PassiveStats.css'

export default function PassiveStats({ character, settings = {} }) {
  return (
    <section className="module-box passive-stats">
      <TemplateSlot name="passive-stats:header" character={character}>
        <h3 className="section-header">Passive Stats</h3>
      </TemplateSlot>
      <TemplateSlot name="passive-stats:list" character={character}>
        <div className="passive-stats__list">
          {settings.showPerception !== false && (
            <div className="passive-stats__stat">
              <span className="passive-stats__label">Passive Perception</span>
              <span className="passive-stats__value" />
            </div>
          )}
          {settings.showInvestigation !== false && (
            <div className="passive-stats__stat">
              <span className="passive-stats__label">Passive Investigation</span>
              <span className="passive-stats__value" />
            </div>
          )}
          {settings.showInsight !== false && (
            <div className="passive-stats__stat">
              <span className="passive-stats__label">Passive Insight</span>
              <span className="passive-stats__value" />
            </div>
          )}
        </div>
      </TemplateSlot>
    </section>
  )
}
