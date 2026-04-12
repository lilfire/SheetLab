import TemplateSlot from '../../template/TemplateSlot.jsx'
import './RaceClassTraits.css'

export default function RaceClassTraits({ character, preset }) {
  const traits = preset?.raceTraits ?? []

  return (
    <section className="module-box race-class-traits">
      <TemplateSlot name="race-class-traits:header" character={character} preset={preset}>
        <h3 className="section-header">Race &amp; Class Traits</h3>
      </TemplateSlot>
      <TemplateSlot name="race-class-traits:list" character={character} preset={preset} traits={traits}>
        <ul className="race-class-traits__list">
          {traits.length > 0
            ? traits.map((trait, i) => (
                <li key={i} className="race-class-traits__trait">{trait}</li>
              ))
            : <li className="race-class-traits__placeholder">Select race and class to see traits</li>
          }
          {[...Array(Math.max(0, 6 - traits.length))].map((_, i) => (
            <li key={`blank-${i}`} className="race-class-traits__blank">
              <span className="write-line" />
            </li>
          ))}
        </ul>
      </TemplateSlot>
    </section>
  )
}
