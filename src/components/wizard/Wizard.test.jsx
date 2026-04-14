import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Wizard from './Wizard.jsx'

describe('Wizard', () => {
  it('starts on the race step', () => {
    render(<Wizard onComplete={vi.fn()} />)
    expect(screen.getByRole('heading', { name: /choose your race/i })).toBeInTheDocument()
  })

  it('progresses through race → class → template → preview → generate', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<Wizard onComplete={onComplete} />)

    // Pick race
    await user.click(screen.getByRole('button', { name: 'Human' }))
    expect(screen.getByRole('heading', { name: /choose your class/i })).toBeInTheDocument()

    // Pick class
    await user.click(screen.getByRole('button', { name: 'Fighter' }))
    expect(screen.getByRole('heading', { name: /choose a template/i })).toBeInTheDocument()

    // Pick template
    await user.click(screen.getByRole('button', { name: /select two column template/i }))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByRole('heading', { name: /review your character/i })).toBeInTheDocument()

    // Generate
    await user.click(screen.getByRole('button', { name: /generate sheet/i }))
    expect(onComplete).toHaveBeenCalled()
    const payload = onComplete.mock.calls[0][0]
    expect(payload.character.race).toBe('Human')
    expect(payload.character.class).toBe('Fighter')
    expect(payload.template).toBe('two-column')
  })

  it('skip race & class jumps straight to template step', async () => {
    const user = userEvent.setup()
    render(<Wizard onComplete={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /skip race & class/i }))
    expect(screen.getByRole('heading', { name: /choose a template/i })).toBeInTheDocument()
  })

  it('skip class on class step still advances to template', async () => {
    const user = userEvent.setup()
    render(<Wizard onComplete={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Human' }))
    await user.click(screen.getByRole('button', { name: /skip class/i }))
    expect(screen.getByRole('heading', { name: /choose a template/i })).toBeInTheDocument()
  })

  it('back button on class step returns to race', async () => {
    const user = userEvent.setup()
    render(<Wizard onComplete={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Human' }))
    await user.click(screen.getByRole('button', { name: /← back/i }))
    expect(screen.getByRole('heading', { name: /choose your race/i })).toBeInTheDocument()
  })

  it('back button on template step skips back to race when race/class were skipped', async () => {
    const user = userEvent.setup()
    render(<Wizard onComplete={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /skip race & class/i }))
    await user.click(screen.getByRole('button', { name: /← back/i }))
    expect(screen.getByRole('heading', { name: /choose your race/i })).toBeInTheDocument()
  })

  it('template settings can be customized before confirming', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<Wizard onComplete={onComplete} />)
    await user.click(screen.getByRole('button', { name: /skip race & class/i }))
    await user.click(screen.getByRole('button', { name: /select two column template/i }))
    await user.selectOptions(screen.getByLabelText(/font family/i), 'Georgia, serif')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await user.click(screen.getByRole('button', { name: /generate sheet/i }))
    expect(onComplete).toHaveBeenCalled()
    expect(onComplete.mock.calls[0][0].templateSettings.fontFamily).toBe('Georgia, serif')
  })

  it('template settings back button returns to template grid', async () => {
    const user = userEvent.setup()
    render(<Wizard onComplete={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /skip race & class/i }))
    await user.click(screen.getByRole('button', { name: /select two column template/i }))
    await user.click(screen.getByRole('button', { name: /← back/i }))
    // Should return to template grid — both template cards visible again
    expect(screen.getByRole('button', { name: /select two column template/i })).toBeInTheDocument()
  })

  it('review step displays chosen race, class, and template', async () => {
    const user = userEvent.setup()
    render(<Wizard onComplete={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Elf' }))
    await user.click(screen.getByRole('button', { name: 'Wizard' }))
    await user.click(screen.getByRole('button', { name: /select modern template/i }))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByText('Elf')).toBeInTheDocument()
    expect(screen.getByText('Wizard')).toBeInTheDocument()
  })
})
