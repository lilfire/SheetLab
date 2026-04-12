import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { DndContext, PointerSensor, pointerWithin, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
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
import DeathSaves from '../modules/DeathSaves/DeathSaves.jsx'
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
import { STYLE_SETTING_KEYS } from '../../data/moduleSettings.js'
import ModuleSettingsModal from './ModuleSettingsModal.jsx'
import RowSettingsModal from './RowSettingsModal.jsx'
import { reflowLayout } from '../../data/layoutReflow.js'
import DraggableModule from './DraggableModule.jsx'
import ComponentPicker from './ComponentPicker.jsx'
import usePageBreaks from '../../hooks/usePageBreaks.js'
import { TemplateExtensionsContext } from '../template/TemplateExtensionsContext.jsx'
import styles from './SheetPreview.module.css'

/**
 * Build a map of module key → rendered React element.
 * Memoized on character, preset, moduleSettings so modules don't remount unnecessarily.
 * Modules are template-agnostic — template styling is applied via the
 * [data-template="..."] selector on the wrapper, scoped from src/styles/templates/.
 */
function useRenderMap(character, preset, moduleSettings) {
  return useMemo(() => ({
    header:          <HeaderBanner character={character} />,
    portrait:        <CharacterPortrait character={character} settings={moduleSettings.portrait} />,
    raceclass:       <RaceClassInfo character={character} preset={preset} settings={moduleSettings.raceclass} />,
    background:      <BackgroundInfo character={character} />,
    ability:         <AbilityScores character={character} preset={preset} settings={moduleSettings.ability} />,
    passive:         <PassiveStats character={character} />,
    insp:            <Inspiration character={character} />,
    saving:          <SavingThrowsSkills character={character} preset={preset} />,
    combat:          <CombatStats character={character} />,
    hp:              <HPTracker character={character} settings={moduleSettings.hp} />,
    deathsaves:      <DeathSaves character={character} settings={moduleSettings.deathsaves} />,
    featurePrimary:  <ClassFeaturePrimary character={character} preset={preset} />,
    traits:          <RaceClassTraits character={character} preset={preset} />,
    featureSecondary:<ClassFeatureSecondary character={character} preset={preset} />,
    abilities:       <AbilitiesFeatures character={character} />,
    subclassFeats:   <SubclassFeats character={character} preset={preset} />,
    attacks:         <AttacksCantrips character={character} />,
    equipment:       <Equipment character={character} />,
    proficiency:     <Proficiency character={character} />,
  }), [character, preset, moduleSettings])
}

/**
 * A droppable grid cell shown in edit mode over empty areas of the layout.
 * Dropping a dragged module here moves it to (row, col).
 */
function CellDroppable({ row, col }) {
  const { setNodeRef, isOver } = useDroppable({ id: `cell-${row}-${col}` })
  return (
    <div
      ref={setNodeRef}
      className={`${styles.cellDroppable}${isOver ? ' ' + styles.cellDroppableActive : ''}`}
      style={{ gridRow: row, gridColumn: col }}
    />
  )
}

/**
 * SheetGrid renders the A4 sheet with all visible modules inside a DnD context.
 * Memoized so that parent state changes don't remount module children.
 */
const SheetGrid = memo(function SheetGrid({
  character, preset, tpl, userOverrides,
  layoutConfig, rowConfig, moduleSettings, isEditMode, onMoveToCell,
  onOpenSettings, onOpenRowSettings,
}) {
  const sheetRef = useRef(null)
  const gridRef = useRef(null)
  const renderMap = useRenderMap(character, preset, moduleSettings)
  const { pageBreakLines } = usePageBreaks(gridRef, sheetRef, [layoutConfig, rowConfig])
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  // Figure out grid extents and which rows actually contain modules.
  const visibleModules = MODULE_REGISTRY
    .filter((m) => layoutConfig[m.key].visible)
    .map((m) => ({ key: m.key, lc: layoutConfig[m.key] }))
  const maxRow = visibleModules.length > 0
    ? Math.max(...visibleModules.map(({ lc }) => lc.row + lc.rowSpan - 1))
    : 0
  const occupiedRows = new Set()
  for (const { lc } of visibleModules) {
    for (let r = lc.row; r < lc.row + lc.rowSpan; r++) occupiedRows.add(r)
  }

  // Build an explicit grid-template-rows when there's any row-level state,
  // so per-row heights (or collapses) take effect. Rows without overrides
  // keep the default `minmax(48px, min-content)` behavior.
  const gridTemplateRows = (() => {
    if (maxRow === 0) return undefined
    const tracks = []
    for (let r = 1; r <= maxRow; r++) {
      const mh = rowConfig?.[r]?.minHeight
      if (mh != null) {
        tracks.push(occupiedRows.has(r) ? `minmax(${mh}mm, max-content)` : `${mh}mm`)
      } else {
        tracks.push('minmax(48px, min-content)')
      }
    }
    return tracks.join(' ')
  })()

  // When the row-settings gear is clicked, measure the row's currently-rendered
  // height so the modal can use it as the floor (min-height) for occupied rows.
  function handleRowGearClick(row) {
    const grid = gridRef.current
    const sheet = sheetRef.current
    if (!grid || !sheet) {
      onOpenRowSettings(row, 0)
      return
    }
    const pxPerMm = sheet.offsetWidth / 210
    const cs = getComputedStyle(grid)
    const tracks = cs.gridTemplateRows
      .split(' ')
      .map((t) => parseFloat(t))
      .filter((n) => !Number.isNaN(n))
    const px = tracks[row - 1] ?? 0
    const mm = pxPerMm > 0 ? Math.max(0, Math.round(px / pxPerMm)) : 0
    onOpenRowSettings(row, mm)
  }

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return
    const activeKey = String(active.id)
    const overId = String(over.id)
    if (overId.startsWith('cell-')) {
      const [, rowStr, colStr] = overId.split('-')
      onMoveToCell(activeKey, parseInt(rowStr, 10), parseInt(colStr, 10))
    } else {
      const targetLc = layoutConfig[overId]
      if (targetLc) onMoveToCell(activeKey, targetLc.row, targetLc.col)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
      <div
        ref={sheetRef}
        className={`sheet-preview ${styles.sheet}`}
        data-template={tpl.layout}
        style={userOverrides}
      >
        <div
          ref={gridRef}
          className={`sheet-grid ${styles.grid}`}
          style={gridTemplateRows ? { gridTemplateRows } : undefined}
        >
          {isEditMode && (() => {
            const rowOverlays = Array.from({ length: maxRow }, (_, i) => {
              const rowNum = i + 1
              return (
                <div
                  key={`row-bg-${rowNum}`}
                  className={styles.editRowOverlay}
                  style={{
                    gridRow: rowNum,
                    gridColumn: '1 / -1',
                    background: i % 2 === 0
                      ? 'rgba(148, 163, 184, 0.10)'
                      : 'rgba(148, 163, 184, 0.04)',
                  }}
                >
                  <button
                    type="button"
                    className={styles.rowSettingsBtn}
                    onClick={(e) => { e.stopPropagation(); handleRowGearClick(rowNum) }}
                    aria-label={`Row ${rowNum} settings`}
                    title={`Row ${rowNum} settings`}
                  >
                    ⚙
                  </button>
                </div>
              )
            })
            const cellDroppables = []
            for (let r = 1; r <= maxRow; r++) {
              for (let c = 1; c <= tpl.columns; c++) {
                cellDroppables.push(
                  <CellDroppable key={`cell-${r}-${c}`} row={r} col={c} />
                )
              }
            }
            return [...rowOverlays, ...cellDroppables]
          })()}
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
                isEditMode={isEditMode}
                onOpenSettings={() => onOpenSettings(mod.key)}
                styleOverrides={lc.style || {}}
                hideHeader={lc.settings?.showHeader === false}
              >
                {renderMap[mod.key]}
              </DraggableModule>
            )
          })}
        </div>
        {pageBreakLines.map(({ yPx, pageNumber }) => (
          <div
            key={pageNumber}
            className={`no-print ${styles.pageBreakLine}`}
            style={{ top: `${yPx}px` }}
          >
            <span className={styles.pageLabel}>Page {pageNumber}</span>
          </div>
        ))}
      </div>
    </DndContext>
  )
})

function isRowEmpty(row, layoutConfig) {
  for (const m of MODULE_REGISTRY) {
    const lc = layoutConfig[m.key]
    if (!lc.visible) continue
    if (row >= lc.row && row < lc.row + lc.rowSpan) return false
  }
  return true
}

export default function SheetPreview({ character, preset, template, templateSettings, onReset }) {
  const tpl = useMemo(() => getTemplate(template), [template])
  const [isEditMode, setIsEditMode] = useState(false)
  const [layoutConfig, setLayoutConfig] = useState(() => buildInitialLayoutConfig(template))
  const [rowConfig, setRowConfig] = useState({})
  const [settingsModalKey, setSettingsModalKey] = useState(null)
  const [rowSettingsModal, setRowSettingsModal] = useState(null)

  const moduleSettings = useMemo(() => {
    const s = {}
    for (const key in layoutConfig) {
      s[key] = layoutConfig[key].settings
    }
    return s
  }, [layoutConfig])

  const userOverrides = useMemo(() => {
    const o = {}
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

  const handleMoveToCell = useCallback((key, row, col) => {
    setLayoutConfig((prev) => {
      const lc = prev[key]
      const maxCol = tpl.columns - lc.colSpan + 1
      const newCol = Math.min(Math.max(1, col), maxCol)
      const newRow = Math.max(1, row)
      if (newCol === lc.col && newRow === lc.row) return prev
      const updated = { ...prev, [key]: { ...lc, row: newRow, col: newCol } }
      return reflowLayout(updated, key, tpl.columns)
    })
  }, [tpl.columns])

  const handleRowSpan = useCallback((key, delta) => {
    setLayoutConfig((prev) => {
      const lc = prev[key]
      const newSpan = Math.max(1, lc.rowSpan + delta)
      const updated = { ...prev, [key]: { ...lc, rowSpan: newSpan } }
      return reflowLayout(updated, key, tpl.columns)
    })
  }, [tpl.columns])

  const handleRowConfigChange = useCallback((row, updates) => {
    setRowConfig((prev) => {
      const merged = { ...(prev[row] ?? {}), ...updates }
      const hasValue = Object.values(merged).some((v) => v != null)
      const next = { ...prev }
      if (hasValue) next[row] = merged
      else delete next[row]
      return next
    })
  }, [])

  const handleOpenRowSettings = useCallback((row, measuredMm) => {
    setSettingsModalKey(null)
    setRowSettingsModal({ row, measuredMm })
  }, [])

  const handleOpenModuleSettings = useCallback((key) => {
    setRowSettingsModal(null)
    setSettingsModalKey(key)
  }, [])

  const handleSettingsChange = useCallback((key, newSettings) => {
    setLayoutConfig((prev) => {
      const styleUpdates = {}
      const settingsUpdates = {}
      for (const [k, v] of Object.entries(newSettings)) {
        if (STYLE_SETTING_KEYS.has(k)) {
          styleUpdates[k] = v
        } else {
          settingsUpdates[k] = v
        }
      }

      const currentStyle = { ...prev[key].style }
      for (const [k, v] of Object.entries(styleUpdates)) {
        if (v == null) {
          delete currentStyle[k]
        } else {
          currentStyle[k] = v
        }
      }

      return {
        ...prev,
        [key]: {
          ...prev[key],
          settings: { ...prev[key].settings, ...settingsUpdates },
          style: currentStyle,
        },
      }
    })
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

      <TemplateExtensionsContext.Provider value={tpl.extensions ?? {}}>
        <SheetGrid
          character={character}
          preset={preset}
          tpl={tpl}
          userOverrides={userOverrides}
          layoutConfig={layoutConfig}
          rowConfig={rowConfig}
          moduleSettings={moduleSettings}
          isEditMode={isEditMode}
          onMoveToCell={handleMoveToCell}
          onOpenSettings={handleOpenModuleSettings}
          onOpenRowSettings={handleOpenRowSettings}
        />
      </TemplateExtensionsContext.Provider>

      {/* ComponentPicker — shown only in edit mode, hidden on print */}
      {isEditMode && (
        <ComponentPicker layoutConfig={layoutConfig} onToggle={handleToggle} />
      )}

      {/* Module settings modal */}
      {settingsModalKey && (
        <ModuleSettingsModal
          moduleKey={settingsModalKey}
          moduleName={MODULE_REGISTRY.find((m) => m.key === settingsModalKey)?.name}
          settings={{ ...layoutConfig[settingsModalKey].settings, ...layoutConfig[settingsModalKey].style }}
          colSpan={layoutConfig[settingsModalKey].colSpan}
          rowSpan={layoutConfig[settingsModalKey].rowSpan}
          maxColumns={tpl.columns}
          onSettingsChange={handleSettingsChange}
          onColSpan={handleColSpan}
          onRowSpan={handleRowSpan}
          onRemove={handleRemove}
          onClose={() => setSettingsModalKey(null)}
        />
      )}

      {/* Row settings modal */}
      {rowSettingsModal && (
        <RowSettingsModal
          row={rowSettingsModal.row}
          isEmpty={isRowEmpty(rowSettingsModal.row, layoutConfig)}
          initialMm={rowSettingsModal.measuredMm}
          minHeight={rowConfig[rowSettingsModal.row]?.minHeight ?? null}
          onChange={handleRowConfigChange}
          onClose={() => setRowSettingsModal(null)}
        />
      )}
    </div>
  )
}
