import TemplateSlot from '../../template/TemplateSlot.jsx'
import './Proficiency.css'

export default function Proficiency({ character }) {
  return (
    <section className="module-box proficiency">
      <TemplateSlot name="proficiency:header" character={character}>
        <h3 className="section-header">Proficiencies</h3>
      </TemplateSlot>
      <TemplateSlot name="proficiency:list" character={character}>
        <div className="proficiency__grid">
          <fieldset className="proficiency__group">
            <legend className="proficiency__group-label">Armour</legend>
            <span className="write-line" />
          </fieldset>
          <fieldset className="proficiency__group">
            <legend className="proficiency__group-label">Weapons</legend>
            <span className="write-line" />
          </fieldset>
          <fieldset className="proficiency__group">
            <legend className="proficiency__group-label">Tools</legend>
            <span className="write-line" />
          </fieldset>
          <fieldset className="proficiency__group">
            <legend className="proficiency__group-label">Languages</legend>
            <span className="write-line" />
          </fieldset>
        </div>
      </TemplateSlot>
    </section>
  )
}
