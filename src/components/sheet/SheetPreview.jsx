import { memo, useCallback, useMemo, useState } from 'react'
import HeaderBanner from '../modules/HeaderBanner/HeaderBanner.jsx'
import CharacterPortrait from '../modules/CharacterPortrait/CharacterPortrait.jsx'
import RaceClassInfo from '../modules/RaceClassInfo/RaceClassInfo.jsx'
import BackgroundInfo from '../modules/BackgroundInfo/BackgroundInfo.jsx'
import AbilityScores from '../modules/AbilityScores/AbilityScores.jsx'
import SavingThrowsSkills from '../modules/SavingThrowsSkills/SavingThrowsSkills.jsx'
import PassiveStats from '../modules/PassiveStats/PassiveStats.jsx'
import Inspiration from '../modules/Inspiration/Inspiration.jsx'
import CombatStats from '../modules/CombatStats/CombatStats.jsx'
import HPTracker from '../modules/HPTracker/HPTracker.jsx'
import AbilitiesFeatures from '../modules/AbilitiesFeatures/AbilitiesFeatures.jsx'
import AttacksCantrips from '../modules/AttacksCantrips/AttacksCantrips.jsx'
import Equipment from '../modules/Equipment/Equipment.jsx'
import Proficiency from '../modules/Proficiency/Proficiency.jsx'
import RaceClassTraits from '../modules/RaceClassTraits/RaceClassTraits.jsx'
import ClassFeaturePrimary from '../modules/ClassFeaturePrimary/ClassFeaturePrimary.jsx'
import ClassFeatureSecondary from '../modules/ClassFeatureSecondary/ClassFeatureSecondary.jsx'
import SubclassFeats from '../modules/SubclassFeats/SubclassFeats.jsx'
import { getTemplate } from '../../templates/index.js'
import { buildInitialLayoutConfig } from '../../data/moduleRegistry.js'
import ComponentPicker from './ComponentPicker.jsx'
import styles from './SheetPreview.module.css'

/**
 * SheetGrid is memoized so that toggling edit mode (which lives in SheetPreview)
 * does not trigger re-renders of the unmodified module components.
 * Remove buttons are always in the DOM; CSS shows them via the .editMode class
 * on the wrapper — no prop change reaches the module children.
 */
const SheetGrid = memo(function SheetGrid({
  character,
  preset,
  templateId,
  tpl,
  userOverrides,
  layoutConfig,
  onRemove,
}) {
  const lc = layoutConfig

  return (
    <div
      className={`sheet-preview ${styles.sheet}`}
      data-template={tpl.layout}
      style={userOverrides}
    >
      <div className={`sheet-grid ${styles.grid}`}>

        {lc.header.visible && (
          <div className={styles.headerArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('header')} type="button" aria-label="Remove Header Banner">✕</button>
            <HeaderBanner character={character} templateId={templateId} />
          </div>
        )}

        {lc.portrait.visible && (
          <div className={styles.portraitArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('portrait')} type="button" aria-label="Remove Character Portrait">✕</button>
            <CharacterPortrait character={character} templateId={templateId} />
          </div>
        )}

        {lc.raceclass.visible && (
          <div className={styles.raceClassArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('raceclass')} type="button" aria-label="Remove Race & Class Info">✕</button>
            <RaceClassInfo character={character} preset={preset} templateId={templateId} />
          </div>
        )}

        {lc.background.visible && (
          <div className={styles.backgroundArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('background')} type="button" aria-label="Remove Background Info">✕</button>
            <BackgroundInfo character={character} templateId={templateId} />
          </div>
        )}

        {lc.ability.visible && (
          <div className={styles.abilityArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('ability')} type="button" aria-label="Remove Ability Scores">✕</button>
            <AbilityScores character={character} templateId={templateId} />
          </div>
        )}

        {lc.passive.visible && (
          <div className={styles.passiveArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('passive')} type="button" aria-label="Remove Passive Stats">✕</button>
            <PassiveStats character={character} templateId={templateId} />
          </div>
        )}

        {lc.insp.visible && (
          <div className={styles.inspirationArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('insp')} type="button" aria-label="Remove Inspiration">✕</button>
            <Inspiration character={character} templateId={templateId} />
          </div>
        )}

        {lc.saving.visible && (
          <div className={styles.savingArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('saving')} type="button" aria-label="Remove Saving Throws & Skills">✕</button>
            <SavingThrowsSkills character={character} preset={preset} templateId={templateId} />
          </div>
        )}

        {lc.combat.visible && (
          <div className={styles.combatArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('combat')} type="button" aria-label="Remove Combat Stats">✕</button>
            <CombatStats character={character} templateId={templateId} />
          </div>
        )}

        {lc.hp.visible && (
          <div className={styles.hpArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('hp')} type="button" aria-label="Remove HP Tracker">✕</button>
            <HPTracker character={character} templateId={templateId} />
          </div>
        )}

        {lc.featurePrimary.visible && (
          <div className={styles.featurePrimaryArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('featurePrimary')} type="button" aria-label="Remove Class Feature Primary">✕</button>
            <ClassFeaturePrimary character={character} preset={preset} templateId={templateId} />
          </div>
        )}

        {lc.traits.visible && (
          <div className={styles.traitsArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('traits')} type="button" aria-label="Remove Race/Class Traits">✕</button>
            <RaceClassTraits character={character} preset={preset} templateId={templateId} />
          </div>
        )}

        {lc.featureSecondary.visible && (
          <div className={styles.featureSecondaryArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('featureSecondary')} type="button" aria-label="Remove Class Feature Secondary">✕</button>
            <ClassFeatureSecondary character={character} preset={preset} templateId={templateId} />
          </div>
        )}

        {lc.abilities.visible && (
          <div className={styles.abilitiesFeaturesArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('abilities')} type="button" aria-label="Remove Abilities & Features">✕</button>
            <AbilitiesFeatures character={character} templateId={templateId} />
          </div>
        )}

        {lc.subclassFeats.visible && (
          <div className={styles.subclassFeatsArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('subclassFeats')} type="button" aria-label="Remove Subclass Feats">✕</button>
            <SubclassFeats character={character} preset={preset} templateId={templateId} />
          </div>
        )}

        {lc.attacks.visible && (
          <div className={styles.attacksArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('attacks')} type="button" aria-label="Remove Attacks & Cantrips">✕</button>
            <AttacksCantrips character={character} templateId={templateId} />
          </div>
        )}

        {lc.equipment.visible && (
          <div className={styles.equipmentArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('equipment')} type="button" aria-label="Remove Equipment">✕</button>
            <Equipment character={character} templateId={templateId} />
          </div>
        )}

        {lc.proficiency.visible && (
          <div className={styles.proficiencyArea}>
            <button className={`no-print ${styles.removeBtn}`} onClick={() => onRemove('proficiency')} type="button" aria-label="Remove Proficiency">✕</button>
            <Proficiency character={character} templateId={templateId} />
          </div>
        )}

      </div>
    </div>
  )
})

export default function SheetPreview({ character, preset, template, templateSettings, onReset }) {
  const tpl = useMemo(() => getTemplate(template), [template])
  const [isEditMode, setIsEditMode] = useState(false)
  const [layoutConfig, setLayoutConfig] = useState(buildInitialLayoutConfig)

  const userOverrides = useMemo(() => {
    const o = {}
    if (templateSettings?.backgroundColor) o['--color-parchment'] = templateSettings.backgroundColor
    if (templateSettings?.accentColor) o['--color-gold'] = templateSettings.accentColor
    if (templateSettings?.fontFamily) o['--font-serif'] = templateSettings.fontFamily
    return o
  }, [templateSettings])

  const handleRemove = useCallback((key) => {
    setLayoutConfig((prev) => ({ ...prev, [key]: { ...prev[key], visible: false } }))
  }, [])

  const handleToggle = useCallback((key) => {
    setLayoutConfig((prev) => ({ ...prev, [key]: { ...prev[key], visible: !prev[key].visible } }))
  }, [])

  function handlePrint() {
    window.print()
  }

  return (
    <div className={`${styles.wrapper}${isEditMode ? ' ' + styles.editMode : ''}`}>
      {/* Toolbar — hidden on print */}
      <div className={`no-print ${styles.toolbar}`}>
        <button className={styles.printBtn} onClick={handlePrint} type="button">
          🖨 Print Sheet
        </button>
        <button
          className={`${styles.editBtn}${isEditMode ? ' ' + styles.editBtnActive : ''}`}
          onClick={() => setIsEditMode((e) => !e)}
          type="button"
        >
          {isEditMode ? '✓ Done Editing' : '✏ Edit Layout'}
        </button>
        <button className={styles.resetBtn} onClick={onReset} type="button">
          ← New Character
        </button>
      </div>

      <SheetGrid
        character={character}
        preset={preset}
        templateId={tpl.id}
        tpl={tpl}
        userOverrides={userOverrides}
        layoutConfig={layoutConfig}
        onRemove={handleRemove}
      />

      {/* ComponentPicker — shown only in edit mode, hidden on print */}
      {isEditMode && (
        <ComponentPicker layoutConfig={layoutConfig} onToggle={handleToggle} />
      )}
    </div>
  )
}
