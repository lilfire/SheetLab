import { useState, useRef } from 'react'
import defaultStyles from './CharacterPortrait.module.css'
import modernStyles from './CharacterPortrait.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'
import { cx } from '../../../utils/cx'

const TEMPLATE_MAP = { modern: modernStyles }

export default function CharacterPortrait({ templateId, settings = {} }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
  const [imageSrc, setImageSrc] = useState(null)
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageSrc(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <section className={cx('module-box', styles.moduleBox, styles.portrait)}>
      <h3 className={cx('section-header', styles.sectionHeader)}>Portrait</h3>
      <div
        className={styles.frame}
        onClick={() => inputRef.current?.click()}
        style={settings.aspectRatio ? { aspectRatio: settings.aspectRatio } : undefined}
      >
        {imageSrc ? (
          <img src={imageSrc} alt="Character portrait" className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.icon}>⚔</span>
            <p className={styles.hint}>Tap to upload image</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className={cx('no-print', styles.fileInput)}
          aria-label="Upload character portrait"
          onChange={handleFile}
        />
      </div>
    </section>
  )
}
