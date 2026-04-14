import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'

describe('App', () => {
  it('shows the wizard on first load', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /choose your race/i })).toBeInTheDocument()
  })

  it('switches to the sheet preview when the wizard completes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /skip race & class/i }))
    await user.click(screen.getByRole('button', { name: /select two column template/i }))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await user.click(screen.getByRole('button', { name: /generate sheet/i }))
    expect(screen.getByRole('button', { name: /new character/i })).toBeInTheDocument()
  })

  it('returns to the wizard when New Character is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /skip race & class/i }))
    await user.click(screen.getByRole('button', { name: /select two column template/i }))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await user.click(screen.getByRole('button', { name: /generate sheet/i }))
    await user.click(screen.getByRole('button', { name: /new character/i }))
    expect(screen.getByRole('heading', { name: /choose your race/i })).toBeInTheDocument()
  })
})
