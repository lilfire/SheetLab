/**
 * Reflow module positions after a layout change to eliminate overlaps.
 *
 * Algorithm:
 * 1. Collect visible modules, sorted by (row, col)
 * 2. Place the changed module first (it keeps its position)
 * 3. Place remaining modules one-by-one; push down on collision
 *
 * Modules are not compacted upward — empty rows are preserved so users can
 * lay out the sheet with deliberate gaps.
 */

function collides(a, b) {
  return (
    a.col < b.col + b.colSpan &&
    b.col < a.col + a.colSpan &&
    a.row < b.row + b.rowSpan &&
    b.row < a.row + a.rowSpan
  )
}

function collidesWithAny(mod, placed) {
  for (const p of placed) {
    if (collides(mod, p)) return true
  }
  return false
}

/**
 * @param {Object} layoutConfig - { [key]: { visible, row, col, rowSpan, colSpan, style } }
 * @param {string} changedKey - the module key that was just resized
 * @param {number} maxColumns - grid column count (2 or 3)
 * @returns {Object} new layoutConfig with adjusted row/col positions
 */
// eslint-disable-next-line no-unused-vars
export function reflowLayout(layoutConfig, changedKey, maxColumns) {
  // Collect visible modules
  const entries = Object.entries(layoutConfig)
    .filter(([, lc]) => lc.visible)
    .map(([key, lc]) => ({
      key,
      row: lc.row,
      col: lc.col,
      rowSpan: lc.rowSpan,
      colSpan: lc.colSpan,
    }))

  // Sort by (row, col) — top-left first
  entries.sort((a, b) => a.row - b.row || a.col - b.col)

  // Move changedKey to front so it gets priority placement
  const changedIdx = entries.findIndex((e) => e.key === changedKey)
  if (changedIdx > 0) {
    const [changed] = entries.splice(changedIdx, 1)
    entries.unshift(changed)
  }

  // Place modules one-by-one, pushing down on collision
  const placed = []
  for (const entry of entries) {
    const candidate = { ...entry }
    while (collidesWithAny(candidate, placed)) {
      candidate.row += 1
    }
    placed.push(candidate)
  }

  // Build new layoutConfig preserving non-position properties
  const result = { ...layoutConfig }
  for (const mod of placed) {
    const prev = layoutConfig[mod.key]
    result[mod.key] = { ...prev, row: mod.row, col: mod.col }
  }
  return result
}
