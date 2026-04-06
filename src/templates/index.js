/**
 * Template registry.
 *
 * Each template defines:
 *   id, name, description   — metadata
 *   settings                — CSS variable overrides
 *   layout                  — data-template value for CSS selectors
 *   columns                 — number of grid columns
 *   defaultLayout           — { [moduleKey]: { row, col, rowSpan, colSpan } }
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
      backgroundColor: '#f5f0e8',
      accentColor: '#8b6914',
      fontFamily: 'Georgia, serif',
    },
    layout: 'two-column',
    columns: 2,
    defaultLayout: {
      header:          { row: 1,  col: 1, rowSpan: 1, colSpan: 1 },
      portrait:        { row: 1,  col: 2, rowSpan: 3, colSpan: 1 },
      raceclass:       { row: 2,  col: 1, rowSpan: 1, colSpan: 1 },
      background:      { row: 3,  col: 1, rowSpan: 1, colSpan: 1 },
      ability:         { row: 4,  col: 1, rowSpan: 1, colSpan: 1 },
      saving:          { row: 4,  col: 2, rowSpan: 3, colSpan: 1 },
      passive:         { row: 5,  col: 1, rowSpan: 1, colSpan: 1 },
      insp:            { row: 6,  col: 1, rowSpan: 1, colSpan: 1 },
      combat:          { row: 7,  col: 1, rowSpan: 1, colSpan: 2 },
      hp:              { row: 8,  col: 1, rowSpan: 1, colSpan: 1 },
      featurePrimary:  { row: 8,  col: 2, rowSpan: 1, colSpan: 1 },
      traits:          { row: 9,  col: 1, rowSpan: 1, colSpan: 1 },
      featureSecondary:{ row: 9,  col: 2, rowSpan: 1, colSpan: 1 },
      abilities:       { row: 10, col: 1, rowSpan: 1, colSpan: 1 },
      subclassFeats:   { row: 10, col: 2, rowSpan: 4, colSpan: 1 },
      attacks:         { row: 11, col: 1, rowSpan: 1, colSpan: 1 },
      equipment:       { row: 12, col: 1, rowSpan: 1, colSpan: 1 },
      proficiency:     { row: 13, col: 1, rowSpan: 1, colSpan: 1 },
    },
  },
  {
    id: 'three-column',
    name: 'Three Column',
    description: 'Compact three-column layout.',
    settings: {
      backgroundColor: '#f0f4f8',
    },
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
      traits:          { row: 7, col: 1, rowSpan: 1, colSpan: 1 },
      attacks:         { row: 7, col: 2, rowSpan: 1, colSpan: 1 },
      subclassFeats:   { row: 7, col: 3, rowSpan: 3, colSpan: 1 },
      abilities:       { row: 8, col: 1, rowSpan: 1, colSpan: 1 },
      equipment:       { row: 8, col: 2, rowSpan: 1, colSpan: 1 },
      proficiency:     { row: 9, col: 1, rowSpan: 1, colSpan: 2 },
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Modern fantasy character sheet with card-based design.',
    settings: {
      backgroundColor: '#f5f0e8',
      accentColor: '#6b4c2a',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    },
    layout: 'modern',
    columns: 12,
    defaultLayout: {
      header:          { row: 1,  col: 1,  rowSpan: 1, colSpan: 8 },
      portrait:        { row: 1,  col: 9,  rowSpan: 2, colSpan: 4 },
      raceclass:       { row: 2,  col: 1,  rowSpan: 1, colSpan: 8 },
      ability:         { row: 3,  col: 1,  rowSpan: 1, colSpan: 12 },
      passive:         { row: 4,  col: 1,  rowSpan: 1, colSpan: 4 },
      saving:          { row: 4,  col: 5,  rowSpan: 2, colSpan: 4 },
      featurePrimary:  { row: 4,  col: 9,  rowSpan: 2, colSpan: 4 },
      insp:            { row: 5,  col: 1,  rowSpan: 1, colSpan: 4 },
      combat:          { row: 6,  col: 1,  rowSpan: 1, colSpan: 4 },
      hp:              { row: 6,  col: 5,  rowSpan: 2, colSpan: 4 },
      featureSecondary:{ row: 6,  col: 9,  rowSpan: 2, colSpan: 4 },
      background:      { row: 7,  col: 1,  rowSpan: 1, colSpan: 4 },
      traits:          { row: 8,  col: 1,  rowSpan: 1, colSpan: 4 },
      attacks:         { row: 8,  col: 5,  rowSpan: 2, colSpan: 4 },
      subclassFeats:   { row: 8,  col: 9,  rowSpan: 3, colSpan: 4 },
      abilities:       { row: 9,  col: 1,  rowSpan: 1, colSpan: 4 },
      equipment:       { row: 10, col: 1,  rowSpan: 1, colSpan: 4 },
      proficiency:     { row: 10, col: 5,  rowSpan: 1, colSpan: 4 },
    },
  },
]

export function getTemplate(id) {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0]
}
