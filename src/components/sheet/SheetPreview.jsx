import { Fragment, memo, useCallback, useMemo, useRef, useState } from 'react'
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
function useRenderMap(character, preset, moduleSettings, portraitImage, onPortraitImage) {
  return useMemo(() => ({
    header:          <HeaderBanner character={character} />,
    portrait:        <CharacterPortrait character={character} settings={moduleSettings.portrait} imageSrc={portraitImage} onImageChange={onPortraitImage} />,
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
  }), [character, preset, moduleSettings, portraitImage, onPortraitImage])
}

/**
 * A droppable grid cell shown in edit mode over empty areas of the layout.
 * Dropping a dragged module here moves it to (row, col).
 */
function CellDroppable({ absRow, displayRow, col }) {
  const { setNodeRef, isOver } = useDroppable({ id: `cell-${absRow}-${col}` })
  return (
    <div
      ref={setNodeRef}
      className={`${styles.cellDroppable}${isOver ? ' ' + styles.cellDroppableActive : ''}`}
      style={{ gridRow: displayRow, gridColumn: col }}
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
  onOpenSettings, onOpenRowSettings, portraitImage, onPortraitImage,
}) {
  const sheetRef = useRef(null)
  const gridRef = useRef(null)
  const renderMap = useRenderMap(character, preset, moduleSettings, portraitImage, onPortraitImage)
  const { pages, trackSizes } = usePageBreaks(gridRef, sheetRef, [layoutConfig, rowConfig])
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  // Figure out grid extents and which rows actually contain modules.
  const visibleModules = MODULE_REGISTRY
    .filter((m) => layoutConfig[m.key].visible)
    .map((m) => ({ ...m, lc: layoutConfig[m.key] }))
  const maxRow = visibleModules.length > 0
    ? Math.max(...visibleModules.map(({ lc }) => lc.row + lc.rowSpan - 1))
    : 0
  const occupiedRows = new Set()
  for (const { lc } of visibleModules) {
    for (let r = lc.row; r < lc.row + lc.rowSpan; r++) occupiedRows.add(r)
  }

  // Build grid-template-rows for the measurement grid (all rows, no 1fr).
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

  // Build grid-template-rows for a single page (last row gets 1fr to fill).
  function buildPageRows(page) {
    const tracks = []
    for (let r = page.startRow; r <= page.endRow; r++) {
      if (r === page.endRow) {
        tracks.push('1fr')
      } else {
        const mh = rowConfig?.[r]?.minHeight
        if (mh != null) {
          tracks.push(occupiedRows.has(r) ? `minmax(${mh}mm, max-content)` : `${mh}mm`)
        } else {
          tracks.push('minmax(48px, min-content)')
        }
      }
    }
    return tracks.join(' ')
  }

  // Row-settings gear uses pre-measured track sizes from the hook.
  function handleRowGearClick(row) {
    const mm = trackSizes?.[row - 1] ?? 0
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

  // Render edit-mode overlays (row zebra stripes + empty cell drop targets)
  // for a range of rows, with row numbers remapped by rowOffset for grid display.
  function renderEditOverlays(startRow, endRow, rowOffset, columns) {
    if (!isEditMode) return null
    const overlays = []
    for (let r = startRow; r <= endRow; r++) {
      const displayRow = r - rowOffset
      const i = r - 1
      overlays.push(
        <div
          key={`row-bg-${r}`}
          className={styles.editRowOverlay}
          style={{
            gridRow: displayRow,
            gridColumn: '1 / -1',
            background: i % 2 === 0
              ? 'rgba(148, 163, 184, 0.10)'
              : 'rgba(148, 163, 184, 0.04)',
          }}
        >
          <button
            type="button"
            className={styles.rowSettingsBtn}
            onClick={(e) => { e.stopPropagation(); handleRowGearClick(r) }}
            aria-label={`Row ${r} settings`}
            title={`Row ${r} settings`}
          >
            ⚙
          </button>
        </div>
      )
    }
    const cells = []
    for (let r = startRow; r <= endRow; r++) {
      const displayRow = r - rowOffset
      for (let c = 1; c <= columns; c++) {
        cells.push(
          <CellDroppable key={`cell-${r}-${c}`} absRow={r} displayRow={displayRow} col={c} />
        )
      }
    }
    return [...overlays, ...cells]
  }

  // Render module components, with row numbers remapped by rowOffset.
  function renderModules(moduleList, rowOffset) {
    return moduleList.map((mod) => (
      <DraggableModule
        key={mod.key}
        id={mod.key}
        areaClass={mod.areaClass}
        row={mod.lc.row - rowOffset}
        col={mod.lc.col}
        rowSpan={mod.lc.rowSpan}
        colSpan={mod.lc.colSpan}
        isEditMode={isEditMode}
        onOpenSettings={() => onOpenSettings(mod.key)}
        styleOverrides={mod.lc.style || {}}
        hideHeader={mod.lc.settings?.showHeader === false}
      >
        {renderMap[mod.key]}
      </DraggableModule>
    ))
  }

  // ── Measurement mode: single grid for reading track sizes ──
  if (!pages) {
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
            {renderEditOverlays(1, maxRow, 0, tpl.columns)}
            {renderModules(visibleModules, 0)}
          </div>
        </div>
      </DndContext>
    )
  }

  // ── Per-page mode: each page is its own A4 container with a grid ──
  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
      <div ref={sheetRef} className={styles.sheetContainer}>
        {pages.map((page, pageIdx) => {
          const rowOffset = page.startRow - 1
          const pageModules = visibleModules.filter((m) =>
            m.lc.row >= page.startRow && m.lc.row + m.lc.rowSpan - 1 <= page.endRow
          )

          return (
            <Fragment key={pageIdx}>
              {pageIdx > 0 && (
                <div className={`no-print ${styles.pageGap}`}>
                  <span className={styles.pageLabel}>Page {pageIdx + 1}</span>
                </div>
              )}
              <div
                className={`sheet-preview ${styles.page}`}
                data-template={tpl.layout}
                style={userOverrides}
              >
                <div
                  className={`sheet-grid ${styles.grid} ${styles.pageGrid}`}
                  style={{ gridTemplateRows: buildPageRows(page) }}
                >
                  {renderEditOverlays(page.startRow, page.endRow, rowOffset, tpl.columns)}
                  {renderModules(pageModules, rowOffset)}
                </div>
              </div>
            </Fragment>
          )
        })}
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
  const [portraitImage, setPortraitImage] = useState(null)
  const handlePortraitImage = useCallback((src) => setPortraitImage(src), [])

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
          portraitImage={portraitImage}
          onPortraitImage={handlePortraitImage}
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
