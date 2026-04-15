import { useMemo, useState } from 'react'

const STORAGE_KEY = 'sheetlab:layoutPresets'

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeToStorage(presets) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
  } catch { /* quota exceeded — in-memory state still works for the session */ }
}

/**
 * Hook for managing layout presets in localStorage.
 * Returns only presets matching the given templateId.
 */
export function useLayoutPresets(templateId) {
  const [allPresets, setAllPresets] = useState(readFromStorage)

  const presets = useMemo(
    () => allPresets
      .filter((p) => p.templateId === templateId)
      .sort((a, b) => b.createdAt - a.createdAt),
    [allPresets, templateId],
  )

  function savePreset(name, layoutConfig, rowConfig) {
    const newPreset = {
      id: `preset_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      templateId,
      layoutConfig: structuredClone(layoutConfig),
      rowConfig: structuredClone(rowConfig),
      createdAt: Date.now(),
    }
    const updated = [...allPresets, newPreset]
    writeToStorage(updated)
    setAllPresets(updated)
  }

  function deletePreset(id) {
    const updated = allPresets.filter((p) => p.id !== id)
    writeToStorage(updated)
    setAllPresets(updated)
  }

  return { presets, savePreset, deletePreset }
}
