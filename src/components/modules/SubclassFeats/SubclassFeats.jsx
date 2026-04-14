import TemplateSlot from '../../template/TemplateSlot.jsx'
import './SubclassFeats.css'

export default function SubclassFeats({ character, preset, settings = {} }) {
  const subclass = preset?.modules?.subclassFeats
  const title = subclass?.title ?? 'Subclass Feats'
  const slots = settings.lineCount ?? subclass?.slots ?? 8

  return (
    <section className="module-box subclass-feats">
      <TemplateSlot name="subclass-feats:header" character={character} preset={preset} title={title}>
        <h3 className="section-header">{title}</h3>
      </TemplateSlot>
      <TemplateSlot name="subclass-feats:list" character={character} preset={preset} slots={slots}>
        <ul className="subclass-feats__list">
          {[...Array(slots)].map((_, i) => (
            <li key={i} className="subclass-feats__slot">
              <span className="subclass-feats__index">{i + 1}.</span>
              <span className="write-line" />
            </li>
          ))}
        </ul>
      </TemplateSlot>
    </section>
  )
}
