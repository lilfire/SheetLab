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
 *   children    — the module component to render inside
 */
export default function DraggableModule({
  id, areaClass, row, col, rowSpan, colSpan,
  maxColumns, isEditMode, onRemove, onColSpan, children,
}) {
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({ id })
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id })

  const transformStyle = transform
    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
    : undefined

  const style = {
    gridRowStart: row,
    gridRowEnd: row + rowSpan,
    gridColumnStart: col,
    gridColumnEnd: col + colSpan,
    overflow: 'hidden',
    ...(transformStyle && { transform: transformStyle, zIndex: 20 }),
    ...(isDragging && { opacity: 0.45 }),
    ...(isOver && isEditMode && { boxShadow: '0 0 0 2px #8b6914' }),
  }

  const canShrink = colSpan > 1
  const canGrow = col + colSpan <= maxColumns

  return (
    <div
      ref={(el) => { setDragRef(el); setDropRef(el) }}
      style={style}
      className={styles[areaClass]}
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
