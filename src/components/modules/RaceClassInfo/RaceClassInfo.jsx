import TemplateSlot from '../../template/TemplateSlot.jsx'
import './RaceClassInfo.css'

export default function RaceClassInfo({ character, preset, settings = {} }) {
  const headerParts = [
    ...(settings.showRace !== false ? ['Race'] : []),
    ...(settings.showClass !== false || settings.showSubclass !== false ? ['Class'] : []),
    ...(settings.showLevel !== false || settings.showExperience !== false || settings.showProficiencyBonus !== false ? ['Experience'] : []),
  ]
  const headerText = headerParts.length === 0
    ? 'Character Info'
    : headerParts.length === 1
      ? headerParts[0]
      : headerParts.slice(0, -1).join(', ') + ' & ' + headerParts[headerParts.length - 1]

  // Extra-fields container: force-show if any toggled true, force-hide if all false, else defer to CSS
  const anyExtraTrue = settings.showBackgroundAlignment === true || settings.showCharacterFeatures === true || settings.showCharacterTraits === true
  const allExtraFalse = settings.showBackgroundAlignment === false && settings.showCharacterFeatures === false && settings.showCharacterTraits === false
  const extraFieldsStyle = anyExtraTrue
    ? { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px 8px', marginTop: '4px' }
    : allExtraFalse
      ? { display: 'none' }
      : undefined

  return (
    <section className="module-box race-class-info">
      <TemplateSlot name="race-class-info:header" character={character} preset={preset} settings={settings}>
        <h3 className="section-header">{headerText}</h3>
      </TemplateSlot>
      <TemplateSlot name="race-class-info:main-fields" character={character} preset={preset} settings={settings}>
        <div className="race-class-info__fields">
          {settings.showRace !== false && (
            <fieldset className="race-class-info__field">
              <label className="race-class-info__label">Race</label>
              <span className="write-line">{preset?.race ?? ''}</span>
            </fieldset>
          )}
          {settings.showClass !== false && (
            <fieldset className="race-class-info__field">
              <label className="race-class-info__label">Class</label>
              <span className="write-line">{preset?.class ?? ''}</span>
            </fieldset>
          )}
          {settings.showSubclass !== false && (
            <fieldset className="race-class-info__field">
              <label className="race-class-info__label">Subclass</label>
              <span className="write-line" />
            </fieldset>
          )}
          {settings.showLevel !== false && (
            <fieldset className="race-class-info__field">
              <label className="race-class-info__label">Level</label>
              <span className="write-line" />
            </fieldset>
          )}
          {settings.showExperience !== false && (
            <fieldset className="race-class-info__field">
              <label className="race-class-info__label">Experience</label>
              <span className="write-line" />
            </fieldset>
          )}
          {settings.showProficiencyBonus !== false && (
            <fieldset className="race-class-info__field">
              <label className="race-class-info__label">Proficiency Bonus</label>
              <span className="write-line" />
            </fieldset>
          )}
        </div>
      </TemplateSlot>
      <TemplateSlot name="race-class-info:extra-fields" character={character} preset={preset} settings={settings}>
        <div className="race-class-info__extra-fields" style={extraFieldsStyle}>
          {settings.showBackgroundAlignment !== false && (
            <fieldset className="race-class-info__field">
              <label className="race-class-info__label">Background &amp; Alignment</label>
              <span className="write-line" />
            </fieldset>
          )}
          {settings.showCharacterFeatures !== false && (
            <fieldset className="race-class-info__field">
              <label className="race-class-info__label">Character Features</label>
              <span className="write-line" />
            </fieldset>
          )}
          {settings.showCharacterTraits !== false && (
            <fieldset className="race-class-info__field">
              <label className="race-class-info__label">Character Traits</label>
              <span className="write-line" />
            </fieldset>
          )}
        </div>
      </TemplateSlot>
    </section>
  )
}
