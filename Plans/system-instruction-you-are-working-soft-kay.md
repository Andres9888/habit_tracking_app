# Make "Advanced options" presence more discoverable

## Context

In the Add/Edit Habit form, the **AdvancedOptionsSection** sits below the Reminder selector. Today (commit `db3a7933f`, 2026-05-21) we made the individual rows inside the section obviously selectable (green EDIT pills, helper caption, lightened row backgrounds). That work fixed *intra-section* affordance — once the user is looking at the rows, they know they can tap them.

But the user reports a *different* problem: **it is hard to tell that advanced options exist at all.** The section's header — a small `SlidersHorizontal` icon plus a "Advanced" word in semibold body text plus a faint chevron — reads as a section *label*, not as a thing the user can interact with or as a hint that more controls live behind it. The form is long and the section sits near the bottom, so users scrolling Add/Edit Habit can miss it entirely.

The user's exact framing: *"this doesn't have to be on the screen, but just having a way to tell is good."* In other words: collapsing the options is acceptable; the goal is a clearly-visible **entry point** that signals "more controls live here."

Intended outcome: a user scanning the form sees an unmistakable, button-like control labeled in a way that makes it obvious advanced options are tucked inside, even when collapsed and even if the rows themselves are off-screen.

## Recommended approach

Two small changes to a single component: `src/components/AdvancedOptions/AdvancedOptionsSection.tsx`.

### 1. Default the section to collapsed

```ts
// AdvancedOptionsSection.tsx:73
const [expanded, setExpanded] = useState(false);
```

Rationale: today's default-expanded state spreads the rows down the form, so the "Advanced" header scrolls out of view and the rows look like the bottom of the form. A collapsed default keeps the form short and forces the entry-point to be the thing the user sees.

### 2. Promote the header from "label" to "button"

Restyle the `Pressable` at `AdvancedOptionsSection.tsx:118–147` so it reads as an actionable control:

- **Background tint.** Use `colors.primary[50]` (or `colors.primary[100]` if `[50]` is too light) as the card background instead of `colors.card`, so the whole strip pops against the form. Keep border but switch to `colors.primary[200]`.
- **Icon color + size.** Tint `SlidersHorizontal` with `colors.primary[600]` instead of `colors.text.secondary`, and bump to `iconSizes.medium`.
- **Label.** Change "Advanced" → **"Advanced options"** (more specific — answers "advanced *what*?"). Use `colors.primary[700]`.
- **Right-side count pill.** Add a small pill before the chevron that shows `3 options` (the number of rows: Strength Curve, Growth Icons, Streak Goal). Style it like the existing EDIT pills (`AdvancedOptionEditAffordance.tsx`) — `colors.primary[100]` bg, `colors.primary[700]` text, semibold caption, uppercase optional. This is the strongest "there's more here" signal.
- **Chevron.** Use `colors.primary[600]` instead of `colors.text.tertiary` so it visibly belongs to a control, not a heading.

Reuse the existing primary-tint palette already in use by `AdvancedOptionEditAffordance.tsx` so the entry-point and the rows share a visual language.

### 3. (Out of scope but worth noting)

Do **not** add a separate "Show advanced" link above the section, do **not** move the section, do **not** change the sheet contents. Keep the change surface tiny — one file, two visual changes plus a count pill.

## Critical files

- `src/components/AdvancedOptions/AdvancedOptionsSection.tsx` — only file to edit. Header is at lines 106–147; default state at line 73.
- `src/components/AdvancedOptions/AdvancedOptionEditAffordance.tsx` — **reuse** as the visual reference for the count pill (matching styling keeps the section internally consistent).
- `src/theme/ThemeContext.ts` — `colors.primary[50|100|200|600|700]` already available (used elsewhere in this same component, see line 196, 201).
- `src/theme/iconSizes.ts` — `iconSizes.medium` exists.

No new components, no new hooks, no new types.

## Verification

1. **Visual.** Open the app (`bunx expo start`), tap **Add Habit**, scroll to where the Reminder selector ends.
   - The "Advanced options" strip should be visibly button-like — tinted background, primary-color icon, "3 options" pill on the right.
   - It should be **collapsed** by default. The form should now be shorter.
   - Tapping anywhere on the strip toggles it open; chevron rotates as before.
   - Tap one row (e.g. Strength Curve) — the sheet still opens. No regressions in row behavior.
2. **Edit Habit.** Repeat the same checks via the Edit Habit flow. The collapsed default should also apply there.
3. **Accessibility.** `accessibilityRole='button'` and `accessibilityState={{ expanded }}` already exist on the Pressable (lines 119–120) — confirm they still fire correctly.
4. **Reduce Motion.** Toggle iOS Reduce Motion on, re-open the form. Chevron rotation duration should respect the existing `reduceMotion` branch (line 76).
5. **Lint.** `npm run lint:max-lines` — the file is already marked `eslint-disable max-lines` and `max-lines-per-function`; the change should not increase the violation footprint.
6. **Manual sanity.** Verify with Interceptor or a device build that nothing in `CreateHabitFormCentered.tsx` re-renders worse than before (section is `memo`'d at line 112, no prop changes here).
