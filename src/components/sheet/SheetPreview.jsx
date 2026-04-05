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
import styles from './SheetPreview.module.css'

export default function SheetPreview({ character, preset, template, templateSettings, onReset }) {
  const tpl = getTemplate(template)

  const userOverrides = {}
  if (templateSettings?.backgroundColor) userOverrides['--color-parchment'] = templateSettings.backgroundColor
  if (templateSettings?.accentColor) userOverrides['--color-gold'] = templateSettings.accentColor
  if (templateSettings?.fontFamily) userOverrides['--font-serif'] = templateSettings.fontFamily

  const templateId = tpl.id

  function handlePrint() {
    window.print()
  }

  return (
    <div className={styles.wrapper}>
      {/* Toolbar — hidden on print */}
      <div className={`no-print ${styles.toolbar}`}>
        <button className={styles.printBtn} onClick={handlePrint} type="button">
          🖨 Print Sheet
        </button>
        <button className={styles.resetBtn} onClick={onReset} type="button">
          ← New Character
        </button>
      </div>

      {/* A4 sheet */}
      <div className={`sheet-preview ${styles.sheet}`} data-template={tpl.layout} style={userOverrides}>
        <div className={`sheet-grid ${styles.grid}`}>

          <div className={styles.headerArea}>
            <HeaderBanner character={character} templateId={templateId} />
          </div>

          <div className={styles.portraitArea}>
            <CharacterPortrait character={character} templateId={templateId} />
          </div>

          <div className={styles.raceClassArea}>
            <RaceClassInfo character={character} preset={preset} templateId={templateId} />
          </div>

          <div className={styles.backgroundArea}>
            <BackgroundInfo character={character} templateId={templateId} />
          </div>

          <div className={styles.abilityArea}>
            <AbilityScores character={character} templateId={templateId} />
          </div>

          <div className={styles.passiveArea}>
            <PassiveStats character={character} templateId={templateId} />
          </div>

          <div className={styles.inspirationArea}>
            <Inspiration character={character} templateId={templateId} />
          </div>

          <div className={styles.savingArea}>
            <SavingThrowsSkills character={character} preset={preset} templateId={templateId} />
          </div>

          <div className={styles.combatArea}>
            <CombatStats character={character} templateId={templateId} />
          </div>

          <div className={styles.hpArea}>
            <HPTracker character={character} templateId={templateId} />
          </div>

          <div className={styles.featurePrimaryArea}>
            <ClassFeaturePrimary character={character} preset={preset} templateId={templateId} />
          </div>

          <div className={styles.traitsArea}>
            <RaceClassTraits character={character} preset={preset} templateId={templateId} />
          </div>

          <div className={styles.featureSecondaryArea}>
            <ClassFeatureSecondary character={character} preset={preset} templateId={templateId} />
          </div>

          <div className={styles.abilitiesFeaturesArea}>
            <AbilitiesFeatures character={character} templateId={templateId} />
          </div>

          <div className={styles.subclassFeatsArea}>
            <SubclassFeats character={character} preset={preset} templateId={templateId} />
          </div>

          <div className={styles.attacksArea}>
            <AttacksCantrips character={character} templateId={templateId} />
          </div>

          <div className={styles.equipmentArea}>
            <Equipment character={character} templateId={templateId} />
          </div>

          <div className={styles.proficiencyArea}>
            <Proficiency character={character} templateId={templateId} />
          </div>
        </div>
      </div>
    </div>
  )
}
