import TemplateSlot from '../../template/TemplateSlot.jsx'
import './CharacterName.css'

export default function CharacterName({ character }) {
  return (
    <section className="module-box character-name">
      <div className="character-name__scroll">
        <TemplateSlot name="characterName:scroll-left" character={character}>
          <div className="character-name__scroll-left" />
        </TemplateSlot>
        <TemplateSlot name="characterName:title" character={character}>
          <div className="character-name__content">
            <p className="character-name__label">Character Name</p>
            <span className="character-name__name">{character?.name ?? ''}</span>
          </div>
        </TemplateSlot>
        <TemplateSlot name="characterName:scroll-right" character={character}>
          <div className="character-name__scroll-right" />
        </TemplateSlot>
      </div>
    </section>
  )
}
