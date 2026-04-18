# Advanced Options — Consolidated Redesign (Browser Mockups)

## Context

Today, two power-user habit settings live in different places inside the `HabitEditScreen` → `CustomizeSection`:

- **Strength Algorithm** — a collapsible `AdvancedAlgorithmDisclosure` buried at the bottom of the Customize section.
- **Growth Icons (custom emojis per stage)** — a `ProgressEmojiPicker` row sitting between color and reminder, styled like a primary customization control.

These are conceptually the *advanced / opinionated* levers of a habit (how strength is computed, what visual language represents progression), mixed visually with basic styling (emoji, color) and behavioral settings (reminder time, streak goal). The user wants them pulled into **one cohesive "Advanced Options" place** so the edit screen reads as: Name → Visual (icon, color) → Behavior (reminders, streak goal) → **Advanced** → Danger Zone.

**Before writing any React Native code**, we want to explore the *shape* of this "Advanced" area with HTML browser mockups — several variations, each with a clear rationale — so the user can pick a direction visually.

## Approach

Produce **3 HTML mockups** under `.superdesign/design_iterations/`, each rendering the *bottom half* of the habit edit sheet (after color/reminder, before Danger Zone) at iPhone width, showing both collapsed and expanded states side-by-side. A single `index.html` will link all three so they can be opened in a browser (`open .superdesign/design_iterations/advanced_options_index.html`) and compared.

All mockups reuse the exact copy, algorithm definitions, and progress-emoji presets already in the codebase (so mockup ↔ implementation is a 1:1 port). Styling mimics the existing dark/light theme tokens, `rounded-2xl` cards, `SectionLabel` divider, and Reanimated stagger feel.

### Sources of truth to mirror in mockups

- `src/components/AlgorithmPicker/algorithmCopy.ts` — three algorithm options (Forgiving / Balanced / Strict), icons, examples, `daysToForm`.
- `src/utils/progressEmojis.ts` — 5 presets (Plants / Fitness / Space / Mind / Fire) + stage labels (Starting → Building → Developing → Strong → Automatic).
- `src/screens/HabitEditScreen/SectionLabel.tsx` — caps text with side dividers; the "ADVANCED" header should match this treatment.
- `src/screens/HabitEditScreen/CustomizeSection.tsx:106-129` — current placement of the two controls to be moved.

## The 3 Variations

### Variation A — **Unified Accordion with Tabs**
A single rounded card labeled **"Advanced"** with a `SlidersHorizontal` icon. Collapsed shows two preview chips: `Algorithm: Balanced` and a mini emoji row `🌱🌿🌳💪⚡`. Tapping expands the card and reveals a 2-tab segmented control (`Algorithm | Growth Icons`); tab content swaps in place.

- **Why:** smallest vertical footprint when collapsed; frames both controls as siblings of equal weight; preview chips surface current values without opening.
- **Tradeoff:** tabs hide one control at a time; an extra tap to reach the non-active tab.

### Variation B — **Stacked Settings Rows (iOS-style)**
Under a **"ADVANCED"** `SectionLabel`, two full-width tappable rows stacked vertically, each with icon + title + current-value caption + chevron. Tapping a row opens an inline sheet (algorithm cards / emoji stage picker) that slides in. Collapsed state already shows current values in the caption.

- **Why:** most familiar pattern (iOS Settings); scales to 3+ advanced options later without redesign; both values visible without expanding.
- **Tradeoff:** two sheets to build; editing requires entering a sub-view.

### Variation C — **Stacked Inline Disclosures**
Under a **"ADVANCED"** `SectionLabel`, two independently collapsible disclosure cards stacked. Each card has its own header (icon + title + chevron) and expands in place to show the full algorithm cards list / emoji stage rows. Either or both can be open simultaneously.

- **Why:** keeps everything on one screen (no sub-sheets); users can see both expanded together when tuning a habit; matches the current `AdvancedAlgorithmDisclosure` pattern, so it's the smallest implementation delta.
- **Tradeoff:** tall when both open; heavier visual weight on the edit screen.

## Deliverables (files to create — all inside `.superdesign/design_iterations/`)

- `advanced_options_theme.css` — shared tokens (colors for light+dark, spacing, radii, fonts matching app).
- `advanced_options_A_accordion_tabs.html`
- `advanced_options_B_stacked_rows.html`
- `advanced_options_C_inline_disclosures.html`
- `advanced_options_index.html` — landing page showing all three side-by-side at ~390px phone width with the variation name, collapsed+expanded state, and a short "why" blurb beneath each.

Each variation HTML renders:
1. A simulated phone frame (390px wide, rounded).
2. The existing **Streak Goal** pill row above (for visual continuity).
3. The new **Advanced** section.
4. The existing **Danger Zone** card below.
5. Both collapsed and expanded states (stacked, labeled).

No JS framework — plain HTML + Tailwind CDN + a tiny bit of vanilla JS for the expand/collapse and tab toggles so the user can actually interact.

## Out of Scope (explicitly)

- No React Native code changes in this plan. Pure HTML mockups only.
- No reorganization of Name / Emoji / Color / Reminder (those stay where they are).
- No new algorithm or progress-emoji options; reuse existing content verbatim.
- No settings-screen global default changes.

## Verification

1. `open /Users/andres/conductor/workspaces/habit_tracking_app/philadelphia-v2/.superdesign/design_iterations/advanced_options_index.html` in the default browser.
2. Confirm all three variations render at phone width, both states are visible, and interactive toggles/tabs work.
3. User picks a variation (or a hybrid). A follow-up plan will port the chosen direction to React Native components, reusing `algorithmCopy.ts` and `progressEmojis.ts` untouched.

## Critical files referenced (read-only in this phase)

- `src/screens/HabitEditScreen/HabitEditScreen.tsx` — overall sheet structure.
- `src/screens/HabitEditScreen/CustomizeSection.tsx:106-129` — current locations to move.
- `src/components/AlgorithmPicker/algorithmCopy.ts` — algorithm data for mockups.
- `src/utils/progressEmojis.ts` — preset data for mockups.
- `src/screens/HabitEditScreen/SectionLabel.tsx` — divider styling to mirror.
