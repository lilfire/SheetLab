import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PresetManager from './PresetManager.jsx'

function setup(presets = []) {
  const onSave = vi.fn()
  const onLoad = vi.fn()
  const onDelete = vi.fn()
  const onResetToDefault = vi.fn()
  render(
    <PresetManager
      presets={presets}
      onSave={onSave}
      onLoad={onLoad}
      onDelete={onDelete}
      onResetToDefault={onResetToDefault}
    />,
  )
  return { onSave, onLoad, onDelete, onResetToDefault }
}

describe('PresetManager', () => {
  it('shows empty message when there are no presets', () => {
    setup([])
    expect(screen.getByText(/no saved presets/i)).toBeInTheDocument()
  })

  it('Save button disabled when name is empty', () => {
    setup([])
    expect(screen.getByRole('button', { name: /^save$/i })).toBeDisabled()
  })

  it('saves when clicking Save after entering a name', async () => {
    const user = userEvent.setup()
    const { onSave } = setup([])
    const input = screen.getByPlaceholderText(/preset name/i)
    await user.type(input, 'Cool Layout')
    await user.click(screen.getByRole('button', { name: /^save$/i }))
    expect(onSave).toHaveBeenCalledWith('Cool Layout')
  })

  it('saves when pressing Enter in the name input', async () => {
    const user = userEvent.setup()
    const { onSave } = setup([])
    await user.type(screen.getByPlaceholderText(/preset name/i), 'Via Enter{Enter}')
    expect(onSave).toHaveBeenCalledWith('Via Enter')
  })

  it('does not save blank/whitespace-only names', async () => {
    const user = userEvent.setup()
    const { onSave } = setup([])
    await user.type(screen.getByPlaceholderText(/preset name/i), '   ')
    // button stays disabled for whitespace
    expect(screen.getByRole('button', { name: /^save$/i })).toBeDisabled()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('lists presets and supports Load/Delete', async () => {
    const user = userEvent.setup()
    const { onLoad, onDelete } = setup([
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
    ])
    await user.click(screen.getAllByRole('button', { name: /^load$/i })[1])
    expect(onLoad).toHaveBeenCalledWith({ id: '2', name: 'B' })
    await user.click(screen.getAllByRole('button', { name: /^delete$/i })[0])
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('invokes onResetToDefault when clicking Reset', async () => {
    const user = userEvent.setup()
    const { onResetToDefault } = setup([])
    await user.click(screen.getByRole('button', { name: /reset to default/i }))
    expect(onResetToDefault).toHaveBeenCalled()
  })
})
