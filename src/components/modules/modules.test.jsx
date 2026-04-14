import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AbilityScores from './AbilityScores/AbilityScores.jsx'
import SavingThrowsSkills from './SavingThrowsSkills/SavingThrowsSkills.jsx'
import RaceClassInfo from './RaceClassInfo/RaceClassInfo.jsx'
import RaceClassTraits from './RaceClassTraits/RaceClassTraits.jsx'
import HPTracker from './HPTracker/HPTracker.jsx'
import CharacterPortrait from './CharacterPortrait/CharacterPortrait.jsx'

const CHAR = { name: 'A', race: 'Elf', class: 'Wizard', level: 3 }

describe('AbilityScores', () => {
  it('renders default tree', () => {
    render(<AbilityScores character={CHAR} preset={{ defaultSkillProficiencies: ['Arcana'] }} />)
    expect(screen.getByText('Ability Scores')).toBeInTheDocument()
  })
  it('forces skills display when toggled on', () => {
    const { container } = render(
      <AbilityScores character={CHAR} preset={{}} settings={{ showSkills: true, showSavingThrows: true }} />,
    )
    const skillGroups = container.querySelectorAll('.ability-scores__skills')
    expect(skillGroups[0].style.display).toBe('flex')
  })
  it('hides skills group when both toggles are false', () => {
    const { container } = render(
      <AbilityScores character={CHAR} preset={{}} settings={{ showSkills: false, showSavingThrows: false }} />,
    )
    const skillGroups = container.querySelectorAll('.ability-scores__skills')
    expect(skillGroups[0].style.display).toBe('none')
  })
  it('applies shieldColor style override', () => {
    const { container } = render(
      <AbilityScores character={CHAR} preset={{}} settings={{ shieldColor: '#ff0000' }} />,
    )
    const shield = container.querySelector('.ability-scores__shield')
    expect(shield.style.background).toContain('rgb(255, 0, 0)')
  })
})

describe('SavingThrowsSkills', () => {
  it('marks proficient skills with filled circles', () => {
    const { container } = render(
      <SavingThrowsSkills character={CHAR} preset={{ defaultSkillProficiencies: ['Arcana', 'Stealth'] }} />,
    )
    const filled = container.querySelectorAll('.saving-throws-skills__check')
    const filledChars = Array.from(filled).map((n) => n.textContent)
    expect(filledChars).toContain('●')
  })
  it('renders with missing preset', () => {
    render(<SavingThrowsSkills character={CHAR} />)
    expect(screen.getByText('Saving Throws')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
  })
})

describe('RaceClassInfo', () => {
  it('defaults to showing race/class/level fields', () => {
    render(<RaceClassInfo character={CHAR} preset={{ race: 'Elf', class: 'Wizard' }} />)
    expect(screen.getByText('Race')).toBeInTheDocument()
    expect(screen.getByText('Class')).toBeInTheDocument()
  })
  it('hides the group header when all extra fields are explicitly false', () => {
    const { container } = render(
      <RaceClassInfo
        character={CHAR}
        preset={{ race: 'Elf', class: 'Wizard' }}
        settings={{ showBackgroundAlignment: false, showCharacterFeatures: false, showCharacterTraits: false }}
      />,
    )
    const extra = container.querySelector('.race-class-info__extra-fields')
    expect(extra.style.display).toBe('none')
  })
  it('shows the group when any extra field is explicitly true', () => {
    const { container } = render(
      <RaceClassInfo
        character={CHAR}
        preset={{}}
        settings={{ showBackgroundAlignment: true }}
      />,
    )
    const extra = container.querySelector('.race-class-info__extra-fields')
    expect(extra.style.display).toBe('grid')
  })
  it('falls back to generic heading when all sections are hidden', () => {
    render(
      <RaceClassInfo
        character={CHAR}
        preset={{}}
        settings={{ showRace: false, showClass: false, showSubclass: false, showLevel: false, showExperience: false, showProficiencyBonus: false }}
      />,
    )
    expect(screen.getByText('Character Info')).toBeInTheDocument()
  })
  it('renders a single section heading when only one section is visible', () => {
    render(
      <RaceClassInfo
        character={CHAR}
        preset={{}}
        settings={{ showRace: false, showClass: false, showSubclass: false, showLevel: true, showExperience: false, showProficiencyBonus: false }}
      />,
    )
    // header = 'Experience'
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.some((h) => h.textContent === 'Experience')).toBe(true)
  })
})

describe('RaceClassTraits', () => {
  it('shows placeholder when no traits in preset', () => {
    render(<RaceClassTraits character={CHAR} preset={{}} />)
    expect(screen.getByText(/select race and class/i)).toBeInTheDocument()
  })
  it('lists traits from preset', () => {
    render(<RaceClassTraits character={CHAR} preset={{ raceTraits: ['Keen Senses', 'Fey Ancestry'] }} settings={{ lineCount: 3 }} />)
    expect(screen.getByText('Keen Senses')).toBeInTheDocument()
    expect(screen.getByText('Fey Ancestry')).toBeInTheDocument()
  })
})

describe('HPTracker', () => {
  it('applies orbColor as borderColor on rings and orb background on connectors', () => {
    const { container } = render(<HPTracker character={CHAR} settings={{ orbColor: '#ff0000', orbFill: '#00ff00', labelColor: '#0000ff' }} />)
    const ring = container.querySelector('.hp-tracker__max-hp-ring')
    expect(ring.style.borderColor).toBe('rgb(255, 0, 0)')
    const connector = container.querySelector('.hp-tracker__connector')
    expect(connector.style.background).toContain('rgb(255, 0, 0)')
  })
  it('renders without settings', () => {
    const { container } = render(<HPTracker character={CHAR} />)
    expect(container.querySelector('.hp-tracker__orb')).toBeInTheDocument()
  })
})

describe('CharacterPortrait', () => {
  it('shows placeholder when no image is provided', () => {
    render(<CharacterPortrait character={CHAR} onImageChange={vi.fn()} />)
    expect(screen.getByText(/tap to upload image/i)).toBeInTheDocument()
  })
  it('shows the image when imageSrc is provided', () => {
    render(<CharacterPortrait character={CHAR} imageSrc="data:image/png;base64,x" onImageChange={vi.fn()} />)
    expect(screen.getByAltText(/character portrait/i)).toBeInTheDocument()
  })
  it('file input triggers onImageChange via FileReader', async () => {
    const onImageChange = vi.fn()
    const { container } = render(<CharacterPortrait character={CHAR} onImageChange={onImageChange} />)
    const input = container.querySelector('input[type="file"]')
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })
    fireEvent.change(input, { target: { files: [file] } })
    await new Promise((r) => setTimeout(r, 10))
    expect(onImageChange).toHaveBeenCalled()
  })
  it('file input does nothing when no file is selected', () => {
    const onImageChange = vi.fn()
    const { container } = render(<CharacterPortrait character={CHAR} onImageChange={onImageChange} />)
    const input = container.querySelector('input[type="file"]')
    fireEvent.change(input, { target: { files: [] } })
    expect(onImageChange).not.toHaveBeenCalled()
  })
  it('shows the mask class when showMask is true and ratio is 4/2', () => {
    const { container } = render(
      <CharacterPortrait character={CHAR} onImageChange={vi.fn()} settings={{ showMask: true, aspectRatio: '4/2' }} />,
    )
    const frame = container.querySelector('.character-portrait__frame')
    expect(frame.className).toContain('character-portrait--masked')
  })
})
