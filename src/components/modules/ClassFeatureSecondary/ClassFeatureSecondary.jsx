import TemplateSlot from '../../template/TemplateSlot.jsx'
import './ClassFeatureSecondary.css'

export default function ClassFeatureSecondary({ character, preset }) {
  const feature = preset?.modules?.classFeatureSecondary

  return (
    <section className="module-box class-feature-secondary">
      <TemplateSlot name="class-feature-secondary:header" character={character} preset={preset}>
        <h3 className="section-header">Class Feature (Secondary)</h3>
      </TemplateSlot>
      <TemplateSlot name="class-feature-secondary:list" character={character} preset={preset} feature={feature}>
        <>
          <div className="class-feature-secondary__content">
            <p className="class-feature-secondary__title">{feature?.title ?? 'Secondary Feature'}</p>
            <p className="class-feature-secondary__description">{feature?.description ?? 'Select a class to populate this feature.'}</p>
          </div>
          <div className="class-feature-secondary__usage">
            <div className="class-feature-secondary__usage-header">
              <span className="class-feature-secondary__usage-col">Used</span>
              <span className="class-feature-secondary__usage-col">DMG</span>
              <span className="class-feature-secondary__usage-col">Total</span>
            </div>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="class-feature-secondary__usage-row">
                <span className="pen-checkbox">○</span>
                <span className="write-line" />
                <span className="write-line" />
              </div>
            ))}
          </div>
          <div className="class-feature-secondary__notes">
            <span className="write-line" />
          </div>
        </>
      </TemplateSlot>
    </section>
  )
}
