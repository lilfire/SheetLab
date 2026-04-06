import { useLayoutEffect, useRef, useState, useCallback } from 'react'

const PAGE_HEIGHT_MM = 297 // Full A4 height — @page margin is 0
const MAX_ITERATIONS = 5

/**
 * Measures module positions in the grid after render and:
 * 1. Applies marginTop to modules that would cross a page boundary
 * 2. Returns page break line positions for visual overlays
 *
 * @param {React.RefObject} gridRef  — ref to the .sheet-grid element
 * @param {React.RefObject} sheetRef — ref to the .sheet element
 * @param {Array} deps               — extra dependencies to trigger re-measurement
 * @returns {{ pageBreakLines: Array<{ yPx: number, pageNumber: number }> }}
 */
export default function usePageBreaks(gridRef, sheetRef, deps = []) {
  const [pageBreakLines, setPageBreakLines] = useState([])
  const rafId = useRef(null)

  const measure = useCallback(() => {
    const grid = gridRef.current
    const sheet = sheetRef.current
    if (!grid || !sheet) return

    const pxPerMm = sheet.offsetWidth / 210
    const pageHeightPx = PAGE_HEIGHT_MM * pxPerMm

    if (pageHeightPx <= 0) return

    const modules = grid.querySelectorAll('[data-module-key]')
    if (modules.length === 0) {
      setPageBreakLines([])
      return
    }

    // Reset all previously applied margins before measuring
    for (const el of modules) {
      el.style.marginTop = ''
    }

    // Iterative pass: measure → fix → re-measure
    for (let pass = 0; pass < MAX_ITERATIONS; pass++) {
      let adjusted = false

      // Track which grid rows we've already pushed so we don't double-push
      const pushedRows = new Set()

      // Sort modules by their visual position (top to bottom)
      const sorted = [...modules].sort(
        (a, b) => a.offsetTop - b.offsetTop
      )

      for (const el of sorted) {
        // Use sheet-absolute position (offsetParent is the sheet)
        const top = el.offsetTop
        const height = el.offsetHeight
        const bottom = top + height

        if (height <= 0) continue

        // Skip modules taller than a full page (can't fix those)
        if (height > pageHeightPx) continue

        // Find which page boundary this module crosses, if any
        const pageOfTop = Math.floor(top / pageHeightPx)
        const pageOfBottom = Math.floor((bottom - 1) / pageHeightPx)

        if (pageOfTop !== pageOfBottom) {
          const gridRow = el.style.gridRowStart
          if (pushedRows.has(gridRow)) continue
          pushedRows.add(gridRow)

          // Push module to the start of the next page
          const nextPageStart = (pageOfTop + 1) * pageHeightPx
          const currentMargin = parseFloat(el.style.marginTop) || 0
          const needed = nextPageStart - top + currentMargin
          el.style.marginTop = `${needed}px`
          adjusted = true
        }
      }

      if (!adjusted) break
    }

    // Compute page break line positions from the final sheet height
    const sheetHeight = sheet.scrollHeight
    const lines = []
    let boundary = pageHeightPx
    let page = 1
    while (boundary < sheetHeight) {
      lines.push({ yPx: boundary, pageNumber: page })
      boundary += pageHeightPx
      page++
    }

    setPageBreakLines(lines)
  }, [gridRef, sheetRef])

  // Primary measurement: runs synchronously after render (before paint)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    measure()
  }, [measure, ...deps])

  // Re-measure on content-driven size changes
  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    let debounceTimer = null
    const observer = new ResizeObserver(() => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(measure, 50)
    })
    observer.observe(grid)

    // Also re-measure after fonts finish loading
    document.fonts.ready.then(() => {
      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(measure)
    })

    return () => {
      observer.disconnect()
      clearTimeout(debounceTimer)
      cancelAnimationFrame(rafId.current)

      // Clean up applied margins
      const modules = grid.querySelectorAll('[data-module-key]')
      for (const el of modules) {
        el.style.marginTop = ''
      }
    }
  }, [gridRef, measure])

  return { pageBreakLines }
}
