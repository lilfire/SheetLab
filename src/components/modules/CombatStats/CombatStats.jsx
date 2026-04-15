import TemplateSlot from '../../template/TemplateSlot.jsx'
import './CombatStats.css'

const STATS = [
  { key: 'ac', label: 'Armor Class' },
  { key: 'speed', label: 'Speed' },
  { key: 'init', label: 'Initiative' },
  { key: 'prof', label: 'Prof. Bonus' },
]

export default function CombatStats({ character }) {
  return (
    <section className="module-box combat-stats">
      <TemplateSlot name="combat-stats:header" character={character}>
        <h3 className="section-header">Combat Stats</h3>
      </TemplateSlot>
      <TemplateSlot name="combat-stats:row" character={character}>
        <div className="combat-stats__row">
          {STATS.map(({ key, label }) => (
            <TemplateSlot key={key} name="combat-stats:stat" stat={key} label={label} character={character}>
              <div className="combat-stats__stat">
                <div className="combat-stats__circle">
                  <span className="combat-stats__value" aria-label={label} />
                </div>
                <span className="combat-stats__label">{label}</span>
              </div>
            </TemplateSlot>
          ))}
        </div>
      </TemplateSlot>
    </section>
  )
}
