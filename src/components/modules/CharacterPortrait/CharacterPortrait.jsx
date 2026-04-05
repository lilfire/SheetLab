import styles from './CharacterPortrait.module.css'

export default function CharacterPortrait({ templateId }) {
  return (
    <section className={`module-box ${styles.portrait} ${templateId ? (styles[templateId] || '') : ''}`}>
      <h3 className="section-header">Portrait</h3>
      <div className={styles.frame}>
        <div className={styles.placeholder}>
          <span className={styles.icon}>⚔</span>
          <p className={styles.hint}>Tap to upload image</p>
        </div>
        <input
          type="file"
          accept="image/*"
          className={styles.fileInput}
          aria-label="Upload character portrait"
        />
      </div>
    </section>
  )
}
