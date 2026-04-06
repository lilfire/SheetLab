/**
 * Merges default CSS-module styles with template-specific overrides.
 *
 * For each class-name key the default and override values are concatenated so
 * both sets of rules apply — the override file's rules win via source order.
 *
 * When there is no override for the active template the original default
 * object is returned as-is (zero overhead).
 */
export function mergeStyles(defaultStyles, templateId, templateMap = {}) {
  const overrides = templateId ? templateMap[templateId] : null
  if (!overrides) return defaultStyles
  const merged = {}
  for (const key of new Set([...Object.keys(defaultStyles), ...Object.keys(overrides)])) {
    merged[key] = [defaultStyles[key], overrides[key]].filter(Boolean).join(' ')
  }
  return merged
}
