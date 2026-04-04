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
import styles from './SheetPreview.module.css'

export default function SheetPreview({ character, preset, onReset }) {
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
      <div className={`sheet-preview ${styles.sheet}`}>
        {/* Row 1: Header Banner + Portrait */}
        <div className={`sheet-grid ${styles.grid}`}>

          <div className={styles.headerArea}>
            <HeaderBanner character={character} />
          </div>

          <div className={styles.portraitArea}>
            <CharacterPortrait character={character} />
          </div>

          {/* Row 2: Race/Class Info + Background (full width) */}
          <div className={styles.raceClassArea}>
            <RaceClassInfo character={character} preset={preset} />
          </div>

          <div className={styles.backgroundArea}>
            <BackgroundInfo character={character} />
          </div>

          {/* Row 3: Left column — Ability Scores + Passive Stats + Inspiration */}
          <div className={styles.abilityArea}>
            <AbilityScores character={character} />
          </div>

          <div className={styles.passiveArea}>
            <PassiveStats character={character} />
          </div>

          <div className={styles.inspirationArea}>
            <Inspiration character={character} />
          </div>

          {/* Row 3: Right column — Saving Throws & Skills */}
          <div className={styles.savingArea}>
            <SavingThrowsSkills character={character} preset={preset} />
          </div>

          {/* Row 4: Combat Stats (full width) */}
          <div className={styles.combatArea}>
            <CombatStats character={character} />
          </div>

          {/* Row 5 */}
          <div className={styles.hpArea}>
            <HPTracker character={character} />
          </div>

          <div className={styles.featurePrimaryArea}>
            <ClassFeaturePrimary character={character} preset={preset} />
          </div>

          {/* Row 6 */}
          <div className={styles.traitsArea}>
            <RaceClassTraits character={character} preset={preset} />
          </div>

          <div className={styles.featureSecondaryArea}>
            <ClassFeatureSecondary character={character} preset={preset} />
          </div>

          {/* Row 7 */}
          <div className={styles.abilitiesFeaturesArea}>
            <AbilitiesFeatures character={character} />
          </div>

          <div className={styles.subclassFeatsArea}>
            <SubclassFeats character={character} preset={preset} />
          </div>

          {/* Row 8 */}
          <div className={styles.attacksArea}>
            <AttacksCantrips character={character} />
          </div>

          {/* Row 9 */}
          <div className={styles.equipmentArea}>
            <Equipment character={character} />
          </div>

          {/* Row 10 */}
          <div className={styles.proficiencyArea}>
            <Proficiency character={character} />
          </div>
        </div>
      </div>
    </div>
  )
}
