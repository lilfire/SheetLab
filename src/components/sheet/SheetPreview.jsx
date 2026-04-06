import { memo, useCallback, useMemo, useState } from 'react'
import { DndContext } from '@dnd-kit/core'
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
import { MODULE_REGISTRY, buildInitialLayoutConfig } from '../../data/moduleRegistry.js'
import { reflowLayout } from '../../data/layoutReflow.js'
import DraggableModule from './DraggableModule.jsx'
import ComponentPicker from './ComponentPicker.jsx'
import styles from './SheetPreview.module.css'

/**
 * Build a map of module key → rendered React element.
 * Memoized on character, preset, templateId so modules don't remount unnecessarily.
 */
function useRenderMap(character, preset, templateId) {
  return useMemo(() => ({
    header:          <HeaderBanner character={character} templateId={templateId} />,
    portrait:        <CharacterPortrait character={character} templateId={templateId} />,
    raceclass:       <RaceClassInfo character={character} preset={preset} templateId={templateId} />,
    background:      <BackgroundInfo character={character} templateId={templateId} />,
    ability:         <AbilityScores character={character} preset={preset} templateId={templateId} />,
    passive:         <PassiveStats character={character} templateId={templateId} />,
    insp:            <Inspiration character={character} templateId={templateId} />,
    saving:          <SavingThrowsSkills character={character} preset={preset} templateId={templateId} />,
    combat:          <CombatStats character={character} templateId={templateId} />,
    hp:              <HPTracker character={character} templateId={templateId} />,
    featurePrimary:  <ClassFeaturePrimary character={character} preset={preset} templateId={templateId} />,
    traits:          <RaceClassTraits character={character} preset={preset} templateId={templateId} />,
    featureSecondary:<ClassFeatureSecondary character={character} preset={preset} templateId={templateId} />,
    abilities:       <AbilitiesFeatures character={character} templateId={templateId} />,
    subclassFeats:   <SubclassFeats character={character} preset={preset} templateId={templateId} />,
    attacks:         <AttacksCantrips character={character} templateId={templateId} />,
    equipment:       <Equipment character={character} templateId={templateId} />,
    proficiency:     <Proficiency character={character} templateId={templateId} />,
  }), [character, preset, templateId])
}

/**
 * SheetGrid renders the A4 sheet with all visible modules inside a DnD context.
 * Memoized so that parent state changes don't remount module children.
 */
const SheetGrid = memo(function SheetGrid({
  character, preset, templateId, tpl, userOverrides,
  layoutConfig, isEditMode, onRemove, onSwapAreas, onColSpan,
}) {
  const renderMap = useRenderMap(character, preset, templateId)

  function handleDragEnd({ active, over }) {
    if (over && active.id !== over.id) {
      onSwapAreas(String(active.id), String(over.id))
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        className={`sheet-preview ${styles.sheet}`}
        data-template={tpl.layout}
        style={userOverrides}
      >
        <div className={`sheet-grid ${styles.grid}`}>
          {MODULE_REGISTRY.map((mod) => {
            const lc = layoutConfig[mod.key]
            if (!lc.visible) return null
            return (
              <DraggableModule
                key={mod.key}
                id={mod.key}
                areaClass={mod.areaClass}
                row={lc.row}
                col={lc.col}
                rowSpan={lc.rowSpan}
                colSpan={lc.colSpan}
                maxColumns={tpl.columns}
                isEditMode={isEditMode}
                onRemove={() => onRemove(mod.key)}
                onColSpan={onColSpan}
                styleOverrides={lc.style || {}}
              >
                {renderMap[mod.key]}
              </DraggableModule>
            )
          })}
        </div>
      </div>
    </DndContext>
  )
})

export default function SheetPreview({ character, preset, template, templateSettings, initialModuleStyles = {}, onReset }) {
  const tpl = useMemo(() => getTemplate(template), [template])
  const [isEditMode, setIsEditMode] = useState(false)
  const [layoutConfig, setLayoutConfig] = useState(() => buildInitialLayoutConfig(template, initialModuleStyles))

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

  const handleSwapAreas = useCallback((keyA, keyB) => {
    setLayoutConfig((prev) => {
      const a = prev[keyA]
      const b = prev[keyB]
      return {
        ...prev,
        [keyA]: { ...a, row: b.row, col: b.col, rowSpan: b.rowSpan, colSpan: b.colSpan },
        [keyB]: { ...b, row: a.row, col: a.col, rowSpan: a.rowSpan, colSpan: a.colSpan },
      }
    })
  }, [])

  const handleColSpan = useCallback((key, delta) => {
    setLayoutConfig((prev) => {
      const lc = prev[key]
      const newSpan = Math.min(Math.max(1, lc.colSpan + delta), tpl.columns)
      let newCol = lc.col
      if (newCol + newSpan - 1 > tpl.columns) {
        newCol = tpl.columns - newSpan + 1
      }
      const updated = { ...prev, [key]: { ...lc, col: newCol, colSpan: newSpan } }
      return reflowLayout(updated, key, tpl.columns)
    })
  }, [tpl.columns])

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
        isEditMode={isEditMode}
        onRemove={handleRemove}
        onSwapAreas={handleSwapAreas}
        onColSpan={handleColSpan}
      />

      {/* ComponentPicker — shown only in edit mode, hidden on print */}
      {isEditMode && (
        <ComponentPicker layoutConfig={layoutConfig} onToggle={handleToggle} />
      )}
    </div>
  )
}
