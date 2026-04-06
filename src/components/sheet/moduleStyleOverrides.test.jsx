import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildInitialLayoutConfig, MODULE_REGISTRY } from '../../data/moduleRegistry.js'
import DraggableModule from './DraggableModule.jsx'

/* ── buildInitialLayoutConfig ───────────────────────────────── */

describe('buildInitialLayoutConfig – style field', () => {
  it('includes style:{} for every module when no initialStyles provided', () => {
    const config = buildInitialLayoutConfig()
    for (const mod of MODULE_REGISTRY) {
      expect(config[mod.key]).toHaveProperty('style')
      expect(config[mod.key].style).toEqual({})
    }
  })

  it('applies provided initialStyles to matching module keys', () => {
    const initialStyles = {
      header: { backgroundColor: '#ff0000', borderColor: '#000000', borderStyle: 'solid', borderWidth: '2px' },
      ability: { backgroundColor: '#00ff00' },
    }
    const config = buildInitialLayoutConfig(initialStyles)

    expect(config.header.style).toEqual({
      backgroundColor: '#ff0000',
      borderColor: '#000000',
      borderStyle: 'solid',
      borderWidth: '2px',
    })
    expect(config.ability.style).toEqual({ backgroundColor: '#00ff00' })
  })

  it('leaves style:{} for modules not present in initialStyles', () => {
    const config = buildInitialLayoutConfig({ header: { backgroundColor: '#ff0000' } })
    expect(config.portrait.style).toEqual({})
    expect(config.combat.style).toEqual({})
  })

  it('preserves visible and gridArea fields alongside style', () => {
    const config = buildInitialLayoutConfig()
    for (const mod of MODULE_REGISTRY) {
      expect(config[mod.key].visible).toBe(true)
      expect(config[mod.key].gridArea).toBe(mod.gridArea)
      expect(config[mod.key].style).toBeDefined()
    }
  })
})

/* ── DraggableModule styleOverrides ────────────────────────── */

describe('DraggableModule – styleOverrides prop', () => {
  const baseProps = {
    id: 'ability',
    areaClass: 'abilityArea',
    gridArea: 'ability',
    isEditMode: false,
    onRemove: vi.fn(),
  }

  it('applies backgroundColor from styleOverrides to wrapper div', () => {
    const { container } = render(
      <DraggableModule {...baseProps} styleOverrides={{ backgroundColor: '#ff0000' }}>
        <span>content</span>
      </DraggableModule>
    )
    const wrapper = container.firstChild
    expect(wrapper.style.backgroundColor).toBe('rgb(255, 0, 0)')
  })

  it('applies border properties from styleOverrides', () => {
    const { container } = render(
      <DraggableModule
        {...baseProps}
        styleOverrides={{ borderColor: '#0000ff', borderStyle: 'dashed', borderWidth: '2px' }}
      >
        <span>content</span>
      </DraggableModule>
    )
    const wrapper = container.firstChild
    expect(wrapper.style.borderColor).toBe('rgb(0, 0, 255)')
    expect(wrapper.style.borderStyle).toBe('dashed')
    expect(wrapper.style.borderWidth).toBe('2px')
  })

  it('applies no extra styles when styleOverrides is empty', () => {
    const { container } = render(
      <DraggableModule {...baseProps} styleOverrides={{}}>
        <span>content</span>
      </DraggableModule>
    )
    const wrapper = container.firstChild
    expect(wrapper.style.backgroundColor).toBe('')
    expect(wrapper.style.borderStyle).toBe('')
  })

  it('applies no extra styles when styleOverrides is omitted', () => {
    const { container } = render(
      <DraggableModule {...baseProps}>
        <span>content</span>
      </DraggableModule>
    )
    const wrapper = container.firstChild
    expect(wrapper.style.backgroundColor).toBe('')
  })
})

/* ── SheetPreview initialModuleStyles integration ───────────── */

import SheetPreview from './SheetPreview.jsx'

const CHAR = {
  name: 'Test',
  race: 'Human',
  class: 'Fighter',
  level: 1,
  background: 'Soldier',
  alignment: 'Neutral',
  str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10,
}
const PRESET = { race: 'Human', class: 'Fighter' }

describe('SheetPreview – initialModuleStyles', () => {
  it('applies backgroundColor override to the header module wrapper', () => {
    const { container } = render(
      <SheetPreview
        character={CHAR}
        preset={PRESET}
        template="two-column"
        templateSettings={{}}
        initialModuleStyles={{ header: { backgroundColor: '#aabbcc' } }}
        onReset={vi.fn()}
      />
    )
    const grid = container.querySelector('.sheet-grid')
    const headerSlot = Array.from(grid.children).find((el) => el.style.gridArea === 'header')
    expect(headerSlot).toBeTruthy()
    expect(headerSlot.style.backgroundColor).toBe('rgb(170, 187, 204)')
  })

  it('modules without overrides have no backgroundColor inline style', () => {
    const { container } = render(
      <SheetPreview
        character={CHAR}
        preset={PRESET}
        template="two-column"
        templateSettings={{}}
        initialModuleStyles={{ header: { backgroundColor: '#ff0000' } }}
        onReset={vi.fn()}
      />
    )
    const grid = container.querySelector('.sheet-grid')
    const portraitSlot = Array.from(grid.children).find((el) => el.style.gridArea === 'portrait')
    expect(portraitSlot).toBeTruthy()
    expect(portraitSlot.style.backgroundColor).toBe('')
  })

  it('style is preserved when module is toggled off and back on', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <SheetPreview
        character={CHAR}
        preset={PRESET}
        template="two-column"
        templateSettings={{}}
        initialModuleStyles={{ header: { backgroundColor: '#ff0000' } }}
        onReset={vi.fn()}
      />
    )

    // Enter edit mode
    await user.click(screen.getByRole('button', { name: /edit layout/i }))

    // Remove header module
    const removeBtns = screen.getAllByRole('button', { name: /remove module/i })
    await user.click(removeBtns[0])

    // Re-add via ComponentPicker
    const toggleBtn = screen.getByTitle(new RegExp(`show ${MODULE_REGISTRY[0].name}`, 'i'))
    await user.click(toggleBtn)

    // Check that the style is preserved
    const grid = container.querySelector('.sheet-grid')
    const headerSlot = Array.from(grid.children).find((el) => el.style.gridArea === 'header')
    expect(headerSlot).toBeTruthy()
    expect(headerSlot.style.backgroundColor).toBe('rgb(255, 0, 0)')
  })
})
