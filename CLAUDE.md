# SheetLab — Claude Code Guidelines

## Testing

### Browser Testing
Always test in **both Chrome and Firefox** when making changes that affect:
- Print / PDF output
- CSS layout (especially CSS Grid, Flexbox)
- `@media print` rules
- Page break logic

Firefox and Chrome have different print rendering engines with different bugs.
Use the debug scripts in the repo root (`debug-print.mjs`, `debug-firefox.mjs`) to
generate PDFs from headless Chrome and Firefox and visually verify the output.

**Browser paths on this machine:**
- Chrome: `C:/Program Files (x86)/Google/Chrome/Application/chrome.exe`
- Firefox: `C:/Program Files/Mozilla Firefox/firefox.exe`

### Known Firefox Print Pitfalls
- `width: 100%` on printed elements can resolve to zero if the parent flex/grid
  container has no explicit width. Use explicit `width: 210mm` for A4 pages instead.
- Firefox does not fully support `@page { size: ... }` — don't rely on it alone
  for page dimensions.

## Build & Run
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm test` — run Vitest tests

## Architecture
- React 18 SPA with Vite
- CSS Modules for component styles, plain CSS for templates and print
- Page break logic lives in `src/hooks/usePageBreaks.js`
- Print styles in `src/styles/print.css`
- Per-page grid layout in `src/components/sheet/SheetPreview.jsx`
