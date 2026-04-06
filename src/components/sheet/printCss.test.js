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

  it('@page margin is 0 to avoid double-margin with sheet padding', () => {
    const printCss = readFileSync(
      resolve(__dirname, '../../styles/print.css'),
      'utf-8'
    )
    expect(printCss).toMatch(/@page\s*\{[^}]*margin:\s*0;/)
    expect(printCss).not.toMatch(/@page\s*\{[^}]*margin:\s*8mm/)
  })
})
