import styles from './AbilityScores.module.css'

const ABILITIES = [
  { key: 'str', label: 'STR', full: 'Strength', save: 'Strength', skills: ['Athletics'] },
  { key: 'dex', label: 'DEX', full: 'Dexterity', save: 'Dexterity', skills: ['Acrobatics', 'Sleight of Hand', 'Stealth'] },
  { key: 'con', label: 'CON', full: 'Constitution', save: 'Constitution', skills: [] },
  { key: 'int', label: 'INT', full: 'Intelligence', save: 'Intelligence', skills: ['Arcana', 'History', 'Investigation', 'Nature', 'Religion'] },
  { key: 'wis', label: 'WIS', full: 'Wisdom', save: 'Wisdom', skills: ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival'] },
  { key: 'cha', label: 'CHA', full: 'Charisma', save: 'Charisma', skills: ['Deception', 'Intimidation', 'Performance', 'Persuasion'] },
]

export default function AbilityScores({ preset, templateId }) {
  const proficiencies = preset?.defaultSkillProficiencies ?? []

  return (
    <section className={`module-box ${styles.abilities} ${templateId ? (styles[templateId] || '') : ''}`}>
      <h3 className="section-header">Ability Scores</h3>
      <div className={styles.grid}>
        {ABILITIES.map(({ key, label, full, save, skills }) => (
          <div key={key} className={styles.abilityColumn}>
            <div className={styles.shield} title={full}>
              <span className={styles.abilityLabel}>{label}</span>
              <span className={styles.scoreInput} aria-label={full} />
              <div className={styles.modifierBubble}>
                <span className={styles.modifier}>+0</span>
              </div>
            </div>
            {/* Saving throw + skills — hidden by default, shown by modern template CSS */}
            <div className={styles.skillGroup}>
              <div className={styles.saveRow}>
                <span className={styles.saveCheck}>○</span>
                <span className={styles.saveModifier} />
                <span className={styles.saveName}>Saving Throw</span>
              </div>
              {skills.map((skill) => (
                <div key={skill} className={styles.skillRow}>
                  <span className={styles.skillCheck}>{proficiencies.includes(skill) ? '●' : '○'}</span>
                  <span className={styles.skillModifier} />
                  <span className={styles.skillName}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
