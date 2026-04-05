import styles from './SavingThrowsSkills.module.css'

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

export default function SavingThrowsSkills({ preset, templateId }) {
  const proficiencies = preset?.defaultSkillProficiencies ?? []

  return (
    <section className={`module-box ${styles.savingSkills} ${templateId ? (styles[templateId] || '') : ''}`}>
      <div className={styles.savingThrows}>
        <h3 className="section-header">Saving Throws</h3>
        {SAVING_THROWS.map((ability) => (
          <div key={ability} className={styles.row}>
            <span className={styles.check} aria-label={`${ability} saving throw proficiency`}>○</span>
            <span className={styles.modifier} />
            <span className={styles.name}>{ability}</span>
          </div>
        ))}
      </div>

      <div className={styles.skills}>
        <h3 className="section-header">Skills</h3>
        {SKILLS.map(({ name, ability }) => (
          <div key={name} className={styles.row}>
            <span
              className={styles.check}
              aria-label={`${name} proficiency`}
            >{proficiencies.includes(name) ? '●' : '○'}</span>
            <span className={styles.modifier} />
            <span className={styles.name}>{name} <span className={styles.ability}>({ability})</span></span>
          </div>
        ))}
      </div>
    </section>
  )
}
