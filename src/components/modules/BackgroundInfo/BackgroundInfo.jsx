import TemplateSlot from '../../template/TemplateSlot.jsx'
import './BackgroundInfo.css'

export default function BackgroundInfo({ character }) {
  return (
    <section className="module-box background-info">
      <TemplateSlot name="background-info:header" character={character}>
        <h3 className="section-header">Background &amp; Personality</h3>
      </TemplateSlot>
      <div className="background-info__grid">
        <TemplateSlot name="background-info:background" character={character}>
          <fieldset className="background-info__field">
            <label className="background-info__label">Background</label>
            <span className="write-line" />
          </fieldset>
        </TemplateSlot>
        <TemplateSlot name="background-info:alignment" character={character}>
          <fieldset className="background-info__field">
            <label className="background-info__label">Alignment</label>
            <span className="write-line" />
          </fieldset>
        </TemplateSlot>
        <fieldset className="background-info__field background-info__field--wide">
          <label className="background-info__label">Personality Traits</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className="background-info__field">
          <label className="background-info__label">Ideals</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className="background-info__field">
          <label className="background-info__label">Bonds</label>
          <span className="write-line" />
        </fieldset>
        <fieldset className="background-info__field background-info__field--wide">
          <label className="background-info__label">Flaws</label>
          <span className="write-line" />
        </fieldset>
      </div>
    </section>
  )
}
