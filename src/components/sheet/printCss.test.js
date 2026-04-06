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

  it('@page uses vertical-only margins matching PAGE_CONTENT_HEIGHT_MM', () => {
    const printCss = readFileSync(
      resolve(__dirname, '../../styles/print.css'),
      'utf-8'
    )
    // 8mm top/bottom for per-page spacing, 0 left/right so 210mm sheet fits without scaling
    expect(printCss).toMatch(/@page\s*\{[^}]*margin:\s*8mm\s+0;/)
  })

  it('sheet-preview padding is 0 during print to avoid double-margin', () => {
    const printCss = readFileSync(
      resolve(__dirname, '../../styles/print.css'),
      'utf-8'
    )
    expect(printCss).toMatch(/\.sheet-preview\s*\{[^}]*padding:\s*0\s*!important/)
  })
})
