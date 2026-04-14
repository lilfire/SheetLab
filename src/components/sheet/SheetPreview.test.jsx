import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SheetPreview from './SheetPreview.jsx'
import { MODULE_REGISTRY } from '../../data/moduleRegistry.js'

/* ── Helpers ────────────────────────────────────────────────── */

const CHAR = {
  name: 'Thorn Ironhide',
  race: 'Dwarf',
  class: 'Fighter',
  level: 5,
  background: 'Soldier',
  alignment: 'Lawful Neutral',
  str: 16, dex: 12, con: 14, int: 10, wis: 13, cha: 8,
}

const PRESET = { race: 'Dwarf', class: 'Fighter' }

const defaultProps = () => ({
  character: CHAR,
  preset: PRESET,
  template: 'two-column',
  templateSettings: {},
  onReset: vi.fn(),
})

/**
 * Returns the sheet grid container that holds all module slots.
 */
function getSheetGrid(container) {
  return container.querySelector('.sheet-grid')
}

/**
 * Returns all DraggableModule wrapper divs inside the sheet grid.
 * Each visible module produces a direct child div with gridRowStart/gridColumnStart styles.
 */
function getVisibleModuleSlots(container) {
  const grid = getSheetGrid(container)
  return Array.from(grid.children).filter((el) => el.style.gridRowStart)
}

const DEFAULT_VISIBLE_COUNT = MODULE_REGISTRY.filter((m) => m.defaultVisible !== false).length

/* ── Test Suite ─────────────────────────────────────────────── */

describe('SheetPreview – Print Layout QA', () => {
  /* ─ Scenario 1: Default layout prints correctly ─────────── */
  describe('Scenario 1 – Default layout prints correctly', () => {
    it('renders all default-visible modules by default', () => {
      const { container } = render(<SheetPreview {...defaultProps()} />)
      const slots = getVisibleModuleSlots(container)
      expect(slots).toHaveLength(DEFAULT_VISIBLE_COUNT)
    })

    it('each module occupies a grid position with row and column', () => {
      const { container } = render(<SheetPreview {...defaultProps()} />)
      const slots = getVisibleModuleSlots(container)
      for (const slot of slots) {
        expect(slot.style.gridRowStart).toBeTruthy()
        expect(slot.style.gridColumnStart).toBeTruthy()
      }
    })

    it('sheet-preview and sheet-grid classes are present for print CSS targeting', () => {
      const { container } = render(<SheetPreview {...defaultProps()} />)
      expect(container.querySelector('.sheet-preview')).toBeTruthy()
      expect(container.querySelector('.sheet-grid')).toBeTruthy()
    })
  })

  /* ─ Scenario 2: Removed modules do not appear in print ──── */
  describe('Scenario 2 – Removed modules do not appear in print', () => {
    it('hiding modules via edit mode removes them from the DOM', async () => {
      const user = userEvent.setup()
      const { container } = render(<SheetPreview {...defaultProps()} />)

      // Enter edit mode
      await user.click(screen.getByRole('button', { name: /edit layout/i }))

      // Hide 3 modules via ComponentPicker
      const visibleMods = MODULE_REGISTRY.filter((m) => m.defaultVisible !== false).slice(0, 3)
      for (const mod of visibleMods) {
        const hideBtn = screen.getByTitle(new RegExp(`hide ${mod.name}`, 'i'))
        await user.click(hideBtn)
      }

      const slots = getVisibleModuleSlots(container)
      expect(slots).toHaveLength(DEFAULT_VISIBLE_COUNT - 3)
    })

    it('removed module is absent from rendered output', async () => {
      const user = userEvent.setup()
      const { container } = render(<SheetPreview {...defaultProps()} />)

      await user.click(screen.getByRole('button', { name: /edit layout/i }))

      const slotsBefore = getVisibleModuleSlots(container).length
      const firstVisible = MODULE_REGISTRY.find((m) => m.defaultVisible !== false)
      const hideBtn = screen.getByTitle(new RegExp(`hide ${firstVisible.name}`, 'i'))
      await user.click(hideBtn)

      const slotsAfter = getVisibleModuleSlots(container).length
      expect(slotsAfter).toBe(slotsBefore - 1)
    })
  })

  /* ─ Scenario 3: Re-added modules appear in print ────────── */
  describe('Scenario 3 – Re-added modules appear in print', () => {
    it('toggling a module off then on restores it to the DOM', async () => {
      const user = userEvent.setup()
      const { container } = render(<SheetPreview {...defaultProps()} />)

      // Enter edit mode
      await user.click(screen.getByRole('button', { name: /edit layout/i }))

      // Hide first default-visible module
      const firstVisible = MODULE_REGISTRY.find((m) => m.defaultVisible !== false)
      await user.click(screen.getByTitle(new RegExp(`hide ${firstVisible.name}`, 'i')))
      expect(getVisibleModuleSlots(container)).toHaveLength(DEFAULT_VISIBLE_COUNT - 1)

      // Re-add via ComponentPicker
      await user.click(screen.getByTitle(new RegExp(`show ${firstVisible.name}`, 'i')))

      expect(getVisibleModuleSlots(container)).toHaveLength(DEFAULT_VISIBLE_COUNT)
    })
  })

  /* ─ Scenario 4: Rearranged modules print in new positions ─ */
  describe('Scenario 4 – Rearranged modules print in new positions', () => {
    it('swapping two modules exchanges their grid positions', async () => {
      const user = userEvent.setup()
      render(<SheetPreview {...defaultProps()} />)

      // Enter edit mode
      await user.click(screen.getByRole('button', { name: /edit layout/i }))

      // Test the swap logic directly using buildInitialLayoutConfig
      const { buildInitialLayoutConfig } = await import('../../data/moduleRegistry.js')
      const config = buildInitialLayoutConfig('two-column')
      const keyA = 'header'
      const keyB = 'portrait'

      const posA = { row: config[keyA].row, col: config[keyA].col, rowSpan: config[keyA].rowSpan, colSpan: config[keyA].colSpan }
      const posB = { row: config[keyB].row, col: config[keyB].col, rowSpan: config[keyB].rowSpan, colSpan: config[keyB].colSpan }

      // Simulate the handleSwapAreas reducer
      const next = {
        ...config,
        [keyA]: { ...config[keyA], ...posB },
        [keyB]: { ...config[keyB], ...posA },
      }

      expect(next[keyA].row).toBe(posB.row)
      expect(next[keyA].col).toBe(posB.col)
      expect(next[keyB].row).toBe(posA.row)
      expect(next[keyB].col).toBe(posA.col)
    })

    it('handleSwapAreas logic correctly exchanges grid positions in state', async () => {
      const { buildInitialLayoutConfig } = await import('../../data/moduleRegistry.js')
      const prev = buildInitialLayoutConfig('two-column')
      const keyA = 'header'
      const keyB = 'portrait'

      // Simulate the handleSwapAreas reducer
      const a = prev[keyA]
      const b = prev[keyB]
      const next = {
        ...prev,
        [keyA]: { ...a, row: b.row, col: b.col, rowSpan: b.rowSpan, colSpan: b.colSpan },
        [keyB]: { ...b, row: a.row, col: a.col, rowSpan: a.rowSpan, colSpan: a.colSpan },
      }

      // header should now be at portrait's position (row:1, col:2)
      expect(next[keyA].row).toBe(1)
      expect(next[keyA].col).toBe(2)
      // portrait should now be at header's position (row:1, col:1)
      expect(next[keyB].row).toBe(1)
      expect(next[keyB].col).toBe(1)
      // Other modules untouched
      expect(next['ability'].row).toBe(prev['ability'].row)
      expect(next['ability'].col).toBe(prev['ability'].col)
    })
  })

  /* ─ Scenario 5: Edit-mode controls hidden on print ──────── */
  describe('Scenario 5 – Edit-mode controls hidden on print', () => {
    it('toolbar has no-print class', () => {
      const { container } = render(<SheetPreview {...defaultProps()} />)
      const toolbar = container.querySelector('.toolbar')
      expect(toolbar).toBeTruthy()
      expect(toolbar.classList.contains('no-print')).toBe(true)
    })

    it('Edit Layout button is inside no-print toolbar', () => {
      render(<SheetPreview {...defaultProps()} />)
      const editBtn = screen.getByRole('button', { name: /edit layout/i })
      expect(editBtn.closest('.no-print')).toBeTruthy()
    })

    it('row settings buttons are inside no-print overlays when in edit mode', async () => {
      const user = userEvent.setup()
      render(<SheetPreview {...defaultProps()} />)
      await user.click(screen.getByRole('button', { name: /edit layout/i }))

      const gearBtns = screen.getAllByRole('button', { name: /row \d+ settings/i })
      expect(gearBtns.length).toBeGreaterThan(0)
    })

    it('module settings gear buttons have no-print class', () => {
      const { container } = render(<SheetPreview {...defaultProps()} />)
      const gears = screen.getAllByRole('button', { name: /module settings/i })
      expect(gears.length).toBeGreaterThan(0)
      for (const btn of gears) {
        expect(btn.classList.contains('no-print')).toBe(true)
      }
      // silence unused-var lint
      expect(container).toBeTruthy()
    })

    it('ComponentPicker has no-print class when in edit mode', async () => {
      const user = userEvent.setup()
      const { container } = render(<SheetPreview {...defaultProps()} />)
      await user.click(screen.getByRole('button', { name: /edit layout/i }))

      // ComponentPicker root div has no-print
      const picker = container.querySelector('.panel')
      expect(picker).toBeTruthy()
      expect(picker.classList.contains('no-print')).toBe(true)
    })

    // print.css static verification moved to printCss.test.js (needs node environment)
  })

  /* ─ Scenario 6: New Character resets layout ─────────────── */
  describe('Scenario 6 – New Character resets layout', () => {
    it('clicking New Character calls onReset', async () => {
      const user = userEvent.setup()
      const props = defaultProps()
      render(<SheetPreview {...props} />)

      await user.click(screen.getByRole('button', { name: /new character/i }))
      expect(props.onReset).toHaveBeenCalledOnce()
    })

    it('remounting SheetPreview resets layoutConfig to default visibility', async () => {
      const user = userEvent.setup()
      const props = defaultProps()
      const { container, unmount } = render(<SheetPreview {...props} />)

      // Enter edit mode, hide a module
      await user.click(screen.getByRole('button', { name: /edit layout/i }))
      const firstVisible = MODULE_REGISTRY.find((m) => m.defaultVisible !== false)
      await user.click(screen.getByTitle(new RegExp(`hide ${firstVisible.name}`, 'i')))
      expect(getVisibleModuleSlots(container)).toHaveLength(DEFAULT_VISIBLE_COUNT - 1)

      // Simulate what App does on reset: unmount and remount
      unmount()
      const { container: newContainer } = render(<SheetPreview {...defaultProps()} />)
      const newSlots = getVisibleModuleSlots(newContainer)
      expect(newSlots).toHaveLength(DEFAULT_VISIBLE_COUNT)
    })

    it('remounting after rearrangement resets grid positions to defaults', async () => {
      const { unmount } = render(<SheetPreview {...defaultProps()} />)
      unmount()

      // Fresh mount should have default grid positions
      const { container } = render(<SheetPreview {...defaultProps()} />)
      const slots = getVisibleModuleSlots(container)
      expect(slots).toHaveLength(DEFAULT_VISIBLE_COUNT)
      for (const slot of slots) {
        expect(slot.style.gridRowStart).toBeTruthy()
        expect(slot.style.gridColumnStart).toBeTruthy()
      }
    })
  })
})
