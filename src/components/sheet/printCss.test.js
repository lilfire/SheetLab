// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('Scenario 5 – Print CSS static verification', () => {
  it('print.css contains rule to hide .no-print elements', () => {
    const printCss = readFileSync(
      resolve(__dirname, '../../styles/print.css'),
      'utf-8'
    )
    expect(printCss).toContain('.no-print')
    expect(printCss).toContain('display: none')
  })

  it('@page uses zero margins so sheet padding controls spacing', () => {
    const printCss = readFileSync(
      resolve(__dirname, '../../styles/print.css'),
      'utf-8'
    )
    expect(printCss).toMatch(/@page\s*\{[^}]*margin:\s*8mm 0;/)
  })

  it('sheet-preview pages use break-after for pagination', () => {
    const printCss = readFileSync(
      resolve(__dirname, '../../styles/print.css'),
      'utf-8'
    )
    expect(printCss).toContain('.sheet-preview')
    expect(printCss).toContain('break-after: page')
  })

  it('module wrappers allow fragmentation and overflow in print', () => {
    const printCss = readFileSync(
      resolve(__dirname, '../../styles/print.css'),
      'utf-8'
    )
    expect(printCss).toContain('[data-module-key]')
    expect(printCss).toContain('overflow: visible !important')
    expect(printCss).toContain('break-inside: avoid')
  })
})
