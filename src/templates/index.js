import modernExtensions from './modern/extensions.jsx'

/**
 * Template registry.
 *
 * Each template defines:
 *   id, name, description   — metadata
 *   settings                — CSS variable overrides
 *   layout                  — data-template value for CSS selectors
 *   columns                 — number of grid columns
 *   defaultLayout           — { [moduleKey]: { row, col, rowSpan, colSpan } }
 *   extensions              — optional { [slotName]: Component } map injected
 *                             via TemplateExtensionsContext; templates may
 *                             override or wrap any <TemplateSlot> in modules.
 *
 * The defaultLayout uses 1-based integer grid coordinates so that modules
 * can freely span multiple columns without the restrictions of named areas.
 */
export const TEMPLATES = [
  {
    id: 'two-column',
    name: 'Two Column',
    description: 'Classic two-column D&D character sheet layout.',
    settings: {
      accentColor: '#2563eb',
      fontFamily: "'Inter', system-ui, sans-serif",
    },
    layout: 'two-column',
    columns: 2,
    defaultLayout: {
      header:          { row: 1,  col: 1, rowSpan: 1, colSpan: 1 },
      portrait:        { row: 1,  col: 2, rowSpan: 2, colSpan: 1 },
      raceclass:       { row: 2,  col: 1, rowSpan: 1, colSpan: 1 },
      background:      { row: 3,  col: 1, rowSpan: 1, colSpan: 1 },
      ability:         { row: 4,  col: 1, rowSpan: 1, colSpan: 1 },
      saving:          { row: 4,  col: 2, rowSpan: 3, colSpan: 1 },
      passive:         { row: 5,  col: 1, rowSpan: 1, colSpan: 1 },
      insp:            { row: 6,  col: 1, rowSpan: 1, colSpan: 1 },
      combat:          { row: 7,  col: 1, rowSpan: 1, colSpan: 2 },
      hp:              { row: 8,  col: 1, rowSpan: 1, colSpan: 1 },
      hitdice:         { row: 9,  col: 1, rowSpan: 1, colSpan: 1 },
      deathsaves:      { row: 8,  col: 2, rowSpan: 1, colSpan: 1 },
      featurePrimary:  { row: 10, col: 1, rowSpan: 1, colSpan: 1 },
      traits:          { row: 10, col: 2, rowSpan: 1, colSpan: 1 },
      featureSecondary:{ row: 11, col: 1, rowSpan: 1, colSpan: 1 },
      abilities:       { row: 11, col: 2, rowSpan: 1, colSpan: 1 },
      subclassFeats:   { row: 12, col: 1, rowSpan: 1, colSpan: 1 },
      attacks:         { row: 12, col: 2, rowSpan: 1, colSpan: 1 },
      equipment:       { row: 13, col: 2, rowSpan: 1, colSpan: 1 },
      proficiency:     { row: 14, col: 2, rowSpan: 1, colSpan: 1 },
      notes:           { row: 13, col: 1, rowSpan: 1, colSpan: 1 },
    },
  },
  {
    id: 'three-column',
    name: 'Three Column',
    description: 'Compact three-column layout.',
    settings: {},
    layout: 'three-column',
    columns: 3,
    defaultLayout: {
      header:          { row: 1, col: 1, rowSpan: 1, colSpan: 2 },
      portrait:        { row: 1, col: 3, rowSpan: 2, colSpan: 1 },
      raceclass:       { row: 2, col: 1, rowSpan: 1, colSpan: 2 },
      ability:         { row: 3, col: 1, rowSpan: 1, colSpan: 1 },
      saving:          { row: 3, col: 2, rowSpan: 1, colSpan: 1 },
      featurePrimary:  { row: 3, col: 3, rowSpan: 2, colSpan: 1 },
      passive:         { row: 4, col: 1, rowSpan: 1, colSpan: 1 },
      combat:          { row: 4, col: 2, rowSpan: 2, colSpan: 1 },
      insp:            { row: 5, col: 1, rowSpan: 1, colSpan: 1 },
      featureSecondary:{ row: 5, col: 3, rowSpan: 2, colSpan: 1 },
      background:      { row: 6, col: 1, rowSpan: 1, colSpan: 1 },
      hp:              { row: 6, col: 2, rowSpan: 1, colSpan: 1 },
      hitdice:         { row: 7, col: 2, rowSpan: 1, colSpan: 1 },
      traits:          { row: 8, col: 1, rowSpan: 1, colSpan: 1 },
      attacks:         { row: 8, col: 2, rowSpan: 1, colSpan: 1 },
      deathsaves:      { row: 8, col: 3, rowSpan: 1, colSpan: 1 },
      abilities:       { row: 9, col: 1, rowSpan: 1, colSpan: 1 },
      equipment:       { row: 9, col: 2, rowSpan: 1, colSpan: 1 },
      subclassFeats:   { row: 9, col: 3, rowSpan: 1, colSpan: 1 },
      proficiency:     { row: 10, col: 1, rowSpan: 1, colSpan: 2 },
      notes:           { row: 10, col: 3, rowSpan: 1, colSpan: 1 },
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Modern fantasy character sheet with card-based design.',
    settings: {
      accentColor: '#2563eb',
      fontFamily: "'Inter', system-ui, sans-serif",
    },
    layout: 'modern',
    columns: 12,
    defaultLayout: {
      header:          { row: 1, col: 1,  rowSpan: 1, colSpan: 4, settings: { fillRowHeight: true } },
      portrait:        { row: 1, col: 9,  rowSpan: 2, colSpan: 4, settings: { showHeader: false, aspectRatio: '4/2', showMask: false } },
      raceclass:       { row: 2, col: 1,  rowSpan: 1, colSpan: 8, settings: { showExperience: false, showProficiencyBonus: false, showBackgroundAlignment: false, showCharacterFeatures: false, showCharacterTraits: false } },
      background:      { row: 10, col: 1, rowSpan: 1, colSpan: 4, visible: false },
      ability:         { row: 3, col: 1,  rowSpan: 1, colSpan: 12 },
      passive:         { row: 6, col: 5,  rowSpan: 2, colSpan: 3 },
      insp:            { row: 5, col: 5,  rowSpan: 1, colSpan: 3 },
      saving:          { row: 4, col: 5,  rowSpan: 2, colSpan: 4, visible: false },
      combat:          { row: 1, col: 5,  rowSpan: 1, colSpan: 4, settings: { showHeader: false } },
      hp:              { row: 4, col: 1,  rowSpan: 4, colSpan: 4 },
      hitdice:         { row: 7, col: 1,  rowSpan: 1, colSpan: 4, visible: false },
      deathsaves:      { row: 4, col: 5,  rowSpan: 1, colSpan: 3 },
      featurePrimary:  { row: 14, col: 5, rowSpan: 2, colSpan: 4, visible: false, settings: { lineCount: 6 } },
      traits:          { row: 14, col: 1, rowSpan: 1, colSpan: 4, visible: false, settings: { lineCount: 6 } },
      featureSecondary:{ row: 9,  col: 9, rowSpan: 2, colSpan: 4, visible: false, settings: { lineCount: 6 } },
      abilities:       { row: 15, col: 1, rowSpan: 1, colSpan: 4, visible: false, settings: { lineCount: 6 } },
      subclassFeats:   { row: 17, col: 5, rowSpan: 1, colSpan: 4, visible: false, settings: { lineCount: 8 } },
      attacks:         { row: 8, col: 1,  rowSpan: 1, colSpan: 12, settings: { lineCount: 7 } },
      equipment:       { row: 5, col: 9,  rowSpan: 3, colSpan: 4, visible: false, settings: { lineCount: 8 } },
      proficiency:     { row: 18, col: 5, rowSpan: 1, colSpan: 4, visible: false },
      notes:           { row: 4, col: 8,  rowSpan: 4, colSpan: 5, settings: { lineCount: 9 } },
    },
    extensions: modernExtensions,
  },
]

export function getTemplate(id) {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0]
}
