import { useDraggable, useDroppable } from '@dnd-kit/core'
import styles from './SheetPreview.module.css'

/**
 * DraggableModule — wraps a single sheet module slot with drag-and-drop support.
 *
 * Props:
 *   id          — module key (unique, used as dnd id)
 *   areaClass   — CSS module class name for position/outline styles
 *   row, col, rowSpan, colSpan — integer grid coordinates
 *   maxColumns  — max columns in the grid (for clamping colSpan)
 *   isEditMode  — whether edit mode is active; shows drag handle when true
 *   onRemove    — called when the remove button is clicked
 *   onColSpan   — called with (key, delta) to adjust column span
 *   styleOverrides — optional CSS style object (background, border, etc.)
 *   children    — the module component to render inside
 */
// Map style override keys to CSS custom properties that .module-box can read
const STYLE_TO_CSS_VAR = {
  backgroundColor: '--mod-bg',
  borderColor: '--mod-border-color',
  textColor: '--mod-text',
  headingColor: '--mod-heading',
  accentColor: '--mod-accent',
  mutedColor: '--mod-muted',
  borderStyle: '--mod-border-style',
  borderWidth: '--mod-border-width',
}

export default function DraggableModule({
  id, areaClass, row, col, rowSpan, colSpan,
  maxColumns, isEditMode, onRemove, onColSpan, onColShift, onRowSpan,
  onOpenSettings, styleOverrides = {}, children,
}) {
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({ id })
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id })

  const transformStyle = transform
    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
    : undefined

  // Convert known style keys to CSS custom properties so they cascade to .module-box
  const cssVars = {}
  const remainingOverrides = {}
  for (const [k, v] of Object.entries(styleOverrides)) {
    if (STYLE_TO_CSS_VAR[k]) {
      cssVars[STYLE_TO_CSS_VAR[k]] = v
    } else {
      remainingOverrides[k] = v
    }
  }

  const style = {
    gridRowStart: row,
    gridRowEnd: row + rowSpan,
    gridColumnStart: col,
    gridColumnEnd: col + colSpan,
    overflow: 'hidden',
    ...cssVars,
    ...remainingOverrides,
    ...(transformStyle && { transform: transformStyle, zIndex: 20 }),
    ...(isDragging && { opacity: 0.45 }),
    ...(isOver && isEditMode && { boxShadow: '0 0 0 2px #8b6914' }),
  }

  const canShrink = colSpan > 1
  const canGrow = colSpan < maxColumns
  const canShiftLeft = col > 1
  const canShiftRight = col + colSpan - 1 < maxColumns
  const canShrinkRow = rowSpan > 1

  return (
    <div
      ref={(el) => { setDragRef(el); setDropRef(el) }}
      style={style}
      className={styles[areaClass]}
      data-module-key={id}
    >
      {isEditMode && (
        <button
          type="button"
          className={`no-print ${styles.dragHandle}`}
          {...attributes}
          {...listeners}
          aria-label="Drag to rearrange module"
        >
          ⠿
        </button>
      )}
      {isEditMode && (
        <div className={`no-print ${styles.colShiftControls}`}>
          <button
            type="button"
            className={styles.spanBtn}
            onClick={() => onColShift(id, -1)}
            disabled={!canShiftLeft}
            aria-label="Shift module left"
          >
            ◀
          </button>
          <span className={styles.spanLabel}>C{col}</span>
          <button
            type="button"
            className={styles.spanBtn}
            onClick={() => onColShift(id, 1)}
            disabled={!canShiftRight}
            aria-label="Shift module right"
          >
            ▶
          </button>
        </div>
      )}
      {isEditMode && (
        <div className={`no-print ${styles.spanControls}`}>
          <button
            type="button"
            className={styles.spanBtn}
            onClick={() => onColSpan(id, -1)}
            disabled={!canShrink}
            aria-label="Decrease column span"
          >
            −
          </button>
          <span className={styles.spanLabel}>{colSpan}/{maxColumns}</span>
          <button
            type="button"
            className={styles.spanBtn}
            onClick={() => onColSpan(id, 1)}
            disabled={!canGrow}
            aria-label="Increase column span"
          >
            +
          </button>
        </div>
      )}
      {isEditMode && (
        <div className={`no-print ${styles.rowSpanControls}`}>
          <button
            type="button"
            className={styles.spanBtn}
            onClick={() => onRowSpan(id, -1)}
            disabled={!canShrinkRow}
            aria-label="Decrease row span"
          >
            −
          </button>
          <span className={styles.spanLabel}>R{rowSpan}</span>
          <button
            type="button"
            className={styles.spanBtn}
            onClick={() => onRowSpan(id, 1)}
            aria-label="Increase row span"
          >
            +
          </button>
        </div>
      )}
      <button
        className={`no-print ${styles.settingsBtn}`}
        onClick={onOpenSettings}
        type="button"
        aria-label="Module settings"
      >
        ⚙
      </button>
      <button
        className={`no-print ${styles.removeBtn}`}
        onClick={onRemove}
        type="button"
        aria-label={`Remove module`}
      >
        ✕
      </button>
      {children}
    </div>
  )
}
