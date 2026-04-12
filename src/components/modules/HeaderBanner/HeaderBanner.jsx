import TemplateSlot from '../../template/TemplateSlot.jsx'
import './HeaderBanner.css'

export default function HeaderBanner({ character }) {
  return (
    <section className="module-box header-banner">
      <div className="header-banner__scroll">
        <TemplateSlot name="header:scroll-left" character={character}>
          <div className="header-banner__scroll-left" />
        </TemplateSlot>
        <TemplateSlot name="header:title" character={character}>
          <div className="header-banner__content">
            <p className="header-banner__label">Character Name</p>
            <span className="header-banner__name">{character?.name ?? ''}</span>
          </div>
        </TemplateSlot>
        <TemplateSlot name="header:scroll-right" character={character}>
          <div className="header-banner__scroll-right" />
        </TemplateSlot>
      </div>
    </section>
  )
}
