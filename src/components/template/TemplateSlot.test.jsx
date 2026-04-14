import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TemplateSlot from './TemplateSlot.jsx'
import { TemplateExtensionsContext } from './TemplateExtensionsContext.jsx'

describe('TemplateSlot', () => {
  it('renders children when no extension is present', () => {
    render(<TemplateSlot name="x">default</TemplateSlot>)
    expect(screen.getByText('default')).toBeInTheDocument()
  })

  it('renders children when extensions context is null', () => {
    render(
      <TemplateExtensionsContext.Provider value={null}>
        <TemplateSlot name="x">default</TemplateSlot>
      </TemplateExtensionsContext.Provider>,
    )
    expect(screen.getByText('default')).toBeInTheDocument()
  })

  it('renders the override component when provided in the extensions context', () => {
    const Override = ({ children }) => <div data-testid="override">{children}-OVERRIDE</div>
    render(
      <TemplateExtensionsContext.Provider value={{ mySlot: Override }}>
        <TemplateSlot name="mySlot">base</TemplateSlot>
      </TemplateExtensionsContext.Provider>,
    )
    expect(screen.getByTestId('override')).toHaveTextContent('base-OVERRIDE')
  })

  it('passes extra props (excluding name) to the override component', () => {
    const Override = ({ tag }) => <div data-testid="override">tag:{tag}</div>
    render(
      <TemplateExtensionsContext.Provider value={{ mySlot: Override }}>
        <TemplateSlot name="mySlot" tag="hello">base</TemplateSlot>
      </TemplateExtensionsContext.Provider>,
    )
    expect(screen.getByTestId('override')).toHaveTextContent('tag:hello')
  })
})
