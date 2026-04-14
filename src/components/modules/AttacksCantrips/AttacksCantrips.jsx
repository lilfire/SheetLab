import TemplateSlot from '../../template/TemplateSlot.jsx'
import './AttacksCantrips.css'

export default function AttacksCantrips({ character, settings = {} }) {
  return (
    <section className="module-box attacks-cantrips">
      <TemplateSlot name="attacks-cantrips:header" character={character}>
        <h3 className="section-header">Attacks &amp; Cantrips</h3>
      </TemplateSlot>
      <TemplateSlot name="attacks-cantrips:table" character={character}>
        <table className="attacks-cantrips__table">
          <thead>
            <tr>
              <th className="attacks-cantrips__th">Name</th>
              <th className="attacks-cantrips__th">Range</th>
              <th className="attacks-cantrips__th">Hit/DC</th>
              <th className="attacks-cantrips__th">Action</th>
              <th className="attacks-cantrips__th">Damage</th>
              <th className="attacks-cantrips__th">Notes</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(settings.lineCount ?? 5)].map((_, i) => (
              <tr key={i} className="attacks-cantrips__row">
                <td><span className="write-line" /></td>
                <td><span className="write-line" /></td>
                <td><span className="write-line" /></td>
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
