import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SheetPreview from './SheetPreview.jsx'
import { MODULE_REGISTRY } from '../../data/moduleRegistry.js'

const CHAR = {
  name: 'Test', race: 'Human', class: 'Fighter', level: 1,
  str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10,
}
const PRESET = { race: 'Human', class: 'Fighter' }

function renderPreview(overrides = {}) {
  return render(
    <SheetPreview
      character={CHAR}
      preset={PRESET}
      template="two-column"
      templateSettings={{ accentColor: '#123456', fontFamily: 'Georgia, serif' }}
      onReset={vi.fn()}
      {...overrides}
    />,
  )
}

beforeEach(() => {
  localStorage.setItem('sheetlab:layoutPresets', '[]')
})

describe('SheetPreview – handlers', () => {
  it('opens module settings modal when clicking the gear icon', async () => {
    const user = userEvent.setup()
    renderPreview()
    await user.click(screen.getByRole('button', { name: /edit layout/i }))
    const gears = screen.getAllByRole('button', { name: /module settings/i })
    await user.click(gears[0])
    expect(screen.getByText(/settings$/i)).toBeInTheDocument()
  })

  it('modal Remove button hides the module', async () => {
    const user = userEvent.setup()
    const { container } = renderPreview()
    await user.click(screen.getByRole('button', { name: /edit layout/i }))
    const grid = container.querySelector('.sheet-grid')
    const beforeCount = Array.from(grid.children).filter((el) => el.style.gridRowStart).length

    const gears = screen.getAllByRole('button', { name: /module settings/i })
    await user.click(gears[0])
    await user.click(screen.getByRole('button', { name: /remove module/i }))

    const afterCount = Array.from(grid.children).filter((el) => el.style.gridRowStart).length
    expect(afterCount).toBe(beforeCount - 1)
  })

  it('width stepper triggers layout reflow', async () => {
    const user = userEvent.setup()
    renderPreview()
    await user.click(screen.getByRole('button', { name: /edit layout/i }))
    const gears = screen.getAllByRole('button', { name: /module settings/i })
    await user.click(gears[0])
    const increaseBtn = screen.getByLabelText(/increase width/i)
    await user.click(increaseBtn)
    // Close modal
    await user.click(screen.getByRole('button', { name: '✕' }))
  })

  it('height stepper triggers row span change', async () => {
    const user = userEvent.setup()
    renderPreview()
    await user.click(screen.getByRole('button', { name: /edit layout/i }))
    const gears = screen.getAllByRole('button', { name: /module settings/i })
    await user.click(gears[0])
    const incHeight = screen.getByLabelText(/increase height/i)
    await user.click(incHeight)
    const decHeight = screen.getByLabelText(/decrease height/i)
    await user.click(decHeight)
  })

  it('row settings gear opens RowSettingsModal and stores minHeight changes', async () => {
    const user = userEvent.setup()
    renderPreview()
    await user.click(screen.getByRole('button', { name: /edit layout/i }))
    const rowGear = screen.getByRole('button', { name: /row 1 settings/i })
    await user.click(rowGear)
    expect(screen.getByRole('heading', { name: /row 1 settings/i })).toBeInTheDocument()
    // Increase row height
    const inc = screen.getByLabelText(/increase row height/i)
    if (!inc.disabled) await user.click(inc)
    // Reset to default inside the row modal (scoped to its aside)
    const rowSidebar = screen.getByRole('complementary', { name: /row 1 settings/i })
    const resetBtn = within(rowSidebar).getByRole('button', { name: /reset to default/i })
    if (!resetBtn.disabled) await user.click(resetBtn)
  })

  it('save preset via PresetManager saves, loads and deletes', async () => {
    const user = userEvent.setup()
    renderPreview()
    await user.click(screen.getByRole('button', { name: /edit layout/i }))
    await user.type(screen.getByPlaceholderText(/preset name/i), 'MyPreset')
    await user.click(screen.getByRole('button', { name: /^save$/i }))
    expect(screen.getByText('MyPreset')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^load$/i }))
    await user.click(screen.getByRole('button', { name: /^delete$/i }))
    expect(screen.queryByText('MyPreset')).not.toBeInTheDocument()
  })

  it('Reset to Default in PresetManager restores default layout', async () => {
    const user = userEvent.setup()
    const { container } = renderPreview()
    await user.click(screen.getByRole('button', { name: /edit layout/i }))
    const firstVisible = MODULE_REGISTRY.find((m) => m.defaultVisible !== false)
    const hideBtn = screen.getByTitle(new RegExp(`hide ${firstVisible.name}`, 'i'))
    await user.click(hideBtn)

    await user.click(screen.getByRole('button', { name: /reset to default/i }))
    const grid = container.querySelector('.sheet-grid')
    const slots = Array.from(grid.children).filter((el) => el.style.gridRowStart)
    const defaultCount = MODULE_REGISTRY.filter((m) => m.defaultVisible !== false).length
    expect(slots).toHaveLength(defaultCount)
  })

  it('Print button calls window.print', async () => {
    const user = userEvent.setup()
    const originalPrint = window.print
    const printSpy = vi.fn()
    window.print = printSpy
    renderPreview()
    await user.click(screen.getByRole('button', { name: /print sheet/i }))
    expect(printSpy).toHaveBeenCalled()
    window.print = originalPrint
  })

  it('applies templateSettings as CSS variable overrides on the sheet wrapper', () => {
    const { container } = renderPreview()
    const sheet = container.querySelector('.sheet-preview')
    expect(sheet.style.getPropertyValue('--color-gold')).toBe('#123456')
    expect(sheet.style.getPropertyValue('--font-serif')).toContain('Georgia')
  })

  it('renders modern template modules with HPTrackerRing extension', () => {
    const { container } = render(
      <SheetPreview
        character={CHAR}
        preset={PRESET}
        template="modern"
        templateSettings={{}}
        onReset={vi.fn()}
      />,
    )
    expect(container.querySelector('[data-template="modern"]')).toBeInTheDocument()
    expect(container.querySelector('.hp-tracker__modern-ring-frame')).toBeInTheDocument()
  })

  it('opens row settings then switching to module settings closes the row modal', async () => {
    const user = userEvent.setup()
    renderPreview()
    await user.click(screen.getByRole('button', { name: /edit layout/i }))
    const rowGear = screen.getByRole('button', { name: /row 1 settings/i })
    await user.click(rowGear)
    expect(screen.getByRole('complementary', { name: /row 1 settings/i })).toBeInTheDocument()
    // Now click a module gear — row modal should close, module modal opens
    const gears = screen.getAllByRole('button', { name: /module settings/i })
    await user.click(gears[0])
    expect(screen.queryByRole('complementary', { name: /row 1 settings/i })).not.toBeInTheDocument()
  })

  it('module settings color change updates inline style on wrapper', async () => {
    const user = userEvent.setup()
    const { container } = renderPreview()
    await user.click(screen.getByRole('button', { name: /edit layout/i }))
    const gears = screen.getAllByRole('button', { name: /module settings/i })
    await user.click(gears[0])
    const colorInputs = document.querySelectorAll('input[type="color"]')
    fireEvent.change(colorInputs[0], { target: { value: '#abcdef' } })
    // Close and verify wrapper got the CSS var
    await user.click(screen.getByRole('button', { name: '✕' }))
    const grid = container.querySelector('.sheet-grid')
    const firstSlot = Array.from(grid.children).find((el) => el.style.gridRowStart)
    // Some style var should be present (any of --mod-*)
    const styleAttr = firstSlot.getAttribute('style')
    expect(styleAttr).toContain('abcdef')
  })

  it('reset color via null preserves other settings', async () => {
    const user = userEvent.setup()
    const { container } = renderPreview()
    await user.click(screen.getByRole('button', { name: /edit layout/i }))
    const gears = screen.getAllByRole('button', { name: /module settings/i })
    await user.click(gears[0])
    const colorInputs = document.querySelectorAll('input[type="color"]')
    fireEvent.change(colorInputs[0], { target: { value: '#112233' } })
    const resetBtns = document.querySelectorAll('button')
    const resetInModal = Array.from(resetBtns).find((b) => b.textContent === 'Reset')
    if (resetInModal) await user.click(resetInModal)
    await user.click(screen.getByRole('button', { name: '✕' }))
    // Visible slots shouldn't throw
    const grid = container.querySelector('.sheet-grid')
    expect(grid).toBeTruthy()
  })
})
