/**
 * MODULE_REGISTRY — canonical list of all 18 sheet modules.
 *
 * Each entry describes:
 *   key        — unique identifier used in layoutConfig
 *   name       — human-readable label shown in ComponentPicker
 *   areaClass  — corresponds to the CSS module class in SheetPreview.module.css
 *   gridArea   — CSS grid-area name used in the template layout
 */
export const MODULE_REGISTRY = [
  { key: 'header',          name: 'Header Banner',             areaClass: 'headerArea',           gridArea: 'header' },
  { key: 'portrait',        name: 'Character Portrait',        areaClass: 'portraitArea',         gridArea: 'portrait' },
  { key: 'raceclass',       name: 'Race & Class Info',         areaClass: 'raceClassArea',        gridArea: 'raceclass' },
  { key: 'background',      name: 'Background Info',           areaClass: 'backgroundArea',       gridArea: 'background' },
  { key: 'ability',         name: 'Ability Scores',            areaClass: 'abilityArea',          gridArea: 'ability' },
  { key: 'passive',         name: 'Passive Stats',             areaClass: 'passiveArea',          gridArea: 'passive' },
  { key: 'insp',            name: 'Inspiration',               areaClass: 'inspirationArea',      gridArea: 'insp' },
  { key: 'saving',          name: 'Saving Throws & Skills',    areaClass: 'savingArea',           gridArea: 'saving' },
  { key: 'combat',          name: 'Combat Stats',              areaClass: 'combatArea',           gridArea: 'combat' },
  { key: 'hp',              name: 'HP Tracker',                areaClass: 'hpArea',               gridArea: 'hp' },
  { key: 'featurePrimary',  name: 'Class Feature (Primary)',   areaClass: 'featurePrimaryArea',   gridArea: 'featurePrimary' },
  { key: 'traits',          name: 'Race / Class Traits',       areaClass: 'traitsArea',           gridArea: 'traits' },
  { key: 'featureSecondary',name: 'Class Feature (Secondary)', areaClass: 'featureSecondaryArea', gridArea: 'featureSecondary' },
  { key: 'abilities',       name: 'Abilities & Features',      areaClass: 'abilitiesFeaturesArea',gridArea: 'abilities' },
  { key: 'subclassFeats',   name: 'Subclass Feats',            areaClass: 'subclassFeatsArea',    gridArea: 'subclassFeats' },
  { key: 'attacks',         name: 'Attacks & Cantrips',        areaClass: 'attacksArea',          gridArea: 'attacks' },
  { key: 'equipment',       name: 'Equipment',                 areaClass: 'equipmentArea',        gridArea: 'equipment' },
  { key: 'proficiency',     name: 'Proficiency',               areaClass: 'proficiencyArea',      gridArea: 'proficiency' },
]

/**
 * Build the initial layoutConfig: all modules visible, each in its natural grid slot.
 * @param {Object} initialStyles - Optional map of { [moduleKey]: { backgroundColor?, borderColor?, borderStyle?, borderWidth? } }
 * Returns { [key]: { visible: true, gridArea: string, style: object } }
 */
export function buildInitialLayoutConfig(initialStyles = {}) {
  return Object.fromEntries(MODULE_REGISTRY.map((m) => [m.key, {
    visible: true,
    gridArea: m.gridArea,
    style: initialStyles[m.key] || {},
  }]))
}
