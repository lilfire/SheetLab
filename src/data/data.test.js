import { describe, it, expect } from 'vitest'
import races from './races.js'
import classes from './classes.js'
import { reflowLayout } from './layoutReflow.js'
import { buildInitialLayoutConfig, MODULE_REGISTRY } from './moduleRegistry.js'
import { getDefaultSettings, hasModuleSettings, STYLE_SETTING_KEYS } from './moduleSettings.js'
import { getTemplate, TEMPLATES } from '../templates/index.js'

describe('races/classes data', () => {
  it('races is a non-empty array of strings', () => {
    expect(Array.isArray(races)).toBe(true)
    expect(races.length).toBeGreaterThan(0)
    for (const r of races) expect(typeof r).toBe('string')
  })
  it('classes is a non-empty array of strings', () => {
    expect(Array.isArray(classes)).toBe(true)
    expect(classes.length).toBeGreaterThan(0)
    for (const c of classes) expect(typeof c).toBe('string')
  })
})

describe('templates/index', () => {
  it('exports TEMPLATES and getTemplate returns known templates by id', () => {
    expect(TEMPLATES.length).toBeGreaterThan(0)
    for (const t of TEMPLATES) {
      expect(getTemplate(t.id).id).toBe(t.id)
    }
  })
  it('getTemplate falls back to first template for unknown ids', () => {
    expect(getTemplate('nonexistent').id).toBe(TEMPLATES[0].id)
  })
  it('getTemplate with undefined falls back to first template', () => {
    expect(getTemplate(undefined).id).toBe(TEMPLATES[0].id)
  })
})

describe('moduleRegistry.buildInitialLayoutConfig', () => {
  it('builds the full config for each template', () => {
    for (const t of TEMPLATES) {
      const cfg = buildInitialLayoutConfig(t.id)
      for (const mod of MODULE_REGISTRY) {
        expect(cfg[mod.key]).toBeDefined()
        expect(cfg[mod.key].style).toEqual({})
        expect(cfg[mod.key].settings).toBeDefined()
      }
    }
  })
  it('respects per-template visible overrides', () => {
    const cfg = buildInitialLayoutConfig('modern')
    expect(cfg.saving.visible).toBe(false)
    expect(cfg.equipment.visible).toBe(false)
  })
  it('uses defaultVisible from registry when template does not specify', () => {
    const cfg = buildInitialLayoutConfig('two-column')
    expect(cfg.saving.visible).toBe(false) // registry defaultVisible:false
    expect(cfg.header.visible).toBe(true)
  })
})

describe('moduleSettings helpers', () => {
  it('STYLE_SETTING_KEYS matches universal style properties', () => {
    for (const key of ['backgroundColor', 'borderColor', 'textColor', 'headingColor', 'accentColor', 'mutedColor', 'borderStyle', 'borderWidth']) {
      expect(STYLE_SETTING_KEYS.has(key)).toBe(true)
    }
  })
  it('hasModuleSettings returns true for known keys', () => {
    expect(hasModuleSettings('header')).toBe(true)
    expect(hasModuleSettings('notes')).toBe(true)
  })
  it('hasModuleSettings returns false for unknown keys', () => {
    expect(hasModuleSettings('nope')).toBe(false)
  })
  it('getDefaultSettings returns {} for unknown keys', () => {
    expect(getDefaultSettings('nope')).toEqual({})
  })
  it('getDefaultSettings returns defaults for known module', () => {
    const d = getDefaultSettings('notes')
    expect(d).toHaveProperty('lineCount', 10)
    expect(d).toHaveProperty('showHeader', null)
  })
})

describe('reflowLayout', () => {
  function makeConfig(overrides = {}) {
    // Minimal 3-module config on a 2-column grid
    return {
      a: { visible: true, row: 1, col: 1, rowSpan: 1, colSpan: 1, style: {}, settings: {} },
      b: { visible: true, row: 1, col: 2, rowSpan: 1, colSpan: 1, style: {}, settings: {} },
      c: { visible: true, row: 2, col: 1, rowSpan: 1, colSpan: 1, style: {}, settings: {} },
      ...overrides,
    }
  }

  it('leaves a non-colliding layout unchanged', () => {
    const cfg = makeConfig()
    const out = reflowLayout(cfg, 'a', 2)
    expect(out.a.row).toBe(1)
    expect(out.b.row).toBe(1)
    expect(out.c.row).toBe(2)
  })

  it('pushes colliders down when the changed module expands', () => {
    const cfg = makeConfig({
      a: { visible: true, row: 1, col: 1, rowSpan: 1, colSpan: 2, style: {}, settings: {} }, // spans both cols
    })
    const out = reflowLayout(cfg, 'a', 2)
    // a stays at row 1, b collides on col 2 → pushed down
    expect(out.a.row).toBe(1)
    expect(out.b.row).toBeGreaterThan(1)
  })

  it('ignores hidden modules', () => {
    const cfg = makeConfig({
      b: { visible: false, row: 1, col: 2, rowSpan: 1, colSpan: 1, style: {}, settings: {} },
    })
    const out = reflowLayout(cfg, 'a', 2)
    // b remains hidden + untouched
    expect(out.b.visible).toBe(false)
    expect(out.b.row).toBe(1)
  })

  it('preserves style and settings on resized modules', () => {
    const cfg = makeConfig({
      a: { visible: true, row: 1, col: 1, rowSpan: 1, colSpan: 2, style: { backgroundColor: '#fff' }, settings: { lineCount: 3 } },
    })
    const out = reflowLayout(cfg, 'a', 2)
    expect(out.a.style).toEqual({ backgroundColor: '#fff' })
    expect(out.a.settings).toEqual({ lineCount: 3 })
  })
})
