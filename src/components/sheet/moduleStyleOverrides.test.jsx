import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildInitialLayoutConfig, MODULE_REGISTRY } from '../../data/moduleRegistry.js'
import { hasModuleSettings, STYLE_SETTING_KEYS } from '../../data/moduleSettings.js'
import DraggableModule from './DraggableModule.jsx'

/* ── buildInitialLayoutConfig ───────────────────────────────── */

describe('buildInitialLayoutConfig – style field', () => {
  it('includes style:{} for every module', () => {
    const config = buildInitialLayoutConfig('two-column')
    for (const mod of MODULE_REGISTRY) {
      expect(config[mod.key]).toHaveProperty('style')
      expect(config[mod.key].style).toEqual({})
    }
  })

  it('preserves visible and coordinate fields alongside style', () => {
    const config = buildInitialLayoutConfig('two-column')
    for (const mod of MODULE_REGISTRY) {
      const expectedVisible = mod.defaultVisible !== false
      expect(config[mod.key].visible).toBe(expectedVisible)
      expect(config[mod.key].row).toBeDefined()
      expect(config[mod.key].col).toBeDefined()
      expect(config[mod.key].style).toBeDefined()
    }
  })
})

/* ── hasModuleSettings returns true for all modules ────────── */

describe('hasModuleSettings – all modules', () => {
  it('returns true for every module in MODULE_REGISTRY', () => {
    for (const mod of MODULE_REGISTRY) {
      expect(hasModuleSettings(mod.key)).toBe(true)
    }
  })
})

/* ── STYLE_SETTING_KEYS ───────────────────────────────────── */

describe('STYLE_SETTING_KEYS', () => {
  it('contains the universal style properties', () => {
    expect(STYLE_SETTING_KEYS).toEqual(new Set([
      'backgroundColor', 'borderColor',
      'textColor', 'headingColor', 'accentColor', 'mutedColor',
      'borderStyle', 'borderWidth',
    ]))
  })
})

/* ── DraggableModule styleOverrides ────────────────────────── */

describe('DraggableModule – styleOverrides prop', () => {
  const baseProps = {
    id: 'ability',
    areaClass: 'abilityArea',
    row: 4, col: 1, rowSpan: 1, colSpan: 1,
    maxColumns: 2,
    isEditMode: false,
    onRemove: vi.fn(),
    onColSpan: vi.fn(),
  }

  it('sets backgroundColor as CSS custom property on wrapper div', () => {
    const { container } = render(
      <DraggableModule {...baseProps} styleOverrides={{ backgroundColor: '#ff0000' }}>
        <span>content</span>
      </DraggableModule>
    )
    const wrapper = container.firstChild
    expect(wrapper.style.getPropertyValue('--mod-bg')).toBe('#ff0000')
    expect(wrapper.style.backgroundColor).toBe('')
  })

  it('sets border properties as CSS custom properties', () => {
    const { container } = render(
      <DraggableModule
        {...baseProps}
        styleOverrides={{ borderColor: '#0000ff', borderStyle: 'dashed', borderWidth: '2px' }}
      >
        <span>content</span>
      </DraggableModule>
    )
    const wrapper = container.firstChild
    expect(wrapper.style.getPropertyValue('--mod-border-color')).toBe('#0000ff')
    expect(wrapper.style.getPropertyValue('--mod-border-style')).toBe('dashed')
    expect(wrapper.style.getPropertyValue('--mod-border-width')).toBe('2px')
  })

  it('sets text/heading/accent/muted colors as CSS custom properties', () => {
    const { container } = render(
      <DraggableModule
        {...baseProps}
        styleOverrides={{
          textColor: '#111111',
          headingColor: '#222222',
          accentColor: '#333333',
          mutedColor: '#444444',
        }}
      >
        <span>content</span>
      </DraggableModule>
    )
    const wrapper = container.firstChild
    expect(wrapper.style.getPropertyValue('--mod-text')).toBe('#111111')
    expect(wrapper.style.getPropertyValue('--mod-heading')).toBe('#222222')
    expect(wrapper.style.getPropertyValue('--mod-accent')).toBe('#333333')
    expect(wrapper.style.getPropertyValue('--mod-muted')).toBe('#444444')
  })

  it('applies no extra styles when styleOverrides is empty', () => {
    const { container } = render(
      <DraggableModule {...baseProps} styleOverrides={{}}>
        <span>content</span>
      </DraggableModule>
    )
    const wrapper = container.firstChild
    expect(wrapper.style.getPropertyValue('--mod-bg')).toBe('')
    expect(wrapper.style.getPropertyValue('--mod-border-style')).toBe('')
  })

  it('applies no extra styles when styleOverrides is omitted', () => {
    const { container } = render(
      <DraggableModule {...baseProps}>
        <span>content</span>
      </DraggableModule>
    )
    const wrapper = container.firstChild
    expect(wrapper.style.getPropertyValue('--mod-bg')).toBe('')
  })
})

/* ── SheetPreview – style via settings modal ───────────────── */

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

describe('SheetPreview – module styles via settings modal', () => {
  it('modules start with no backgroundColor inline style', () => {
    const { container } = render(
      <SheetPreview
        character={CHAR}
        preset={PRESET}
        template="two-column"
        templateSettings={{}}
        onReset={vi.fn()}
      />
    )
    const grid = container.querySelector('.sheet-grid')
    const headerSlot = Array.from(grid.children).find((el) => el.style.gridRowStart === '1' && el.style.gridColumnStart === '1')
    expect(headerSlot).toBeTruthy()
    expect(headerSlot.style.backgroundColor).toBe('')
  })

  it('style is preserved when module is toggled off and back on', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <SheetPreview
        character={CHAR}
        preset={PRESET}
        template="two-column"
        templateSettings={{}}
        onReset={vi.fn()}
      />
    )

    // Enter edit mode
    await user.click(screen.getByRole('button', { name: /edit layout/i }))

    // Toggle off header via ComponentPicker
    const hideBtn = screen.getByTitle(new RegExp(`hide ${MODULE_REGISTRY[0].name}`, 'i'))
    await user.click(hideBtn)

    // Toggle back on
    const showBtn = screen.getByTitle(new RegExp(`show ${MODULE_REGISTRY[0].name}`, 'i'))
    await user.click(showBtn)

    // Check the module is back with no extra styles
    const grid = container.querySelector('.sheet-grid')
    const headerSlot = Array.from(grid.children).find((el) => el.style.gridRowStart === '1' && el.style.gridColumnStart === '1')
    expect(headerSlot).toBeTruthy()
    expect(headerSlot.style.backgroundColor).toBe('')
  })
})
