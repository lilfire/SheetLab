import TemplateSlot from '../../template/TemplateSlot.jsx'
import './AbilityScores.css'

const ABILITIES = [
  { key: 'str', label: 'STR', full: 'Strength', save: 'Strength', skills: ['Athletics'] },
  { key: 'dex', label: 'DEX', full: 'Dexterity', save: 'Dexterity', skills: ['Acrobatics', 'Sleight of Hand', 'Stealth'] },
  { key: 'con', label: 'CON', full: 'Constitution', save: 'Constitution', skills: [] },
  { key: 'int', label: 'INT', full: 'Intelligence', save: 'Intelligence', skills: ['Arcana', 'History', 'Investigation', 'Nature', 'Religion'] },
  { key: 'wis', label: 'WIS', full: 'Wisdom', save: 'Wisdom', skills: ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival'] },
  { key: 'cha', label: 'CHA', full: 'Charisma', save: 'Charisma', skills: ['Deception', 'Intimidation', 'Performance', 'Persuasion'] },
]

export default function AbilityScores({ character, preset, settings = {} }) {
  const proficiencies = preset?.defaultSkillProficiencies ?? []

  // Tri-state: null = defer to template CSS, true = force show, false = force hide
  const forceShow = settings.showSavingThrows === true || settings.showSkills === true
  const forceHide = settings.showSavingThrows === false && settings.showSkills === false
  const skillGroupStyle = forceShow
    ? { display: 'flex' }
    : forceHide
      ? { display: 'none' }
      : undefined

  return (
    <section className="module-box ability-scores">
      <TemplateSlot name="ability-scores:header" character={character} preset={preset} settings={settings}>
        <h3 className="section-header">Ability Scores</h3>
      </TemplateSlot>
      <TemplateSlot name="ability-scores:grid" character={character} preset={preset} settings={settings}>
        <div className="ability-scores__grid">
          {ABILITIES.map(({ key, label, full, save, skills }) => (
            <TemplateSlot
              key={key}
              name="ability-scores:column"
              ability={key}
              label={label}
              full={full}
              skills={skills}
              character={character}
              settings={settings}
            >
              <div className="ability-scores__column">
                <div className="ability-scores__shield" title={full} style={settings.shieldColor ? { background: settings.shieldColor } : undefined}>
                  <span className="ability-scores__label">{label}</span>
                  <span className="ability-scores__score-label">Score</span>
                  <span className="ability-scores__score" aria-label={full} />
                </div>
                <span className="ability-scores__mod-label">MOD</span>
                <span className="ability-scores__mod-bubble" aria-label={`${full} modifier`} />
                <TemplateSlot
                  name="ability-scores:skills"
                  ability={key}
                  skills={skills}
                  proficiencies={proficiencies}
                  character={character}
                  settings={settings}
                >
                  <div className="ability-scores__skills" style={skillGroupStyle}>
                    {settings.showSavingThrows !== false && (
                      <div className="ability-scores__save-row">
                        <span className="ability-scores__save-check">○</span>
                        <span className="ability-scores__save-mod" />
                        <span className="ability-scores__save-name">Saving Throw</span>
                      </div>
                    )}
                    {settings.showSkills !== false && skills.map((skill) => (
                      <div key={skill} className="ability-scores__skill-row">
                        <span className="ability-scores__skill-check">{proficiencies.includes(skill) ? '●' : '○'}</span>
                        <span className="ability-scores__skill-mod" />
                        <span className="ability-scores__skill-name">{skill}</span>
                      </div>
                    ))}
                  </div>
                </TemplateSlot>
              </div>
            </TemplateSlot>
          ))}
        </div>
      </TemplateSlot>
    </section>
  )
}
