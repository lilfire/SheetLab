import { useDraggable, useDroppable } from '@dnd-kit/core'
import styles from './SheetPreview.module.css'

/**
 * DraggableModule — wraps a single sheet module slot with drag-and-drop support.
 *
 * Props:
 *   id          — module key (unique, used as dnd id)
 *   areaClass   — CSS module class name for position/outline styles
 *   gridArea    — current CSS grid-area value (from layoutConfig)
 *   colSpan     — number of grid columns to span (default 1)
 *   isEditMode  — whether edit mode is active; shows drag handle when true
 *   onRemove    — called when the remove button is clicked
 *   onColSpan   — called with (delta) to adjust column span
 *   children    — the module component to render inside
 */
export default function DraggableModule({ id, areaClass, gridArea, colSpan, isEditMode, onRemove, onColSpan, children }) {
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({ id })
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id })

  const transformStyle = transform
    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
    : undefined

  const style = {
    gridArea,
    ...(colSpan > 1 && { gridColumn: `span ${colSpan}` }),
    ...(transformStyle && { transform: transformStyle, zIndex: 20 }),
    ...(isDragging && { opacity: 0.45 }),
    ...(isOver && isEditMode && { boxShadow: '0 0 0 2px #8b6914' }),
  }

  return (
    <div
      ref={(el) => { setDragRef(el); setDropRef(el) }}
      style={style}
      className={styles[areaClass]}
    >
      {isEditMode && (
        <>
          <button
            type="button"
            className={`no-print ${styles.dragHandle}`}
            {...attributes}
            {...listeners}
            aria-label="Drag to rearrange module"
          >
            ⠿
          </button>
          <div className={`no-print ${styles.spanControls}`}>
            <button
              type="button"
              className={styles.spanBtn}
              onClick={() => onColSpan(-1)}
              disabled={colSpan <= 1}
              aria-label="Decrease column span"
            >
              −
            </button>
            <span className={styles.spanLabel}>{colSpan}</span>
            <button
              type="button"
              className={styles.spanBtn}
              onClick={() => onColSpan(1)}
              disabled={colSpan >= 3}
              aria-label="Increase column span"
            >
              +
            </button>
          </div>
        </>
      )}
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
