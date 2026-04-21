# Habit Library Page — Improvement Survey

## Context
User asked: "what can we improve of the habit library page"

The "habit library" is `TemplatesScreen` — a full-screen modal surface where users browse ~200 pre-built habit templates, organized by goals and categories, with search/sort/drill-down and a detail modal. Recent PR #1309 polished the details modal (hero tint matching, softened X button, back-nav split). This plan captures the next-best improvement opportunities found by two parallel exploration passes, pending user direction on which to pursue.

## What exists today (for reference)
- Entry: `src/features/habits/components/HabitsModals/TemplatesModalSection.tsx` → `src/screens/TemplatesScreen/TemplatesScreen.tsx` (219L)
- Main view: `MainBrowseView.tsx` with GoalCollectionGrid, PopularSection, ExploreAllSection, PremiumPacksSection, SearchBar
- Drill views: `CategoryDrillView`, `GoalDrillView`, `SeeAllView`, `CategorySearchView`, `DrillListBody` (192L)
- Detail: `FullsizeTemplatePreview` (recently polished) + older `TemplatePreviewModal` (still used in onboarding flow) — **two preview systems**
- Data: Convex queries `api.templates.list`, `getImportedTemplateIds`, `api.habits.list`, `api.settings.get`
- Filter/sort: category, sort by popular/az, hide-imported. `QuickFilterChips` component is **orphan code** — verified via grep: only self-referenced in its own `index.ts` + the `components/index.ts` barrel. Never imported by any view. Matches the codebase's "partially-extracted, never wired" pattern (same as BinaryHeatmap per MEMORY).
- Search: exact substring on name + description + scientificReference + category label, 300ms debounce

## Candidate improvements (grouped by type)

### A. Quick polish wins (visible, low risk, build on #1309 momentum)
- **Wire up `QuickFilterChips`** — component exists as orphan code, never rendered anywhere. Either mount it on `DrillListBody` / `SeeAllView` as an in-view quick-switcher (keeps user inside the drill instead of backing out to change category), or delete the file if it was intentionally abandoned. Mount > delete, based on the UX value of in-view chip switching.
- **Animate + haptic the SearchResults sort dropdown** — `MainBrowseView` got `bodyEnter/bodyExit` animation in the last pass; the sort menu still uses plain Pressable backdrop, no haptic on selection
- **Empty state copy upgrade** — `TemplatesEmptyState.tsx` says "Your habit library isn't loaded yet / Tap below to load it" — generic vs. onboarding's voice
- **`accessibilityHint`** on drill-view back buttons

### B. Feature gaps (medium effort, real user value)
- **Science-backed filter** — cards show the science pill prominently but users can't filter by it; data (`scientificReference`) already present
- **"Pairs well with your habits" filter/sort** — `PairsWellWith` data exists in detail modal, could surface as a filter/sort on the grid using the user's existing habits
- **Fuzzy search / typo tolerance** — current search fails on minor typos
- **Difficulty + time-commitment filters** — metadata doesn't exist yet; would require template schema additions
- **Time-of-day personalization on main browse** — `FeaturedGoalCard` already rotates by time; could extend to a "Pick for this time of day" strip

### C. Theming hygiene
- **Replace hardcoded hex in `TemplateListCard`** — `#F0FDF6`, `#A7F3D0`, `#FCD34D`, `#FBBF24`, `#F59E0B`, `#78350F`, `#FFF7ED`, `#FED7AA`, `#E0F2FE`, `#BAE6FD` (imported/top-pick/popularity/science pills) — dark-mode risk
- **`TemplatesLoadingState`** uses magic spacing (`20`, `16`) and inline typography instead of `spacing.*` + `typography.*` tokens
- **`GoalCollectionGrid`** overlays use raw rgba values without semantic naming

### D. Code readability (100-line policy)
- `TemplatesScreen.tsx` 219L → split routing + provider/shell
- `DrillListBody` 192L → split filter controls + list body
- `useTemplatesScreenState` manages 15+ pieces of state in one hook → domain-split (search / modals / import)
- **Consolidate the two preview modals** — `FullsizeTemplatePreview` (new, polished) vs. `TemplatePreviewModal` (older, still used in onboarding). Non-trivial; onboarding consumers would need migration.

## Recommendation (initial)
Lead with **A (polish)** because it builds on the momentum of #1309, closes the visible QuickFilterChips feature-debt, and keeps the detail-modal polish tone consistent across the main surface. Then **B (science-backed filter + pairs-well-with)** — both reuse data that already exists, so they're feature wins without schema work.

Holding off on **C/D** unless the user specifically asks — they're hygiene, not user-visible, and recent performance signals indicate low tolerance for work that doesn't show up on screen.

## Direction pending
The user's answer to the follow-up question will determine which of A/B/C/D (or a custom combination) becomes the actual implementation plan. This file will be updated with the concrete plan once direction is chosen.

## Files that would be touched (by direction)
- **A (polish):** `src/screens/TemplatesScreen/components/QuickFilterChips/*`, `DrillListBody.tsx`, hook `useCategoryDrillFilters`, `SortDropdown.tsx`, `TemplatesEmptyState.tsx`
- **B (features):** `hooks/useFilteredTemplates.ts`, new filter control component, possibly `FullsizeTemplatePreview`'s `PairsWellWith` → pull up
- **C (theming):** `views/TemplateListCard/TemplateListCard.styles.ts`, `components/TemplatesLoadingState.tsx`, `components/GoalCollectionGrid/GoalCollectionGrid.styles.ts`
- **D (readability):** `TemplatesScreen.tsx`, `views/DrillListBody.tsx`, `hooks/useTemplatesScreenState.ts`, deprecate `TemplatePreviewModal`

## Verification approach (once direction is chosen)
- Build + typecheck + lint pass
- Visual validation in app: open library, exercise search, drill into category, open detail, import a template, verify no regressions against recent polish
- Per user preference: **screenshot against mockup before claiming done**
