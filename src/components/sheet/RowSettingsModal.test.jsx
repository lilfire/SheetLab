import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RowSettingsModal, { ROW_STEP_MM, ROW_MAX_MM } from './RowSettingsModal.jsx'

function setup(overrides = {}) {
  const onChange = vi.fn()
  const onClose = vi.fn()
  render(
    <RowSettingsModal
      row={2}
      isEmpty={false}
      initialMm={40}
      minHeight={null}
      onChange={onChange}
      onClose={onClose}
      {...overrides}
    />,
  )
  return { onChange, onClose }
}

describe('RowSettingsModal', () => {
  it('renders with the given row number', () => {
    setup()
    expect(screen.getByText(/row 2 settings/i)).toBeInTheDocument()
  })

  it('shows Min height label when row is not empty', () => {
    setup({ isEmpty: false })
    expect(screen.getByText(/min height/i)).toBeInTheDocument()
  })

  it('shows Height label when row is empty', () => {
    setup({ isEmpty: true, initialMm: 0 })
    const labels = screen.getAllByText(/height/i)
    expect(labels.length).toBeGreaterThan(0)
  })

  it('clicking increase calls onChange with +step', async () => {
    const user = userEvent.setup()
    const { onChange } = setup({ initialMm: 40, minHeight: 40 })
    await user.click(screen.getByLabelText(/increase row height/i))
    expect(onChange).toHaveBeenCalledWith(2, { minHeight: 40 + ROW_STEP_MM })
  })

  it('clicking decrease clamps to minMm', async () => {
    const user = userEvent.setup()
    const { onChange } = setup({ initialMm: 40, minHeight: 40 })
    await user.click(screen.getByLabelText(/decrease row height/i))
    // Already at minMm — onChange should not be called (button disabled)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('clamps value to ROW_MAX_MM', async () => {
    const user = userEvent.setup()
    const { onChange } = setup({ isEmpty: true, initialMm: 0, minHeight: ROW_MAX_MM })
    // Already at max - increase is disabled
    expect(screen.getByLabelText(/increase row height/i)).toBeDisabled()
    await user.click(screen.getByLabelText(/decrease row height/i))
    expect(onChange).toHaveBeenCalledWith(2, { minHeight: ROW_MAX_MM - ROW_STEP_MM })
  })

  it('Reset to default sets minHeight to null and closes', async () => {
    const user = userEvent.setup()
    const { onChange, onClose } = setup({ minHeight: 80 })
    await user.click(screen.getByRole('button', { name: /reset to default/i }))
    expect(onChange).toHaveBeenCalledWith(2, { minHeight: null })
    expect(onClose).toHaveBeenCalled()
  })

  it('Reset to default is disabled when already default', () => {
    setup({ minHeight: null })
    expect(screen.getByRole('button', { name: /reset to default/i })).toBeDisabled()
  })

  it('close button calls onClose', async () => {
    const user = userEvent.setup()
    const { onClose } = setup()
    await user.click(screen.getByRole('button', { name: '✕' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('Escape key closes the modal', async () => {
    const user = userEvent.setup()
    const { onClose } = setup()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
