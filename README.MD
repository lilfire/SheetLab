# SheetLab

A webapp that generates printable, A4-sized character sheets for tabletop RPGs. Pick a race and class in a short wizard, tweak the layout, and print or export the result.

See [SPEC.md](./SPEC.md) for the design doc and [CLAUDE.md](./CLAUDE.md) for project-local engineering notes.

## How it works

```
Wizard (Race + Class + Template) → Preset selects modules → Layout engine arranges them → Printable A4 sheet
```

1. **Wizard** — four steps: Race, Class, Template, Preview. Race and Class can be skipped for a blank sheet.
2. **Preset** — maps a race/class combination to module content (class features, racial traits, default skill proficiencies).
3. **Modules** — 21 independent UI blocks (ability scores, HP tracker, attacks table, notes, etc.), each rendered into a CSS Grid cell.
4. **Template** — a layout profile (Two Column, Three Column, Modern) that supplies default grid coordinates, column count, CSS variables, and optional slot overrides.
5. **Print** — `@media print` rules and page-break logic in `usePageBreaks` split the grid across A4 pages.

## Features

- Four-step wizard with skippable Race/Class for generic sheets.
- Drag-and-drop module rearrangement powered by `@dnd-kit` (`DraggableModule` + grid reflow in `src/data/layoutReflow.js`).
- Component picker for toggling modules on and off per sheet.
- Per-module settings modal: show/hide sub-sections, line counts, colors, border style/width, background — all stored as style overrides.
- Row settings modal for adjusting row height behavior.
- Preset save/load via `useLayoutPresets` so custom layouts persist.
- Template extensions: a template can inject React overrides into named `TemplateSlot`s inside modules (see `src/templates/modern/extensions.jsx`).
- Automatic pagination across A4 pages for print and PDF export.

## Project structure

```
src/
  App.jsx                       Wizard ↔ SheetPreview shell
  components/
    wizard/                     Race / Class / Template / Preview steps
    sheet/                      SheetPreview, DraggableModule, ComponentPicker,
                                PresetManager, ModuleSettingsModal, RowSettingsModal
    modules/                    21 sheet modules (HPTracker, AbilityScores, …)
    template/                   TemplateSlot + TemplateExtensionsContext
  data/
    moduleRegistry.js           Canonical module list + buildInitialLayoutConfig
    moduleSettings.js           Per-module setting schemas (toggles, colors, selects)
    layoutReflow.js             Grid reflow / collision logic for drag-and-drop
    races.js, classes.js        Available options for the wizard
  presets/index.js              resolvePreset(race, class) → merged preset
  templates/
    index.js                    Template registry (two-column, three-column, modern)
    modern/                     Modern template extensions and slot overrides
  hooks/
    usePageBreaks.js            A4 page-break measurement (297mm − padding)
    useLayoutPresets.js         Layout persistence
  styles/
    global.css, print.css       Print rules (@page, @media print)
    templates/                  Per-template CSS scoped via [data-template="..."]
```

## Scripts

- `npm run dev` — start the Vite dev server.
- `npm run build` — production build into `dist/`.
- `npm run preview` — preview the built bundle.
- `npm test` — run Vitest tests (includes `SheetPreview`, `printCss`, and module style override specs).
- `npm run lint` — ESLint with `--max-warnings 0`.

## Print testing

Firefox and Chrome render `@media print` differently. Two debug scripts at the repo root drive headless browsers and save PDFs:

- `node debug-print.mjs` — Chrome via `puppeteer-core`.
- `node debug-firefox.mjs` — Firefox.

Browser paths used by the scripts:
- Chrome: `C:/Program Files (x86)/Google/Chrome/Application/chrome.exe`
- Firefox: `C:/Program Files/Mozilla Firefox/firefox.exe`

Known Firefox pitfalls are documented in `CLAUDE.md` (short version: use explicit `210mm` widths on printed pages; don't rely solely on `@page { size: ... }`).

## Docker

A two-stage Dockerfile builds the app and serves it via nginx:

```
docker compose up --build
```

`nginx.conf` provides SPA routing fallback and the image has a wget-based healthcheck.

## Stack

React 18 · Vite 5 · `@dnd-kit/core` · CSS Modules (components) + plain CSS (templates and print) · Vitest + Testing Library + jsdom · puppeteer-core for print debugging.
