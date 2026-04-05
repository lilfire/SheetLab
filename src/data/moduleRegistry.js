/**
 * MODULE_REGISTRY — canonical list of all 18 sheet modules.
 *
 * Each entry describes:
 *   key        — unique identifier used in layoutConfig
 *   name       — human-readable label shown in ComponentPicker
 *   areaClass  — corresponds to the CSS module class in SheetPreview.module.css
 */
export const MODULE_REGISTRY = [
  { key: 'header',          name: 'Header Banner',             areaClass: 'headerArea' },
  { key: 'portrait',        name: 'Character Portrait',        areaClass: 'portraitArea' },
  { key: 'raceclass',       name: 'Race & Class Info',         areaClass: 'raceClassArea' },
  { key: 'background',      name: 'Background Info',           areaClass: 'backgroundArea' },
  { key: 'ability',         name: 'Ability Scores',            areaClass: 'abilityArea' },
  { key: 'passive',         name: 'Passive Stats',             areaClass: 'passiveArea' },
  { key: 'insp',            name: 'Inspiration',               areaClass: 'inspirationArea' },
  { key: 'saving',          name: 'Saving Throws & Skills',    areaClass: 'savingArea' },
  { key: 'combat',          name: 'Combat Stats',              areaClass: 'combatArea' },
  { key: 'hp',              name: 'HP Tracker',                areaClass: 'hpArea' },
  { key: 'featurePrimary',  name: 'Class Feature (Primary)',   areaClass: 'featurePrimaryArea' },
  { key: 'traits',          name: 'Race / Class Traits',       areaClass: 'traitsArea' },
  { key: 'featureSecondary',name: 'Class Feature (Secondary)', areaClass: 'featureSecondaryArea' },
  { key: 'abilities',       name: 'Abilities & Features',      areaClass: 'abilitiesFeaturesArea' },
  { key: 'subclassFeats',   name: 'Subclass Feats',            areaClass: 'subclassFeatsArea' },
  { key: 'attacks',         name: 'Attacks & Cantrips',        areaClass: 'attacksArea' },
  { key: 'equipment',       name: 'Equipment',                 areaClass: 'equipmentArea' },
  { key: 'proficiency',     name: 'Proficiency',               areaClass: 'proficiencyArea' },
]

/**
 * Build the initial layoutConfig: all modules visible.
 * Returns { [key]: { visible: true } }
 */
export function buildInitialLayoutConfig() {
  return Object.fromEntries(MODULE_REGISTRY.map((m) => [m.key, { visible: true }]))
}
