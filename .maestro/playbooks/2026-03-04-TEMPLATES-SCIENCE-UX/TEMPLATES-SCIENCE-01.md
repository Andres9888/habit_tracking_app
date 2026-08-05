# Phase 01: Search Copy & Temporal Header

**Spec**: Templates Science-Based UX Improvements
**Design Reference**: `.superdesign/design_iterations/templates_ux_painpoint_2_1.html`
**Scope**: Small, safe copy + component changes — no new features

## Context

Two science-backed micro-copy changes to the Templates screen header area:

1. **Paradox of Choice (Schwartz, 2004)**: The search placeholder currently says "Search templates..." or similar. Outcome-framed copy ("What do you want to improve?") reduces cognitive load by focusing users on their goal, not the size of the catalog. Highlighting inventory count amplifies overwhelm.

2. **Temporal Priming (Bargh et al., 1996)**: Adding a time-of-day subtitle under the "Templates" header ("Good morning — build your AM routine") makes the page feel contextually relevant before the user takes any action. Content primed by temporal context increases engagement.

## Data Flow

- Search bar: `src/screens/TemplatesScreen/components/SearchBar.tsx` — update placeholder text prop
- Header subtitle: The `ScreenHeader` component receives title/subtitle. A new hook or inline logic determines the time-of-day greeting.

## Tasks

- [x] **Update search placeholder to outcome-framed copy.** In `src/screens/TemplatesScreen/components/SearchBar.tsx`, change the placeholder text from whatever it currently is to `"What do you want to improve?"`. This is a simple string change. Verify the file stays under 100 lines. Run `npx tsc --noEmit --pretty` to confirm no type errors.

- [x] **Add time-of-day contextual subtitle to the Templates header.** The Templates screen header should show a dynamic subtitle based on the current hour. Create a small utility function (can be inline or a tiny helper) that returns: "Good morning — build your AM routine" (before 12pm), "Good afternoon — find your focus habits" (12pm-5pm), or "Good evening — set up tomorrow for success" (after 5pm). Wire this into the header area of the Templates screen (either via `ScreenHeader` subtitle prop or a new `Text` element below the title in `TemplatesScreen.tsx` or `MainBrowseView.tsx`). Keep all files under 100 lines. Run `npx tsc --noEmit --pretty` to confirm no type errors.

## Verification

- Search bar shows "What do you want to improve?" as placeholder
- Header shows time-appropriate subtitle
- All modified files pass TypeScript and ESLint max-lines
