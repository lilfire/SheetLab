const COMMON_SETTINGS = [
  { key: 'showHeader', type: 'toggle', label: 'Show Header', default: null },
]

/**
 * Shared style settings appended to every module.
 * type: 'color' renders a color picker; null default = no override.
 */
const STYLE_SETTINGS = [
  { key: 'backgroundColor', type: 'color', label: 'Background Color', default: null },
  { key: 'borderColor', type: 'color', label: 'Border Color', default: null },
  { key: 'textColor', type: 'color', label: 'Text Color', default: null },
  { key: 'headingColor', type: 'color', label: 'Heading / Label Color', default: null },
  { key: 'accentColor', type: 'color', label: 'Accent Color', default: null },
  { key: 'mutedColor', type: 'color', label: 'Muted / Divider Color', default: null },
  {
    key: 'borderStyle',
    type: 'select',
    label: 'Border Style',
    options: [
      { value: 'none', label: 'None' },
      { value: 'solid', label: 'Solid' },
      { value: 'dashed', label: 'Dashed' },
      { value: 'dotted', label: 'Dotted' },
    ],
    default: null,
  },
  {
    key: 'borderWidth',
    type: 'select',
    label: 'Border Width',
    options: [
      { value: '1px', label: '1px' },
      { value: '2px', label: '2px' },
      { value: '3px', label: '3px' },
    ],
    default: null,
  },
]

/** Keys that map to layoutConfig[key].style rather than .settings */
export const STYLE_SETTING_KEYS = new Set(STYLE_SETTINGS.map((s) => s.key))

/**
 * MODULE_SETTINGS_SCHEMA — declares configurable settings per module.
 *
 * Every module has at least the shared style settings (gear icon always shown).
 *
 * Each setting has:
 *   key      — unique identifier within the module
 *   type     — 'select' | 'toggle' | 'color'
 *   label    — human-readable label
 *   options  — (for select) array of { value, label }
 *   default  — default value (null = defer to template CSS)
 */
export const MODULE_SETTINGS_SCHEMA = {
  header:           [...COMMON_SETTINGS, ...STYLE_SETTINGS],
  portrait: [
    ...COMMON_SETTINGS,
    {
      key: 'aspectRatio',
      type: 'select',
      label: 'Aspect Ratio',
      options: [
        { value: '4/2', label: 'Wide (4:2)' },
        { value: '3/2', label: 'Photo (3:2)' },
        { value: '1/1', label: 'Square (1:1)' },
        { value: '2/3', label: 'Tall (2:3)' },
        { value: '3/4', label: 'Portrait (3:4)' },
      ],
      default: '4/2',
    },
    ...STYLE_SETTINGS,
  ],
  raceclass: [
    ...COMMON_SETTINGS,
    { key: 'showRace', type: 'toggle', label: 'Show Race', default: null },
    { key: 'showClass', type: 'toggle', label: 'Show Class', default: null },
    { key: 'showSubclass', type: 'toggle', label: 'Show Subclass', default: null },
    { key: 'showLevel', type: 'toggle', label: 'Show Level', default: null },
    { key: 'showExperience', type: 'toggle', label: 'Show Experience', default: null },
    { key: 'showProficiencyBonus', type: 'toggle', label: 'Show Proficiency Bonus', default: null },
    { key: 'showBackgroundAlignment', type: 'toggle', label: 'Show Background & Alignment', default: null },
    { key: 'showCharacterFeatures', type: 'toggle', label: 'Show Character Features', default: null },
    { key: 'showCharacterTraits', type: 'toggle', label: 'Show Character Traits', default: null },
    ...STYLE_SETTINGS,
  ],
  background:       [...COMMON_SETTINGS, ...STYLE_SETTINGS],
  ability: [
    ...COMMON_SETTINGS,
    {
      key: 'showSavingThrows',
      type: 'toggle',
      label: 'Show Saving Throws',
      default: null,
    },
    {
      key: 'showSkills',
      type: 'toggle',
      label: 'Show Skills',
      default: null,
    },
    { key: 'shieldColor', type: 'color', label: 'Shield Color', default: null },
    ...STYLE_SETTINGS,
  ],
  passive:          [...COMMON_SETTINGS, ...STYLE_SETTINGS],
  insp:             [...COMMON_SETTINGS, ...STYLE_SETTINGS],
  saving:           [...COMMON_SETTINGS, ...STYLE_SETTINGS],
  combat:           [...COMMON_SETTINGS, ...STYLE_SETTINGS],
  hp: [
    ...COMMON_SETTINGS,
    { key: 'orbColor', type: 'color', label: 'Orb Border Color', default: null },
    { key: 'orbFill', type: 'color', label: 'Orb Fill Color', default: null },
    { key: 'labelColor', type: 'color', label: 'Label Color', default: null },
    ...STYLE_SETTINGS,
  ],
  deathsaves:       [...COMMON_SETTINGS, ...STYLE_SETTINGS],
  featurePrimary:   [...COMMON_SETTINGS, ...STYLE_SETTINGS],
  traits:           [...COMMON_SETTINGS, ...STYLE_SETTINGS],
  featureSecondary: [...COMMON_SETTINGS, ...STYLE_SETTINGS],
  abilities:        [...COMMON_SETTINGS, ...STYLE_SETTINGS],
  subclassFeats:    [...COMMON_SETTINGS, ...STYLE_SETTINGS],
  attacks:          [...COMMON_SETTINGS, ...STYLE_SETTINGS],
  equipment:        [...COMMON_SETTINGS, ...STYLE_SETTINGS],
  proficiency:      [...COMMON_SETTINGS, ...STYLE_SETTINGS],
}

/**
 * Returns the default settings object for a given module key.
 * Returns {} if the module has no settings.
 */
export function getDefaultSettings(moduleKey) {
  const schema = MODULE_SETTINGS_SCHEMA[moduleKey]
  if (!schema) return {}
  return Object.fromEntries(schema.map((s) => [s.key, s.default]))
}

/**
 * Returns true if the given module key has configurable settings.
 */
export function hasModuleSettings(moduleKey) {
  return moduleKey in MODULE_SETTINGS_SCHEMA
}
