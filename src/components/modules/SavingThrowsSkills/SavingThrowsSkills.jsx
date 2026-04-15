import TemplateSlot from '../../template/TemplateSlot.jsx'
import './SavingThrowsSkills.css'

const SAVING_THROWS = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma']

const SKILLS = [
  { name: 'Acrobatics', ability: 'Dex' },
  { name: 'Animal Handling', ability: 'Wis' },
  { name: 'Arcana', ability: 'Int' },
  { name: 'Athletics', ability: 'Str' },
  { name: 'Deception', ability: 'Cha' },
  { name: 'History', ability: 'Int' },
  { name: 'Insight', ability: 'Wis' },
  { name: 'Intimidation', ability: 'Cha' },
  { name: 'Investigation', ability: 'Int' },
  { name: 'Medicine', ability: 'Wis' },
  { name: 'Nature', ability: 'Int' },
  { name: 'Perception', ability: 'Wis' },
  { name: 'Performance', ability: 'Cha' },
  { name: 'Persuasion', ability: 'Cha' },
  { name: 'Religion', ability: 'Int' },
  { name: 'Sleight of Hand', ability: 'Dex' },
  { name: 'Stealth', ability: 'Dex' },
  { name: 'Survival', ability: 'Wis' },
]

export default function SavingThrowsSkills({ character, preset }) {
  const proficiencies = preset?.defaultSkillProficiencies ?? []

  return (
    <section className="module-box saving-throws-skills">
      <TemplateSlot name="saving-throws-skills:saves" character={character} preset={preset}>
        <div className="saving-throws-skills__saving-throws">
          <h3 className="section-header">Saving Throws</h3>
          {SAVING_THROWS.map((ability) => (
            <div key={ability} className="saving-throws-skills__row">
              <span className="saving-throws-skills__check" aria-label={`${ability} saving throw proficiency`}>○</span>
              <span className="saving-throws-skills__modifier" />
              <span className="saving-throws-skills__name">{ability}</span>
            </div>
          ))}
        </div>
      </TemplateSlot>

      <TemplateSlot name="saving-throws-skills:skills" character={character} preset={preset}>
        <div className="saving-throws-skills__skills">
          <h3 className="section-header">Skills</h3>
          {SKILLS.map(({ name, ability }) => (
            <div key={name} className="saving-throws-skills__row">
              <span
                className="saving-throws-skills__check"
                aria-label={`${name} proficiency`}
              >{proficiencies.includes(name) ? '●' : '○'}</span>
              <span className="saving-throws-skills__modifier" />
              <span className="saving-throws-skills__name">{name} <span className="saving-throws-skills__ability">({ability})</span></span>
            </div>
          ))}
        </div>
      </TemplateSlot>
    </section>
  )
}
