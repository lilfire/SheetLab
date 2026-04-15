import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useLayoutPresets } from './useLayoutPresets.js'

describe('useLayoutPresets', () => {
  beforeEach(() => {
    localStorage.setItem('sheetlab:layoutPresets', '[]')
  })

  it('starts with no presets', () => {
    const { result } = renderHook(() => useLayoutPresets('two-column'))
    expect(result.current.presets).toEqual([])
  })

  it('saves and returns presets filtered by templateId', () => {
    const { result } = renderHook(() => useLayoutPresets('two-column'))
    act(() => {
      result.current.savePreset('My Layout', { foo: 1 }, { 1: { minHeight: 50 } })
    })
    expect(result.current.presets).toHaveLength(1)
    expect(result.current.presets[0].name).toBe('My Layout')
    expect(result.current.presets[0].templateId).toBe('two-column')
    expect(result.current.presets[0].layoutConfig).toEqual({ foo: 1 })
  })

  it('excludes presets from other templates', () => {
    const { result: twoCol } = renderHook(() => useLayoutPresets('two-column'))
    act(() => twoCol.current.savePreset('Preset A', {}, {}))
    const { result: modern } = renderHook(() => useLayoutPresets('modern'))
    expect(modern.current.presets).toHaveLength(0)
  })

  it('deletes presets by id', () => {
    const { result } = renderHook(() => useLayoutPresets('two-column'))
    act(() => result.current.savePreset('A', {}, {}))
    const id = result.current.presets[0].id
    act(() => result.current.deletePreset(id))
    expect(result.current.presets).toHaveLength(0)
  })

  it('persists saved presets across hook mounts', () => {
    const { result: first } = renderHook(() => useLayoutPresets('two-column'))
    act(() => first.current.savePreset('Persisted', { k: 'v' }, {}))
    const { result: second } = renderHook(() => useLayoutPresets('two-column'))
    expect(second.current.presets).toHaveLength(1)
    expect(second.current.presets[0].name).toBe('Persisted')
  })

  it('returns [] when localStorage contains invalid JSON', () => {
    localStorage.setItem('sheetlab:layoutPresets', '{not json')
    const { result } = renderHook(() => useLayoutPresets('two-column'))
    expect(result.current.presets).toEqual([])
  })

  it('returns [] when localStorage contains a non-array value', () => {
    localStorage.setItem('sheetlab:layoutPresets', '{"hi":1}')
    const { result } = renderHook(() => useLayoutPresets('two-column'))
    expect(result.current.presets).toEqual([])
  })
})
