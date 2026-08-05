# Make Advanced Options in Add/Edit Habit Visibly Selectable

## Context

When adding or editing a habit, the "Advanced" section exposes three interactive controls — **Strength Curve**, **Growth Icons**, **Streak Goal** — plus a read-only **Growth Type** display. Each interactive row is a `Pressable` that opens a bottom-sheet picker, but users don't realize they're tappable.

### Why they don't look selectable today

Looking at `AdvancedOptionRow.tsx:39-46` and `AdvancedOptionsSection.tsx:154-201`:

1. **Same `colors.card` background and `colors.border` as the parent section wrapper.** Rows visually melt into the container — they look like static info cards, not buttons.
2. **Subtle chevron** in `colors.text.tertiary` — easy to miss as an affordance.
3. **No press feedback** — `Pressable` has no pressed state styling (no opacity dip, no background change).
4. **The read-only Growth Type row looks identical to the three tappable rows** (same shape, icon, two-line label) but has no chevron, training the eye to ignore chevrons.
5. **No explanatory copy** — users have no idea what these options change or that tapping reveals options.

### Intended outcome

Users immediately recognize Strength Curve / Growth Icons / Streak Goal as **tappable customization controls**, understand at a glance what each one controls, and feel confident pressing them.

---

## Recommended approach

A three-pronged minimal-surface fix:

### 1. Make rows look like buttons (visual affordance)

Edit `src/components/AdvancedOptions/AdvancedOptionRow.tsx`:

- **Background contrast**: switch row background from `colors.card` to `colors.surface` (or `colors.muted` / `colors.gray[50]` depending on theme palette — confirm during implementation by checking `useThemeColors()`). This separates the row from the parent section card.
- **Stronger chevron**: change `ChevronRight` color from `colors.text.tertiary` → `colors.text.secondary`. Bump `strokeWidth` to 2.5.
- **Press feedback**: convert `Pressable` to accept `style={({ pressed }) => ...}` and apply `opacity: 0.7` + a subtle `backgroundColor` shift (e.g., `colors.primary[50]`) when pressed.
- **Add a faint "Edit" affordance**: a small "Tap to edit" or "Change" pill / caption to the right of the chevron (or replace subtitle's right padding with a tiny label). Optional but high-impact for first-time users.

### 2. Differentiate the read-only Growth Type row

Edit `src/components/AdvancedOptions/AdvancedOptionsSection.tsx:154-201`:

- Remove the card-like border + background from the inline `<View>` rendering Growth Type, OR move it **outside** the row list and render it as a small inline pill at the top of the expanded section ("Growth Type: Simple · ~30-day build").
- This stops the read-only display from camouflaging the three real buttons.

### 3. Tell users what each option does (information layer)

Two pieces:

**a) Section-level helper text** in `AdvancedOptionsSection.tsx` (right under the "Advanced" header when expanded, before the rows on line 148-153):

> "Tap any option below to customize how this habit grows."

Small caption text, `colors.text.tertiary`, ~12px.

**b) Inline descriptions per row.** Extend `AdvancedOptionRow` to accept an optional `description?: string` prop. When present, render it on a third line **below** the existing subtitle, in `colors.text.tertiary`, smaller, with `numberOfLines={2}`. Wire it from `AdvancedOptionsSection.tsx`:

- **Strength Curve** → "How your habit's strength grows and resets when you miss days."
- **Growth Icons** → "The 5-stage emoji progression shown on your habit's strength bar."
- **Streak Goal** → "A motivational target — purely visual, no penalty if you don't hit it."

Keep current `subtitle` (which shows the *current selection*, e.g., "Textbook · ~66-day build"). The new `description` explains *what the option is*.

If three lines per row feels cramped, alternative: use a small `ℹ` info icon next to the title that opens a lightweight tooltip / inline expand on tap. The flat description approach is simpler and ships first.

---

## Files to modify

| File | Change |
|------|--------|
| `src/components/AdvancedOptions/AdvancedOptionRow.tsx` | Add pressed-state styling, stronger chevron, distinct background, optional `description` prop with a third text line |
| `src/components/AdvancedOptions/AdvancedOptionsSection.tsx` | Add section helper caption, demote Growth Type from card-row to inline pill, pass `description` to each `AdvancedOptionRow` |

No type changes needed beyond extending `AdvancedOptionRowProps` with optional `description?: string`. No changes to `AdvancedOptions.types.ts`, sheet bodies, or the create/edit screens that consume the section.

---

## Reuse / existing utilities

- `useThemeColors()` — already used; reuse for surface/muted backgrounds and pressed-state tints.
- `typography` and `fontWeights` from `@/theme/typography` — reuse for the new description line.
- `iconSizes`, `Haptics.selectionAsync()` — already wired; no change.

---

## Verification

1. **Visual smoke test (Interceptor / Expo dev build):**
   - Open the app, tap "Add Habit" → confirm Advanced section is expanded and the three rows visibly read as tappable (clear separation from parent, prominent chevron, helper caption visible).
   - Tap each row → confirm haptic + appropriate picker opens (Strength Curve modal, Growth Icons sheet, Streak Goal sheet).
   - Press-and-hold each row → confirm pressed-state visual feedback fires.
   - Open Edit Habit on an existing habit → same checks.
2. **Read-only Growth Type:** confirm it no longer visually mimics a button (no chevron, no row-card framing).
3. **Light + dark mode:** verify contrast for the new row background in both themes.
4. **Accessibility:** confirm `accessibilityRole='button'` + new `accessibilityHint` still announce correctly with VoiceOver; the new description text should not be redundant in the screen-reader output (either suppress with `accessibilityElementsHidden` on the description `<Text>` or fold it into `accessibilityHint`).
5. **Lint:** `npm run lint:max-lines` — both files are currently small; after changes confirm they stay ≤100 effective lines (split into helper files if needed per project CLAUDE.md rule).
