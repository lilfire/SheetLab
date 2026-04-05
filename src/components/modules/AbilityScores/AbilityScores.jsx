import styles from './AbilityScores.module.css'

const ABILITIES = [
  { key: 'str', label: 'STR', full: 'Strength' },
  { key: 'dex', label: 'DEX', full: 'Dexterity' },
  { key: 'con', label: 'CON', full: 'Constitution' },
  { key: 'int', label: 'INT', full: 'Intelligence' },
  { key: 'wis', label: 'WIS', full: 'Wisdom' },
  { key: 'cha', label: 'CHA', full: 'Charisma' },
]

export default function AbilityScores() {
  return (
    <section className={`module-box ${styles.abilities}`}>
      <h3 className="section-header">Ability Scores</h3>
      <div className={styles.grid}>
        {ABILITIES.map(({ key, label, full }) => (
          <div key={key} className={styles.shield} title={full}>
            <span className={styles.abilityLabel}>{label}</span>
            <input
              type="text"
              className={styles.scoreInput}
              placeholder="10"
              aria-label={full}
            />
            <div className={styles.modifierBubble}>
              <span className={styles.modifier}>+0</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
