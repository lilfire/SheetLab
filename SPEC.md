# SheetLab — Modular Character Sheet Generator

SheetLab is a webapp that generates printable, A4-sized character sheets for tabletop RPGs. Users pick a **race** and **class** through a wizard, and the app assembles the correct set of modules into a styled, print-ready character sheet.

## How It Works

```
Wizard (Race + Class) → Preset selects modules → Layout engine arranges them → Printable A4 sheet
```

1. **Wizard** — A step-by-step flow where the user selects race and class.
2. **Preset** — A JSON configuration that maps each race/class combination to the modules it needs and their layout positions.
3. **Modules** — Reusable UI components, each representing one "box" on the character sheet.
4. **Layout Engine** — Arranges selected modules into an A4 page matching the visual style of the inspiration.
5. **Print / Export** — CSS print styles produce a clean A4 page. Optional PDF export.

---

## Modules

Every distinct section on the character sheet is a standalone module. Some modules are **static** (present on every sheet), while others are **dynamic** (swapped in/out based on race, class, or subclass).

### Static Modules (always present)

| #   | Module                     | Description                                                                                                  |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | **Header Banner**          | Decorative banner with character name input                                                                  |
| 2   | **Character Portrait**     | Image upload area or placeholder portrait                                                                    |
| 3   | **Race & Class Info**      | Fields for Race, Class, and Experience                                                                       |
| 4   | **Background Info**        | Background & Alignment, Character Features, Character Traits                                                 |
| 5   | **Ability Scores**         | Six ability scores (STR, DEX, CON, INT, WIS, CHA) displayed as shield/hexagon shapes with score and modifier |
| 6   | **Saving Throws & Skills** | Checkboxes and modifier fields for all saving throws and skills, grouped by ability                          |
| 7   | **Passive Stats**          | Passive Perception and Passive Investigation values                                                          |
| 8   | **Inspiration**            | Inspiration tracker checkbox                                                                                 |
| 9   | **Combat Stats**           | Armor Class, Speed, and Initiative in circular/shield elements                                               |
| 10  | **HP Tracker**             | Max HP, Current HP, and Temp HP in an ornate circular design                                                 |
| 11  | **Abilities & Features**   | General list of abilities and features (name, source, description)                                           |
| 12  | **Attacks & Cantrips**     | Table with columns: Name, Range, Hit/DC, Action, Damage, Notes                                               |
| 13  | **Equipment**              | Equipment list with carrying capacity reference                                                              |
| 14  | **Proficiency**            | Armour, Weapons, Tools, and Languages proficiency lists                                                      |

### Dynamic Modules (vary by race, class, or subclass)

| #   | Module                        | Description                                                                                              | Varies by        |
| --- | ----------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------- |
| 15  | **Race/Class Traits**         | Trait list specific to the chosen race and class                                                         | Race + Class     |
| 16  | **Class Feature (Primary)**   | Main class feature box with description (e.g. Barbarian → "Rage", Wizard → "Spellcasting")               | Class            |
| 17  | **Class Feature (Secondary)** | Secondary class feature (e.g. Barbarian → "Brutal Critical", Rogue → "Sneak Attack")                     | Class            |
| 18  | **Subclass Feats**            | Subclass-specific feat list (e.g. Barbarian → "Primal Path Feats", Wizard → "Arcane Tradition Features") | Class (subclass) |

---

## Wizard Flow

### Step 1 — Pick Race

Select from available races (e.g. Human, Elf, Dwarf, Halfling, etc.). The selection determines racial traits for module 15.

### Step 2 — Pick Class

Select from available classes (e.g. Barbarian, Fighter, Wizard, Rogue, etc.). The selection determines:

- Which dynamic modules (16, 17, 18) to include and their content
- Default skill proficiencies for module 6
- Class-specific traits for module 15

### Step 3 — Preview

The app assembles all static modules + the correct dynamic modules and renders a live preview of the A4 character sheet in the visual style of the inspiration image.

### Step 4 — Print / Export

The user prints the sheet directly (CSS `@media print` for clean A4 output) or exports to PDF.

---

## Preset Structure

Each class/race combination maps to a preset. Presets are JSON objects that tell the layout engine which modules to render and what content to inject into dynamic modules.

```json
{
  "race": "Human",
  "class": "Barbarian",
  "modules": {
    "raceClassTraits": {
      "traits": [
        "+1 to All Ability Scores",
        "Extra Language"
      ]
    },
    "classFeaturePrimary": {
      "title": "Rage",
      "description": "Advantage on Strength checks and saving throws. Resistance to bludgeoning, piercing and slashing damage. ..."
    },
    "classFeatureSecondary": {
      "title": "Brutal Critical",
      "description": "Roll one additional weapon damage die when determining extra damage for a critical hit."
    },
    "subclassFeats": {
      "title": "Primal Path Feats",
      "slots": 8
    }
  }
}
```

---

## Page Layout

The A4 sheet follows a two-column layout inspired by the reference image:

```
+-----------------------------------------------+
|  [Header Banner — Character Name]   [Portrait] |
+-----------------------------------------------+
| Race / Class / Experience                      |
| Background Info                                |
+------------------------+-----------------------+
| Ability Scores (6)     | Saving Throws & Skills|
| Passive Stats          |                       |
| Inspiration            |                       |
+------------------------+-----------------------+
| Combat Stats (AC/Spd/Init)                     |
+------------------------+-----------------------+
| HP Tracker             | Class Feature Primary |
+------------------------+-----------------------+
| Race/Class Traits      | Class Feature Second. |
+------------------------+-----------------------+
| Abilities & Features   | Subclass Feats        |
+------------------------+-----------------------+
| Attacks & Cantrips     |                       |
+------------------------+                       |
| Equipment              |                       |
+------------------------+-----------------------+
| Proficiency            |                       |
+------------------------+-----------------------+
```

---

## Tech Stack

- **Frontend framework** — Component-based (React, Vue, or Svelte) so each module is a self-contained component
- **Styling** — CSS with `@media print` rules targeting A4 dimensions (210mm x 297mm) - Each Component has it own stylesheet
- **Preset data** — JSON files per class, with race modifiers layered on top
- **No backend required** — All generation happens client-side

---

## Visual Style

- Decorative borders and ornamental dividers
- Shield and hexagonal shapes for ability scores
- Ornate circular HP tracker
- Scroll/banner element for the character name
- Serif font for headers, clean font for field inputs
  
  
