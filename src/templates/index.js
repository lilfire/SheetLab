const DEFAULT_LAYOUT_CONFIG = [
  { moduleId: 'headerBanner',          gridArea: 'header',          visible: true },
  { moduleId: 'characterPortrait',     gridArea: 'portrait',        visible: true },
  { moduleId: 'raceClassInfo',         gridArea: 'raceclass',       visible: true },
  { moduleId: 'backgroundInfo',        gridArea: 'background',      visible: true },
  { moduleId: 'abilityScores',         gridArea: 'ability',         visible: true },
  { moduleId: 'passiveStats',          gridArea: 'passive',         visible: true },
  { moduleId: 'inspiration',           gridArea: 'insp',            visible: true },
  { moduleId: 'savingThrowsSkills',    gridArea: 'saving',          visible: true },
  { moduleId: 'combatStats',           gridArea: 'combat',          visible: true },
  { moduleId: 'hpTracker',             gridArea: 'hp',              visible: true },
  { moduleId: 'classFeaturePrimary',   gridArea: 'featurePrimary',  visible: true },
  { moduleId: 'raceClassTraits',       gridArea: 'traits',          visible: true },
  { moduleId: 'classFeatureSecondary', gridArea: 'featureSecondary', visible: true },
  { moduleId: 'abilitiesFeatures',     gridArea: 'abilities',       visible: true },
  { moduleId: 'subclassFeats',         gridArea: 'subclassFeats',   visible: true },
  { moduleId: 'attacksCantrips',       gridArea: 'attacks',         visible: true },
  { moduleId: 'equipment',             gridArea: 'equipment',       visible: true },
  { moduleId: 'proficiency',           gridArea: 'proficiency',     visible: true },
]

export const TEMPLATES = [
  {
    id: 'two-column',
    name: 'Two Column',
    description: 'Classic two-column D&D character sheet layout.',
    settings: {
      backgroundColor: '#f5f0e8',
      accentColor: '#8b6914',
      fontFamily: 'Georgia, serif',
    },
    layout: 'two-column',
    defaultLayoutConfig: DEFAULT_LAYOUT_CONFIG,
  },
  {
    id: 'three-column',
    name: 'Three Column',
    description: 'Compact three-column layout.',
    settings: {
      backgroundColor: '#f0f4f8',
    },
    layout: 'three-column',
    defaultLayoutConfig: DEFAULT_LAYOUT_CONFIG,
  },
]

export function getTemplate(id) {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0]
}
