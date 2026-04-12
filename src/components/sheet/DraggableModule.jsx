import { useDraggable, useDroppable } from '@dnd-kit/core'
import styles from './SheetPreview.module.css'

/**
 * DraggableModule — wraps a single sheet module slot with drag-and-drop support.
 *
 * Props:
 *   id          — module key (unique, used as dnd id)
 *   areaClass   — CSS module class name for position/outline styles
 *   row, col, rowSpan, colSpan — integer grid coordinates
 *   isEditMode  — whether edit mode is active; the entire module body is draggable when true
 *   onOpenSettings — called when the gear icon is clicked
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

function Icon({ children, size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
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

const GearIcon = () => (
  <Icon>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
)

export default function DraggableModule({
  id, areaClass, row, col, rowSpan, colSpan,
  isEditMode, onOpenSettings, styleOverrides = {}, hideHeader, children,
}) {
  const { listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({ id })
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
    ...cssVars,
    ...remainingOverrides,
    ...(isEditMode && { cursor: isDragging ? 'grabbing' : 'grab' }),
    ...(transformStyle && { transform: transformStyle, zIndex: 20 }),
    ...(isDragging && { opacity: 0.45 }),
    ...(isOver && isEditMode && { boxShadow: '0 0 0 2px #2563eb' }),
  }

  return (
    <div
      ref={(el) => { setDragRef(el); setDropRef(el) }}
      style={style}
      className={styles[areaClass]}
      data-module-key={id}
      {...(hideHeader ? { 'data-hide-header': '' } : {})}
      {...(isEditMode ? listeners : {})}
    >
      <button
        className={`no-print ${styles.settingsBtn}`}
        onClick={onOpenSettings}
        type="button"
        aria-label="Module settings"
        title="Module settings"
      >
        <GearIcon />
      </button>
      {children}
    </div>
  )
}
