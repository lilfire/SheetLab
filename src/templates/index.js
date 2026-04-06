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
  },
  {
    id: 'three-column',
    name: 'Three Column',
    description: 'Compact three-column layout.',
    settings: {
      backgroundColor: '#f0f4f8',
    },
    layout: 'three-column',
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
  },
]

export function getTemplate(id) {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0]
}
