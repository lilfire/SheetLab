import TemplateSlot from '../../template/TemplateSlot.jsx'
import './ClassFeaturePrimary.css'

export default function ClassFeaturePrimary({ character, preset }) {
  const feature = preset?.modules?.classFeaturePrimary

  return (
    <section className="module-box class-feature-primary">
      <TemplateSlot name="class-feature-primary:header" character={character} preset={preset}>
        <h3 className="section-header">Class Feature (Primary)</h3>
      </TemplateSlot>
      <TemplateSlot name="class-feature-primary:list" character={character} preset={preset} feature={feature}>
        <>
          <div className="class-feature-primary__content">
            <p className="class-feature-primary__title">{feature?.title ?? 'Primary Feature'}</p>
            <p className="class-feature-primary__description">{feature?.description ?? 'Select a class to populate this feature.'}</p>
          </div>
          <div className="class-feature-primary__usage">
            <div className="class-feature-primary__usage-header">
              <span className="class-feature-primary__usage-col">Used</span>
              <span className="class-feature-primary__usage-col">DMG</span>
              <span className="class-feature-primary__usage-col">Total</span>
            </div>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="class-feature-primary__usage-row">
                <span className="pen-checkbox">○</span>
                <span className="write-line" />
                <span className="write-line" />
              </div>
            ))}
          </div>
          <div className="class-feature-primary__notes">
            <span className="write-line" />
          </div>
        </>
      </TemplateSlot>
    </section>
  )
}
