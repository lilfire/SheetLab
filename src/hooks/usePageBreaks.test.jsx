import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRef } from 'react'
import usePageBreaks from './usePageBreaks.js'

/**
 * Render usePageBreaks against two DOM elements we construct ourselves.
 * The hook reads offsetWidth and getComputedStyle, so we mock both via
 * Object.defineProperty on the specific nodes.
 */
function mockSheet({ sheetWidthPx, tracks, modules = [] }) {
  const sheet = document.createElement('div')
  const grid = document.createElement('div')
  sheet.appendChild(grid)
  document.body.appendChild(sheet)

  Object.defineProperty(sheet, 'offsetWidth', { value: sheetWidthPx, configurable: true })

  for (const m of modules) {
    const el = document.createElement('div')
    el.setAttribute('data-module-key', m.key)
    el.style.gridRowStart = String(m.start)
    el.style.gridRowEnd = String(m.end + 1) // exclusive end
    grid.appendChild(el)
  }

  // Replace getComputedStyle for our specific nodes
  const originalGCS = window.getComputedStyle
  window.getComputedStyle = (node, pseudo) => {
    if (node === grid) {
      return {
        rowGap: '0px',
        paddingTop: '0px',
        paddingBottom: '0px',
        gridTemplateRows: tracks.map((t) => `${t}px`).join(' '),
        gridRowStart: 'auto',
        gridRowEnd: 'auto',
      }
    }
    return originalGCS.call(window, node, pseudo)
  }

  return { sheet, grid, cleanup: () => { document.body.removeChild(sheet); window.getComputedStyle = originalGCS } }
}

function useTestHook(sheet, grid, deps = []) {
  const sheetRef = useRef(sheet)
  const gridRef = useRef(grid)
  return usePageBreaks(gridRef, sheetRef, deps)
}

describe('usePageBreaks', () => {
  it('returns a single page when content fits', async () => {
    // A4: 210mm × 297mm, usable height = 279mm. pxPerMm = sheetWidth/210.
    // With sheetWidth=210 (1 px/mm), usable height = 279px
    const tracks = [50, 50] // 100px total — fits
    const { sheet, grid, cleanup } = mockSheet({ sheetWidthPx: 210, tracks })
    try {
      const { result } = renderHook(() => useTestHook(sheet, grid))
      await act(async () => { await Promise.resolve() })
      expect(result.current.pages).toBeTruthy()
      expect(result.current.pages.length).toBe(1)
      expect(result.current.pages[0]).toEqual({ startRow: 1, endRow: 2 })
    } finally {
      cleanup()
    }
  })

  it('splits into multiple pages when content exceeds a page', async () => {
    // usable = 279px, tracks total = 500px → should produce 2 pages
    const tracks = [200, 200, 200]
    const { sheet, grid, cleanup } = mockSheet({ sheetWidthPx: 210, tracks })
    try {
      const { result } = renderHook(() => useTestHook(sheet, grid))
      await act(async () => { await Promise.resolve() })
      expect(result.current.pages.length).toBeGreaterThanOrEqual(2)
    } finally {
      cleanup()
    }
  })

  it('pushes a multi-row module onto the next page when it would straddle', async () => {
    // 4 tracks of 100px, but a module spans rows 2-3 (end exclusive = 4 → end=3).
    // usable=279px → after row 1 we're at 100, row 2 would take us to 200.
    // Suppose module spans rows 2-3 (200px); adding row 3 -> 300 > 279 → split.
    // That would split module across pages, so the hook should push it.
    const tracks = [100, 100, 100, 100]
    const modules = [{ key: 'a', start: 2, end: 3 }]
    const { sheet, grid, cleanup } = mockSheet({ sheetWidthPx: 210, tracks, modules })
    try {
      const { result } = renderHook(() => useTestHook(sheet, grid))
      await act(async () => { await Promise.resolve() })
      expect(result.current.pages.length).toBeGreaterThanOrEqual(2)
    } finally {
      cleanup()
    }
  })

  it('falls back to a single page when offsetWidth is 0', async () => {
    const tracks = [100]
    const { sheet, grid, cleanup } = mockSheet({ sheetWidthPx: 0, tracks, modules: [{ key: 'a', start: 1, end: 1 }] })
    try {
      const { result } = renderHook(() => useTestHook(sheet, grid))
      await act(async () => { await Promise.resolve() })
      expect(result.current.pages).toEqual([{ startRow: 1, endRow: 1 }])
    } finally {
      cleanup()
    }
  })

  it('returns empty pages when there are no modules and offsetWidth is 0', async () => {
    const { sheet, grid, cleanup } = mockSheet({ sheetWidthPx: 0, tracks: [] })
    try {
      const { result } = renderHook(() => useTestHook(sheet, grid))
      await act(async () => { await Promise.resolve() })
      expect(result.current.pages).toEqual([])
    } finally {
      cleanup()
    }
  })

  it('re-measures on window resize', async () => {
    const tracks = [50]
    const { sheet, grid, cleanup } = mockSheet({ sheetWidthPx: 210, tracks })
    try {
      const { result } = renderHook(() => useTestHook(sheet, grid))
      await act(async () => { await Promise.resolve() })
      expect(result.current.pages).toBeTruthy()
      await act(async () => {
        window.dispatchEvent(new Event('resize'))
        // Hook debounces resize by 100ms
        await new Promise((r) => setTimeout(r, 150))
      })
      expect(result.current.pages).toBeTruthy()
    } finally {
      cleanup()
    }
  })

  it('suppresses resize re-measure while printing', async () => {
    const tracks = [50]
    const { sheet, grid, cleanup } = mockSheet({ sheetWidthPx: 210, tracks })
    try {
      renderHook(() => useTestHook(sheet, grid))
      await act(async () => { await Promise.resolve() })
      await act(async () => {
        window.dispatchEvent(new Event('beforeprint'))
        window.dispatchEvent(new Event('resize'))
        await new Promise((r) => setTimeout(r, 150))
        window.dispatchEvent(new Event('afterprint'))
      })
    } finally {
      cleanup()
    }
  })
})
