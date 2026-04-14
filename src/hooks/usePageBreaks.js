import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'

const PAGE_HEIGHT_MM = 297
const PAGE_PADDING_MM = 8
const SAFETY_MARGIN_MM = 2 // prevent edge-case overflow from subpixel rounding
const USABLE_HEIGHT_MM = PAGE_HEIGHT_MM - 2 * PAGE_PADDING_MM - SAFETY_MARGIN_MM // 279mm

function getGridRowStart(el) {
  if (el.style.gridRowStart) return parseInt(el.style.gridRowStart, 10)
  if (el.style.gridArea) return parseInt(el.style.gridArea.split('/')[0].trim(), 10)
  const v = getComputedStyle(el).gridRowStart
  return v && v !== 'auto' ? parseInt(v, 10) : NaN
}

function getGridRowEnd(el) {
  if (el.style.gridRowEnd) return parseInt(el.style.gridRowEnd, 10)
  if (el.style.gridArea) {
    const parts = el.style.gridArea.split('/')
    return parts[2] ? parseInt(parts[2].trim(), 10) : NaN
  }
  const v = getComputedStyle(el).gridRowEnd
  return v && v !== 'auto' ? parseInt(v, 10) : NaN
}

/**
 * Fallback when layout can't be measured (e.g., jsdom): put all modules on one page.
 */
function singlePageFallback(grid) {
  const modules = grid.querySelectorAll('[data-module-key]')
  let maxRow = 0
  for (const el of modules) {
    const end = getGridRowEnd(el)
    if (!Number.isNaN(end)) maxRow = Math.max(maxRow, end - 1)
  }
  return maxRow > 0
    ? { pages: [{ startRow: 1, endRow: maxRow }], trackSizesMm: [] }
    : { pages: [], trackSizesMm: [] }
}

/**
 * Given a measurement grid, compute which rows belong on which page.
 * Returns an array of { startRow, endRow } (1-based, inclusive).
 */
function computePages(grid, sheet) {
  const pxPerMm = sheet.offsetWidth / 210
  if (pxPerMm <= 0) {
    // Can't compute pixel dimensions (e.g., jsdom) — single-page fallback
    return singlePageFallback(grid)
  }

  const gridGap = parseFloat(getComputedStyle(grid).rowGap) || 0
  const gridPadTop = parseFloat(getComputedStyle(grid).paddingTop) || 0
  const gridPadBot = parseFloat(getComputedStyle(grid).paddingBottom) || 0
  const usableHeightPx = USABLE_HEIGHT_MM * pxPerMm - gridPadTop - gridPadBot

  // Read resolved track sizes from the browser
  const trackStr = getComputedStyle(grid).gridTemplateRows
  const tracks = trackStr.split(/\s+/).map(t => parseFloat(t)).filter(n => !Number.isNaN(n))

  // Fallback when tracks can't be measured (e.g., jsdom)
  if (tracks.length === 0) return singlePageFallback(grid)

  const trackSizesMm = tracks.map(px => Math.max(0, Math.round(px / pxPerMm)))

  // Collect module row spans for cross-page detection
  const modules = grid.querySelectorAll('[data-module-key]')
  const moduleSpans = []
  for (const el of modules) {
    const start = getGridRowStart(el)
    const end = getGridRowEnd(el)
    if (!Number.isNaN(start) && !Number.isNaN(end)) {
      moduleSpans.push({ start, end: end - 1 }) // CSS grid end is exclusive
    }
  }

  // Greedy row walk: accumulate heights per page
  function buildPages() {
    const pages = []
    let cumHeight = 0
    let pageStart = 1

    for (let r = 0; r < tracks.length; r++) {
      const rowNum = r + 1
      const gap = rowNum === pageStart ? 0 : gridGap

      if (cumHeight + gap + tracks[r] > usableHeightPx && cumHeight > 0) {
        pages.push({ startRow: pageStart, endRow: rowNum - 1 })
        pageStart = rowNum
        cumHeight = tracks[r]
      } else {
        cumHeight += gap + tracks[r]
      }
    }
    pages.push({ startRow: pageStart, endRow: tracks.length })
    return pages
  }

  let pages = buildPages()

  // Fix multi-row spanning modules that cross page boundaries.
  // If a module starts on page N and ends on page N+1, push it entirely
  // to page N+1 by ending page N before the module's start row.
  for (let pass = 0; pass < 5; pass++) {
    let adjusted = false

    for (const span of moduleSpans) {
      const startPage = pages.findIndex(
        p => span.start >= p.startRow && span.start <= p.endRow
      )
      const endPage = pages.findIndex(
        p => span.end >= p.startRow && span.end <= p.endRow
      )

      if (startPage !== -1 && endPage !== -1 && startPage !== endPage) {
        const newEndRow = span.start - 1
        if (newEndRow >= pages[startPage].startRow) {
          pages[startPage].endRow = newEndRow

          // Rebuild all pages after the split point
          const remaining = []
          let cumH = 0
          let pStart = span.start
          for (let r = span.start - 1; r < tracks.length; r++) {
            const rowNum = r + 1
            const gap = rowNum === pStart ? 0 : gridGap
            if (cumH + gap + tracks[r] > usableHeightPx && cumH > 0) {
              remaining.push({ startRow: pStart, endRow: rowNum - 1 })
              pStart = rowNum
              cumH = tracks[r]
            } else {
              cumH += gap + tracks[r]
            }
          }
          remaining.push({ startRow: pStart, endRow: tracks.length })
          pages = [...pages.slice(0, startPage + 1), ...remaining]
          adjusted = true
          break // restart span check with updated pages
        }
      }
    }

    if (!adjusted) break
  }

  return {
    pages: pages.filter(p => p.startRow <= p.endRow),
    trackSizesMm,
  }
}

export default function usePageBreaks(gridRef, sheetRef, deps = []) {
  const [pages, setPages] = useState(null)
  const rafId = useRef(null)
  const mounted = useRef(false)
  const trackSizesRef = useRef(null)
  const printingRef = useRef(false)

  const measure = useCallback(() => {
    const grid = gridRef.current
    const sheet = sheetRef.current
    if (!grid || !sheet) return

    const result = computePages(grid, sheet)
    trackSizesRef.current = result.trackSizesMm
    setPages(result.pages)
  }, [gridRef, sheetRef])

  // When pages is null (measurement mode), measure and compute pages.
  // Runs every render but short-circuits when pages is already set.
  useLayoutEffect(() => {
    if (pages !== null) return
    measure()
  })

  // When deps change, reset to measurement mode (skip initial mount —
  // the effect above already handles the first measurement).
  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    setPages(null)
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  // Window resize → re-measure (page dimensions change).
  // Suppressed during print — window.print() triggers a viewport resize
  // that would switch back to the measurement grid, destroying the
  // per-page layout that the print engine needs.
  useEffect(() => {
    let timer
    const handleResize = () => {
      if (printingRef.current) return
      clearTimeout(timer)
      timer = setTimeout(() => setPages(null), 100)
    }
    const handleBeforePrint = () => {
      printingRef.current = true
      clearTimeout(timer)
    }
    const handleAfterPrint = () => { printingRef.current = false }

    window.addEventListener('resize', handleResize)
    window.addEventListener('beforeprint', handleBeforePrint)
    window.addEventListener('afterprint', handleAfterPrint)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('beforeprint', handleBeforePrint)
      window.removeEventListener('afterprint', handleAfterPrint)
      clearTimeout(timer)
    }
  }, [])

  // Font loading → re-measure (text heights may change)
  useEffect(() => {
    document.fonts.ready.then(() => {
      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => {
        if (!printingRef.current) setPages(null)
      })
    })
    return () => cancelAnimationFrame(rafId.current)
  }, [])

  return { pages, trackSizes: trackSizesRef.current }
}
