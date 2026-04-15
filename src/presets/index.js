// import barbarian from './barbarian.json'

// Map of class name (lowercase) to preset JSON
const PRESET_MAP = {}

/**
 * resolvePreset(race, className) — merges race modifiers into the class preset.
 *
 * Returns a flat preset object with:
 *   - class: string
 *   - race: string
 *   - defaultSkillProficiencies: string[]
 *   - raceTraits: string[]  (from raceModifiers[race].traits, or [] if no match)
 *   - modules: { classFeaturePrimary, classFeatureSecondary, subclassFeats }
 *
 * For classes without a preset file, returns a minimal default preset so the
 * sheet still renders — this is intentional for v1 scope.
 */
export function resolvePreset(race, className) {
  if (!className) {
    // Generic preset when race/class are skipped
    return {
      class: null,
      race: race || null,
      defaultSkillProficiencies: [],
      raceTraits: [],
      modules: {
        classFeaturePrimary: {
          title: 'Primary Feature',
          description: '',
        },
        classFeatureSecondary: {
          title: 'Secondary Feature',
          description: '',
        },
        subclassFeats: {
          title: 'Subclass Feats',
          slots: 8,
        },
      },
    }
  }

  const key = className.toLowerCase()
  const classPreset = PRESET_MAP[key]

  if (!classPreset) {
    // Default preset for classes not yet implemented
    return {
      class: className,
      race: race || null,
      defaultSkillProficiencies: [],
      raceTraits: [],
      modules: {
        classFeaturePrimary: {
          title: `${className} Primary Feature`,
          description: 'Feature description coming soon.',
        },
        classFeatureSecondary: {
          title: `${className} Secondary Feature`,
          description: 'Feature description coming soon.',
        },
        subclassFeats: {
          title: 'Subclass Feats',
          slots: 8,
        },
      },
    }
  }

  const raceModifier = classPreset.raceModifiers?.[race]
  const raceTraits = raceModifier?.traits ?? []

  return {
    class: classPreset.class,
    race,
    defaultSkillProficiencies: classPreset.defaultSkillProficiencies,
    raceTraits,
    modules: classPreset.modules,
  }
}
