import defaultStyles from './RaceClassInfo.module.css'
import modernStyles from './RaceClassInfo.modern.module.css'
import { mergeStyles } from '../../../utils/mergeStyles'
import { cx } from '../../../utils/cx'

const TEMPLATE_MAP = { modern: modernStyles }

export default function RaceClassInfo({ preset, templateId, settings = {} }) {
  const styles = mergeStyles(defaultStyles, templateId, TEMPLATE_MAP)

  // Extra-fields container: force-show if any toggled true, force-hide if all false, else defer to CSS
  const anyExtraTrue = settings.showBackgroundAlignment === true || settings.showCharacterFeatures === true || settings.showCharacterTraits === true
  const allExtraFalse = settings.showBackgroundAlignment === false && settings.showCharacterFeatures === false && settings.showCharacterTraits === false
  const extraFieldsStyle = anyExtraTrue
    ? { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px 8px', marginTop: '4px' }
    : allExtraFalse
      ? { display: 'none' }
      : undefined

  return (
    <section className={cx('module-box', styles.moduleBox, styles.raceClass)}>
      <h3 className={cx('section-header', styles.sectionHeader)}>Race, Class &amp; Experience</h3>
      <div className={styles.fields}>
        {settings.showRace !== false && (
          <fieldset className={styles.field}>
            <label className={styles.label}>Race</label>
            <span className={cx('write-line', styles.writeLine)}>{preset?.race ?? ''}</span>
          </fieldset>
        )}
        {settings.showClass !== false && (
          <fieldset className={styles.field}>
            <label className={styles.label}>Class</label>
            <span className={cx('write-line', styles.writeLine)}>{preset?.class ?? ''}</span>
          </fieldset>
        )}
        {settings.showSubclass !== false && (
          <fieldset className={styles.field}>
            <label className={styles.label}>Subclass</label>
            <span className={cx('write-line', styles.writeLine)} />
          </fieldset>
        )}
        {settings.showLevel !== false && (
          <fieldset className={styles.field}>
            <label className={styles.label}>Level</label>
            <span className={cx('write-line', styles.writeLine)} />
          </fieldset>
        )}
        {settings.showExperience !== false && (
          <fieldset className={styles.field}>
            <label className={styles.label}>Experience</label>
            <span className={cx('write-line', styles.writeLine)} />
          </fieldset>
        )}
        {settings.showProficiencyBonus !== false && (
          <fieldset className={styles.field}>
            <label className={styles.label}>Proficiency Bonus</label>
            <span className={cx('write-line', styles.writeLine)} />
          </fieldset>
        )}
      </div>
      {/* Extra fields — hidden by default, shown in modern */}
      <div className={styles.extraFields} style={extraFieldsStyle}>
        {settings.showBackgroundAlignment !== false && (
          <fieldset className={styles.field}>
            <label className={styles.label}>Background &amp; Alignment</label>
            <span className={cx('write-line', styles.writeLine)} />
          </fieldset>
        )}
        {settings.showCharacterFeatures !== false && (
          <fieldset className={styles.field}>
            <label className={styles.label}>Character Features</label>
            <span className={cx('write-line', styles.writeLine)} />
          </fieldset>
        )}
        {settings.showCharacterTraits !== false && (
          <fieldset className={styles.field}>
            <label className={styles.label}>Character Traits</label>
            <span className={cx('write-line', styles.writeLine)} />
          </fieldset>
        )}
      </div>
    </section>
  )
}
