import { TEMPLATES } from '../../templates/index.js'
import styles from './StepTemplate.module.css'

export default function StepTemplate({ characterClass, race, onSelect, onBack }) {
  return (
    <div className={styles.step}>
      <h2 className={styles.heading}>Choose a Template</h2>
      <p className={styles.hint}>
        <strong>{race}</strong> — <strong>{characterClass}</strong>. Pick a sheet layout.
      </p>
      <div className={styles.grid}>
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            className={styles.card}
            onClick={() => onSelect(tpl.id)}
            type="button"
            aria-label={`Select ${tpl.name} template`}
          >
            <div
              className={styles.thumbnail}
              aria-hidden="true"
              style={{ backgroundColor: tpl.settings.backgroundColor }}
            >
              {tpl.layout === 'two-column' ? (
                <div className={styles.thumbTwoCol}>
                  <div className={styles.thumbCol} />
                  <div className={styles.thumbCol} />
                </div>
              ) : (
                <div className={styles.thumbThreeCol}>
                  <div className={styles.thumbCol} />
                  <div className={styles.thumbCol} />
                  <div className={styles.thumbCol} />
                </div>
              )}
            </div>
            <span className={styles.templateName}>{tpl.name}</span>
            <span className={styles.templateDesc}>{tpl.description}</span>
          </button>
        ))}
      </div>
      <button className={styles.backBtn} onClick={onBack} type="button">
        ← Back
      </button>
    </div>
  )
}
