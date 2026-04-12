import TemplateSlot from '../../template/TemplateSlot.jsx'
import './AbilitiesFeatures.css'

export default function AbilitiesFeatures({ character }) {
  return (
    <section className="module-box abilities-features">
      <TemplateSlot name="abilities-features:header" character={character}>
        <h3 className="section-header">Abilities &amp; Features</h3>
      </TemplateSlot>
      <TemplateSlot name="abilities-features:list" character={character}>
        <table className="abilities-features__table">
          <thead>
            <tr>
              <th className="abilities-features__th">Name</th>
              <th className="abilities-features__th">Source</th>
              <th className="abilities-features__th">Description</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, i) => (
              <tr key={i} className="abilities-features__row">
                <td><span className="write-line" /></td>
                <td><span className="write-line" /></td>
                <td><span className="write-line" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TemplateSlot>
    </section>
  )
}
