import { describe, it, expect } from 'vitest'
import { resolvePreset } from './index.js'

describe('resolvePreset', () => {
  it('returns a generic preset when no className is provided', () => {
    const p = resolvePreset('Elf', null)
    expect(p.class).toBeNull()
    expect(p.race).toBe('Elf')
    expect(p.modules.classFeaturePrimary.title).toBe('Primary Feature')
  })

  it('returns a generic preset when both race and class are empty', () => {
    const p = resolvePreset(null, null)
    expect(p.race).toBeNull()
    expect(p.class).toBeNull()
    expect(p.modules.classFeatureSecondary.title).toBe('Secondary Feature')
  })

  it('returns a class-specific default preset for unknown class', () => {
    const p = resolvePreset('Human', 'Fighter')
    expect(p.class).toBe('Fighter')
    expect(p.race).toBe('Human')
    expect(p.modules.classFeaturePrimary.title).toContain('Fighter')
    expect(p.raceTraits).toEqual([])
    expect(p.defaultSkillProficiencies).toEqual([])
  })

  it('returns default preset when race is undefined', () => {
    const p = resolvePreset(undefined, 'Wizard')
    expect(p.class).toBe('Wizard')
    expect(p.race ?? null).toBeNull()
  })
})
