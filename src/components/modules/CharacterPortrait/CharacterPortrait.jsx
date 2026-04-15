import { useRef } from 'react'
import TemplateSlot from '../../template/TemplateSlot.jsx'
import './CharacterPortrait.css'

export default function CharacterPortrait({ character, settings = {}, imageSrc, onImageChange }) {
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onImageChange(reader.result)
    reader.readAsDataURL(file)
  }

  const effectiveRatio = settings.aspectRatio || '4/2'
  const showMask = settings.showMask === true && effectiveRatio === '4/2'

  return (
    <section className="module-box character-portrait">
      <h3 className="section-header">Portrait</h3>
      <TemplateSlot name="portrait:frame" character={character} settings={settings}>
        <div
          className={`character-portrait__frame${showMask ? ' character-portrait--masked' : ''}`}
          onClick={() => inputRef.current?.click()}
          style={settings.aspectRatio ? { aspectRatio: settings.aspectRatio } : undefined}
        >
          <TemplateSlot name="portrait:image" character={character} settings={settings} imageSrc={imageSrc}>
            {imageSrc ? (
              <img src={imageSrc} alt="Character portrait" className="character-portrait__image" />
            ) : (
              <div className="character-portrait__placeholder">
                <span className="character-portrait__icon">⚔</span>
                <p className="character-portrait__hint">Tap to upload image</p>
              </div>
            )}
          </TemplateSlot>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="no-print character-portrait__file-input"
            aria-label="Upload character portrait"
            onChange={handleFile}
          />
        </div>
      </TemplateSlot>
    </section>
  )
}
