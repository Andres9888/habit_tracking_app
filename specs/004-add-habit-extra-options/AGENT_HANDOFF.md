# Agent Handoff — Add Habit "Extra Options" Open List

> **For the implementing agent.** This brief is self-contained. Build the per-habit "extra options"
> section on the Add Habit page to match the reference image below. Follow the exact copy, tokens,
> and component contracts. Do not invent new visual patterns.

## Reference image (build to match this)

![Target design — Add Habit extra-options as an open, plain-language list](./assets/after.png)

Context of the change (what it replaces):

![Before → after](./assets/before-after.png)

---

## Objective

Replace the collapsible "More to customize" dropdown in `AdvancedOptionsSection` with an
**always-visible, plain-language list** of the three per-habit options. There must be **no
expand/collapse control and no secondary "Customize" button** — `Create Habit` stays the only
primary CTA.

## Baseline assumptions

- Repo: this React Native (Expo) + NativeWind + TypeScript app.
- The section component and its editors already exist under `src/components/AdvancedOptions/`.
- If the current code still shows the accordion, you are converting it. If it already shows an open
  list, treat this as the spec of record and reconcile any drift.

---

## Scope

### Files to modify / create

- `src/components/AdvancedOptions/AdvancedOptionsSection.tsx` — orchestrator. Render (in order):
  header → optional growth-type pill → card containing the three rows → the editor sheets. Keep it
  **≤100 lines** (ESLint `max-lines` is an **error** at 100, skipping blanks/comments). Decompose
  into these siblings if needed:
  - `AdvancedOptionsHeader.tsx` — eyebrow "Fine-tune this habit" + "Optional" pill + reassurance
    line + growth-type pill (only when a growth type is present).
  - `AdvancedOptionsRows.tsx` — the card with the three `AdvancedOptionRow`s.
  - `AdvancedOptionsSheets.tsx` — the three editor sheets + the full strength-curve picker modal;
    exports a `SheetKey = 'algorithm' | 'growth' | 'streak' | null` type.
  - `useAdvancedRowSummary.ts` — derives `{ algoEntry, AlgoIcon, resolvedEmojis, presetLabel, hasGoal }`.
- `src/components/AdvancedOptions/AdvancedOptionRow.tsx` — add an optional `titleBadge?: string`
  prop that renders a small pill next to the title (used for "Recommended").

### To delete / remove

- `useAdvancedOptionsAccordion.ts` (the expand/collapse animation hook) — no longer used.
- All `onExpand` / `onAdvancedExpand` / `scrollToEnd` plumbing that only existed to scroll the
  expanding accordion into view. Remove it from every caller:
  - `src/components/CreateHabitModal/components/HabitFormBody.tsx` (+ `HabitFormBody.types.ts`)
  - `src/components/CreateHabitModal/components/CreateHabitScrollContent.tsx`
  - `src/screens/HabitEditScreen/HabitEditScreen.tsx`
  - `src/screens/templates/TemplatePreviewModal/components/CustomizationSections.tsx`
    (+ `PreviewSheetBody.tsx`, `TemplatePreviewModal/types.ts`)
  - `AdvancedOptions.types.ts` (drop the `onExpand?` prop)

### Do NOT touch (reuse as-is)

The three editors and the picker are unchanged — only how they're opened changes:
`AdvancedSheet`, `GrowthIconsSheetBody`, `StreakGoalSheetBody`, `StrengthCurveSheetBody`,
`StrengthCurvePickerModal`. Also reuse data helpers: `ALGORITHM_COPY` + `DEFAULT_ALGORITHM`
(`@/components/AlgorithmPicker`), `resolveProgressEmojis` / `matchPresetId` /
`PROGRESS_EMOJI_PRESETS` / `CUSTOM_PRESET_ID` (`@/utils/progressEmojis`), `getGrowthTypeMeta`
(`@/utils/growthTypeMeta`), `MODE_STYLES` (`@/screens/StrengthCurvePicker/strengthCurveModeStyles`).

---

## Exact content

### Header

- Eyebrow (uppercase, 12px, bold, tracked): **Fine-tune this habit**
- Pill next to it: **Optional** (green — `primary[100]` bg, `primary[700]` text)
- Reassurance line (caption, tertiary text): **Defaults are great — adjust any only if you want to.**
- Growth-type pill: render **only** when `getGrowthTypeMeta(growthType)` returns a value
  (templates set this; the create flow usually doesn't).

### The three rows (top → bottom)

| Order | `title`            | `subtitle`                                                                                      | `description`                                                       | Icon                                                    | Notes                                                                                                                                           |
| ----- | ------------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | How fast it builds | `` `${algoEntry.name} · ~${algoEntry.daysToForm}-day build` `` (e.g. `Average · ~66-day build`) | Steady, research-backed pace. Missing a day sets you back a little. | `MODE_STYLES[strengthAlgorithm].Icon` in `primary[700]` | `titleBadge="Recommended"` **iff** `strengthAlgorithm === DEFAULT_ALGORITHM` (`'balanced'`). `isFirst`. Opens `'algorithm'`.                    |
| 2     | Progress icons     | `` `${presetLabel} · 5 stages` `` (e.g. `Ranks · 5 stages`)                                     | The 5 emojis that mark your habit getting stronger.                 | The `resolvedEmojis.starting` emoji as text             | Opens `'growth'`.                                                                                                                               |
| 3     | Streak target      | `hasGoal ? \`${streakGoal}-day goal\` : 'No goal set'`                                          | An optional number to aim for — no penalty if you miss.             | `Target` (lucide)                                       | Neutral when no goal (`surface` bg, `primary[700]` icon); amber when set (`status.streakLight` bg, `status.streakText` icon). Opens `'streak'`. |

Rows are wrapped in one card: `colors.card` bg, `colors.cardBorder` 1px border, radius 16,
`shadows.subtle`, `paddingHorizontal: 8`. Rows separated by the hairline the row component already
draws via `isFirst`.

### `AdvancedOptionRow` contract (existing)

```ts
interface AdvancedOptionRowProps {
  icon: ReactNode;
  iconBackground: string;
  title: string;
  subtitle: string;
  description?: string;
  onPress: () => void;
  accessibilityHint?: string;
  isFirst?: boolean;
  titleBadge?: string; // ← add this; renders a small pill after the title
}
```

### `AdvancedSheet` contract (existing — for wiring the editors)

```ts
interface AdvancedSheetProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}
```

Wire: tap row → set `openSheet` to that key → the matching `<AdvancedSheet visible={openSheet === key} …>`
renders its existing `*SheetBody`. The strength sheet's "learn more" opens `StrengthCurvePickerModal`
(close the sheet first, then open the modal after ~80ms — keep the existing behavior).

---

## Design tokens (from `@/theme`, light values for reference)

| Token                                      | Light hex             | Use                                       |
| ------------------------------------------ | --------------------- | ----------------------------------------- |
| `primary[600]`                             | `#059669`             | primary buttons                           |
| `primary[700]`                             | `#047857`             | option icons, badge text, "Optional" text |
| `primary[100]`                             | `#D1FAE5`             | "Optional" pill + "Recommended" badge bg  |
| `card`                                     | `#EDEAE5`             | card surface                              |
| `cardBorder`                               | `#DDD8D2`             | borders / hairlines                       |
| `surface`                                  | `#EDEAE5`             | row icon tile bg (neutral)                |
| `status.streakLight` / `status.streakText` | `#FEF3C7` / `#92400E` | streak row when a goal is set             |
| `text.secondary` / `text.tertiary`         | `#6B6560` / `#6E6660` | subtitles / descriptions                  |

Always read colors from `useThemeColors()` (never hardcode) so dark mode works. Type: DM Sans body,
Literata for the serif screen title (already the app defaults).

---

## Definition of Done

- [ ] Section renders as an always-visible list — no expand/collapse, no "Customize" button.
- [ ] Header shows "Fine-tune this habit" + "Optional" pill + the reassurance line.
- [ ] Three rows match the copy table (title, subtitle, description, icons).
- [ ] "Recommended" badge appears only for the default (`balanced`) strength curve.
- [ ] Streak row is neutral when unset, amber once a goal is set.
- [ ] Tapping each row opens its existing editor; values persist on the created/edited habit.
- [ ] Identical rendering on **Add Habit, Edit Habit, and Template Preview** (shared component).
- [ ] Growth-type pill still renders for templates that define one.
- [ ] Accordion hook and all `onExpand`/`scrollToEnd` plumbing removed.
- [ ] A unit test covers row rendering + open-sheet behavior (see below).
- [ ] `max-lines` clean; `tsc -p tsconfig.app.json --noEmit` clean.

## Verification

```bash
# typecheck (expect 0 errors)
node_modules/.bin/tsc -p tsconfig.app.json --noEmit --pretty false

# file-length rule (expect no output = compliant)
node_modules/.bin/eslint src/components/AdvancedOptions --format stylish | grep 'max-lines\b'

# unit test for the rows
node_modules/.bin/jest src/components/AdvancedOptions/__tests__/AdvancedOptionsRows.test.tsx
```

Suggested test assertions: the three plain titles render; `Average · ~66-day build`, `Ranks · 5 stages`,
and `No goal set` show; the "Recommended" badge shows for `balanced` and not for `strict`;
`30-day goal` shows when `streakGoal={30}`; pressing each row (accessibilityLabel `"<title>, tap to edit"`)
calls `onOpen` with `'algorithm' | 'growth' | 'streak'`. Mock `@/theme/ThemeContext`,
`@/hooks/useProgressEmojis`, and `@/utils/haptics`.

## Out of scope

- Changing the editors themselves (Strength Curve / Growth Icons / Streak Goal sheets).
- Changing defaults, or how values are computed or persisted.
- Any screen other than the three that consume `AdvancedOptionsSection`.
