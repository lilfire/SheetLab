import defaultStyles from './AbilityScores.module.css'
import modernStyles from './AbilityScores.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'
import { cx } from '../../../utils/cx'

const TEMPLATE_MAP = { modern: modernStyles }

const ABILITIES = [
  { key: 'str', label: 'STR', full: 'Strength', save: 'Strength', skills: ['Athletics'] },
  { key: 'dex', label: 'DEX', full: 'Dexterity', save: 'Dexterity', skills: ['Acrobatics', 'Sleight of Hand', 'Stealth'] },
  { key: 'con', label: 'CON', full: 'Constitution', save: 'Constitution', skills: [] },
  { key: 'int', label: 'INT', full: 'Intelligence', save: 'Intelligence', skills: ['Arcana', 'History', 'Investigation', 'Nature', 'Religion'] },
  { key: 'wis', label: 'WIS', full: 'Wisdom', save: 'Wisdom', skills: ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival'] },
  { key: 'cha', label: 'CHA', full: 'Charisma', save: 'Charisma', skills: ['Deception', 'Intimidation', 'Performance', 'Persuasion'] },
]

export default function AbilityScores({ preset, templateId, settings = {} }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)
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
    <section className={cx('module-box', styles.moduleBox, styles.abilities)}>
      <h3 className={cx('section-header', styles.sectionHeader)}>Ability Scores</h3>
      <div className={styles.grid}>
        {ABILITIES.map(({ key, label, full, save, skills }) => (
          <div key={key} className={styles.abilityColumn}>
            <div className={styles.shield} title={full} style={settings.shieldColor ? { background: settings.shieldColor } : undefined}>
              <span className={styles.abilityLabel}>{label}</span>
              <span className={styles.scoreInput} aria-label={full} />
              <div className={styles.modifierBubble}>
                <span className={styles.modifier}>+0</span>
              </div>
            </div>
            <div className={styles.skillGroup} style={skillGroupStyle}>
              {settings.showSavingThrows !== false && (
                <div className={styles.saveRow}>
                  <span className={styles.saveCheck}>○</span>
                  <span className={styles.saveModifier} />
                  <span className={styles.saveName}>Saving Throw</span>
                </div>
              )}
              {settings.showSkills !== false && skills.map((skill) => (
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
