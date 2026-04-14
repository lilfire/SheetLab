import { describe, it, expect } from 'vitest'
import { cx } from './cx.js'

describe('cx', () => {
  it('joins truthy strings with spaces', () => {
    expect(cx('a', 'b', 'c')).toBe('a b c')
  })
  it('filters out falsy values', () => {
    expect(cx('a', false, null, undefined, '', 'b')).toBe('a b')
  })
  it('returns empty string when nothing truthy', () => {
    expect(cx(null, false, undefined)).toBe('')
  })
})
