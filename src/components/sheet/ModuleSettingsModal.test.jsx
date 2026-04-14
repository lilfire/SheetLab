import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModuleSettingsModal from './ModuleSettingsModal.jsx'
import { getDefaultSettings } from '../../data/moduleSettings.js'

function setup(moduleKey = 'header', overrides = {}) {
  const onSettingsChange = vi.fn()
  const onColSpan = vi.fn()
  const onRowSpan = vi.fn()
  const onRemove = vi.fn()
  const onClose = vi.fn()
  render(
    <ModuleSettingsModal
      moduleKey={moduleKey}
      moduleName="Header"
      settings={{ ...getDefaultSettings(moduleKey) }}
      colSpan={1}
      rowSpan={1}
      maxColumns={2}
      onSettingsChange={onSettingsChange}
      onColSpan={onColSpan}
      onRowSpan={onRowSpan}
      onRemove={onRemove}
      onClose={onClose}
      {...overrides}
    />,
  )
  return { onSettingsChange, onColSpan, onRowSpan, onRemove, onClose }
}

describe('ModuleSettingsModal', () => {
  it('renders the module name in the title', () => {
    setup()
    expect(screen.getByText(/header settings/i)).toBeInTheDocument()
  })

  it('close button triggers onClose', async () => {
    const user = userEvent.setup()
    const { onClose } = setup()
    await user.click(screen.getByRole('button', { name: '✕' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('Escape closes the modal', async () => {
    const user = userEvent.setup()
    const { onClose } = setup()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('remove button calls onRemove and onClose', async () => {
    const user = userEvent.setup()
    const { onRemove, onClose } = setup('header')
    await user.click(screen.getByRole('button', { name: /remove module/i }))
    expect(onRemove).toHaveBeenCalledWith('header')
    expect(onClose).toHaveBeenCalled()
  })

  it('Increase/Decrease width triggers onColSpan', async () => {
    const user = userEvent.setup()
    const { onColSpan } = setup('header', { colSpan: 1 })
    await user.click(screen.getByLabelText(/increase width/i))
    expect(onColSpan).toHaveBeenCalledWith('header', 1)
    // decrease disabled at colSpan=1
    expect(screen.getByLabelText(/decrease width/i)).toBeDisabled()
  })

  it('Decrease width works when colSpan > 1', async () => {
    const user = userEvent.setup()
    const { onColSpan } = setup('header', { colSpan: 2 })
    await user.click(screen.getByLabelText(/decrease width/i))
    expect(onColSpan).toHaveBeenCalledWith('header', -1)
  })

  it('Increase width disabled when colSpan === maxColumns', () => {
    setup('header', { colSpan: 2, maxColumns: 2 })
    expect(screen.getByLabelText(/increase width/i)).toBeDisabled()
  })

  it('Increase/Decrease height triggers onRowSpan', async () => {
    const user = userEvent.setup()
    const { onRowSpan } = setup('header', { rowSpan: 2 })
    await user.click(screen.getByLabelText(/increase height/i))
    expect(onRowSpan).toHaveBeenCalledWith('header', 1)
    await user.click(screen.getByLabelText(/decrease height/i))
    expect(onRowSpan).toHaveBeenCalledWith('header', -1)
  })

  it('toggle controls call onSettingsChange with the picked option', async () => {
    const user = userEvent.setup()
    const { onSettingsChange } = setup('header')
    // showHeader toggle has On/Off/Auto
    const onBtn = screen.getAllByRole('radio', { name: /^on$/i })[0]
    await user.click(onBtn)
    expect(onSettingsChange).toHaveBeenCalledWith('header', { showHeader: true })
  })

  it('number stepper increases and decreases line count', async () => {
    const user = userEvent.setup()
    const { onSettingsChange } = setup('notes', { settings: { ...getDefaultSettings('notes'), lineCount: 5 } })
    await user.click(screen.getByLabelText(/increase lines/i))
    expect(onSettingsChange).toHaveBeenCalledWith('notes', { lineCount: 6 })
    await user.click(screen.getByLabelText(/decrease lines/i))
    expect(onSettingsChange).toHaveBeenCalledWith('notes', { lineCount: 4 })
  })

  it('select controls dispatch value change', async () => {
    const user = userEvent.setup()
    const { onSettingsChange } = setup('portrait')
    const select = screen.getAllByRole('combobox')[0]
    await user.selectOptions(select, '1/1')
    expect(onSettingsChange).toHaveBeenCalledWith('portrait', expect.objectContaining({ aspectRatio: '1/1' }))
  })

  it('color input change passes the new value', () => {
    const { onSettingsChange } = setup('header')
    const colorInputs = document.querySelectorAll('input[type="color"]')
    expect(colorInputs.length).toBeGreaterThan(0)
    fireEvent.change(colorInputs[0], { target: { value: '#abcdef' } })
    expect(onSettingsChange).toHaveBeenCalled()
  })

  it('color alpha slider dispatches value change', () => {
    const { onSettingsChange } = setup('header')
    const rangeInputs = document.querySelectorAll('input[type="range"]')
    expect(rangeInputs.length).toBeGreaterThan(0)
    fireEvent.change(rangeInputs[0], { target: { value: '50' } })
    expect(onSettingsChange).toHaveBeenCalled()
  })
})
