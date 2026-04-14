import { getTemplate } from '../templates/index.js'
import { getDefaultSettings } from './moduleSettings.js'

/**
 * MODULE_REGISTRY — canonical list of all 20 sheet modules.
 *
 * Each entry describes:
 *   key        — unique identifier used in layoutConfig
 *   name       — human-readable label shown in ComponentPicker
 *   areaClass  — corresponds to the CSS module class in SheetPreview.module.css
 */
export const MODULE_REGISTRY = [
  { key: 'header',          name: 'Character Name',            areaClass: 'headerArea' },
  { key: 'portrait',        name: 'Character Portrait',        areaClass: 'portraitArea' },
  { key: 'raceclass',       name: 'Race & Class Info',         areaClass: 'raceClassArea' },
  { key: 'background',      name: 'Background Info',           areaClass: 'backgroundArea' },
  { key: 'ability',         name: 'Ability Scores',            areaClass: 'abilityArea' },
  { key: 'passive',         name: 'Passive Stats',             areaClass: 'passiveArea' },
  { key: 'insp',            name: 'Inspiration',               areaClass: 'inspirationArea' },
  { key: 'saving',          name: 'Saving Throws & Skills',    areaClass: 'savingArea', defaultVisible: false },
  { key: 'combat',          name: 'Combat Stats',              areaClass: 'combatArea' },
  { key: 'hp',              name: 'HP Tracker',                areaClass: 'hpArea' },
  { key: 'hitdice',         name: 'Hit Dice',                  areaClass: 'hitDiceArea' },
  { key: 'deathsaves',      name: 'Death Saves',               areaClass: 'deathSavesArea' },
  { key: 'featurePrimary',  name: 'Class Feature (Primary)',   areaClass: 'featurePrimaryArea' },
  { key: 'traits',          name: 'Race / Class Traits',       areaClass: 'traitsArea' },
  { key: 'featureSecondary',name: 'Class Feature (Secondary)', areaClass: 'featureSecondaryArea' },
  { key: 'abilities',       name: 'Abilities & Features',      areaClass: 'abilitiesFeaturesArea' },
  { key: 'subclassFeats',   name: 'Subclass Feats',            areaClass: 'subclassFeatsArea' },
  { key: 'attacks',         name: 'Attacks & Cantrips',        areaClass: 'attacksArea' },
  { key: 'equipment',       name: 'Equipment',                 areaClass: 'equipmentArea' },
  { key: 'proficiency',     name: 'Proficiency',               areaClass: 'proficiencyArea' },
  { key: 'notes',           name: 'Notes',                     areaClass: 'notesArea' },
]

/**
 * Build the initial layoutConfig from a template's defaultLayout.
 * @param {string} templateId — template identifier
 * Returns { [key]: { visible, row, col, rowSpan, colSpan, style, settings } }
 */
export function buildInitialLayoutConfig(templateId) {
  const tpl = getTemplate(templateId)
  const layout = tpl.defaultLayout
  return Object.fromEntries(
    MODULE_REGISTRY.map((m) => {
      const pos = layout[m.key] || { row: 1, col: 1, rowSpan: 1, colSpan: 1 }
      const { visible: tplVisible, settings: tplSettings, ...coords } = pos
      const visible = tplVisible !== undefined ? tplVisible : m.defaultVisible !== false
      const settings = { ...getDefaultSettings(m.key), ...tplSettings }
      return [m.key, { visible, ...coords, style: {}, settings }]
    })
  )
}
