import { useEffect } from 'react'
import styles from './ModuleSettingsModal.module.css'

function StepperIcon({ children }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const MinusIcon = () => (
  <StepperIcon>
    <path d="M5 12h14" />
  </StepperIcon>
)

const PlusIcon = () => (
  <StepperIcon>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </StepperIcon>
)

export const ROW_MAX_MM = 280
export const ROW_STEP_MM = 5

/**
 * RowSettingsModal — edits per-row minimum height.
 *
 * For empty rows the value is the literal row height (0 collapses it).
 * For rows containing modules, the minimum is the module's natural height
 * (captured at open time as initialMm) and the user can only grow the row.
 */
export default function RowSettingsModal({
  row, isEmpty, initialMm, minHeight, onChange, onClose,
}) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const minMm = isEmpty ? 0 : initialMm
  const effective = Math.max(minMm, minHeight ?? initialMm)

  function setValue(next) {
    const clamped = Math.min(ROW_MAX_MM, Math.max(minMm, next))
    onChange(row, { minHeight: clamped })
  }

  return (
    <aside className={`no-print ${styles.sidebar}`} aria-label={`Row ${row} settings`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Row {row} Settings</h3>
        <button type="button" className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>
      <div className={styles.fieldList}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>
            {isEmpty ? 'Height' : 'Min height'}
          </span>
          <div className={styles.stepper}>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={() => setValue(effective - ROW_STEP_MM)}
              disabled={effective <= minMm}
              aria-label="Decrease row height"
            >
              <MinusIcon />
            </button>
            <span className={styles.stepperLabel}>{effective}mm</span>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={() => setValue(effective + ROW_STEP_MM)}
              disabled={effective >= ROW_MAX_MM}
              aria-label="Increase row height"
            >
              <PlusIcon />
            </button>
          </div>
        </div>
        <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
          {isEmpty
            ? 'Empty row — set an exact height from 0mm (collapsed) up to a full page.'
            : `Floor is the current module height (${initialMm}mm). Grow the row to leave space above/below its modules.`}
        </p>
      </div>
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.dangerBtn}
          onClick={() => { onChange(row, { minHeight: null }); onClose() }}
          disabled={minHeight == null}
          style={minHeight == null ? { opacity: 0.4, cursor: 'default' } : undefined}
        >
          Reset to default
        </button>
      </div>
    </aside>
  )
}
