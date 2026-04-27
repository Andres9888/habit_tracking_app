# Plan: Habit Library Page — Strategic Improvements

## Context

The Habit Library (`src/screens/TemplatesScreen/`) is the modal users open when they tap "+ Add Habit." It currently renders ~328 science-backed templates the same way for every user, ranked by global popularity. Recent work (Apr 13–27) focused on motion polish, header wrapping, popularity tracking, and premium-pack gating — the page is competent but not yet **opinionated** or **personal**.

A March 3 spec (`specs/003-templates-ux-redesign/`) is **stale** (per user) — it's been partly implemented and the team has since diverged from it (e.g., it called for renaming Popular→"Trending Now"; team renamed Trending→Popular instead).

Two findings drive this plan:

1. **Major UI machinery is built but dormant.** `QuickFilterChips`, `StartHereCard`, and `FeaturedCollection` (with time-of-day awareness) are fully implemented in `src/screens/TemplatesScreen/components/` but **never imported by any view**. `useMainBrowseData` even returns `quickFilterCategories` that nothing renders.
2. **Onboarding-v2 captures user intent that never reaches the Library.** `OnboardingAnswers` has `goal`, `painPoints`, and `categories` (`src/screens/onboarding-v2/types.ts:42`), and `CATEGORY_MAP` (`src/screens/onboarding-v2/data/categoryMap.ts:4`) already maps them to backend categories — but `useMainBrowseData.ts` reads zero onboarding signals.

The page therefore shows a user who told us "I quit when I miss a day" the same library as one who said "I get bored fast" — sorted by global popularity for both.

## Current State Snapshot (Apr 27, 2026)

`MainBrowseView.tsx:38-118` renders, in order:

1. ScreenHeader: "What do you want to work on?" (2-line)
2. SearchBar (sticky, animated)
3. `GoalCollectionGrid` — featured goal of the day (rotates daily, 5 archetypes)
4. `PopularSection` — top-10 templates by global `popularityScore`
5. `CategoryRowsSection` — grouped category rows

Dormant, ready-to-wire:
- `components/QuickFilterChips/` — 7 curated category chips with active-state colors
- `components/StartHereCard/` — beginner gradient card for users with 0–1 habits
- `components/FeaturedCollection/` + `getTimeAwareFeatured()` — Morning/Afternoon/Evening/Weekend hero (competes with daily-rotation GoalCollection)

Schema gaps (`convex/schema.ts:268-326`):
- No `whyItWorks` field — `getWhyItWorksText()` matches 6 keywords, falls back to generic copy for everything else.
- `suggestedCue`, `suggestedIdentity`, `suggestedWhy` exist but the Library preview doesn't lean on them.

## Strategic Thesis

The Library has reached "competent browse." The next step is **the library should feel like it knows me by the time I open it.** We have the signals (onboarding) and the parts (chips, start card, time hero) — we just haven't connected them. This plan does that, then deepens the science layer, then closes tech-debt loops. Each phase ships on its own; later phases enable richer presentation but don't depend on earlier ones structurally.

## Phase 1 — Wire Up the Dormant UI

**Goal:** Stop ignoring code we've already built. No new components.

### 1.1 Render `QuickFilterChips` below the SearchBar
- File: `src/screens/TemplatesScreen/views/MainBrowseView.tsx` (insert chip strip after the `SearchBar` block at line 53–59)
- File: `src/screens/TemplatesScreen/views/MainBrowseView.types.ts` — add `quickFilterCategories`, `activeChip`, `onSelectChip` props
- Wire data: `useMainBrowseData.ts` already returns `quickFilterCategories` (line 80–90); thread up via `useTemplatesScreenProps`
- State: extend `state.selectedCategory` already present in TemplatesScreenModals/SearchResults — chip selection drives the same filter as `SearchResults`'s sort/category, so when a chip is tapped the body should swap to filtered results (treat as a search activation with category=X, no text)
- Acceptance: tapping a chip narrows the visible templates; "All" deselects; haptics fire (already in `QuickFilterChips:69`).

### 1.2 Surface `StartHereCard` for users with `userHabitCount ≤ 1`
- File: `src/screens/TemplatesScreen/views/MainBrowseView.tsx` — render conditionally above `GoalCollectionGrid`
- Pass `data.userHabitCount` (already in `useTemplatesData.ts:69`)
- Tap → opens `SeeAllView` filtered to the 5 starter habit names (or a hand-curated tag — simplest: filter `allTemplates` where `name` is in `STARTER_HABITS`). Keep the card hidden once `userHabitCount > 1`.
- Acceptance: new user sees "New here? Start with these"; user with 2+ habits does not.

### 1.3 Resolve the two competing "featured today" mechanisms
There are two and the team kept one:
- **Daily rotation** (`getFeaturedGoalId` in `goalCollections.ts:77`) — currently used by `GoalCollectionGrid`
- **Hourly rotation** (`getTimeAwareFeatured` in `featuredCollections.ts:52`) — built, never imported

**Recommendation:** delete `FeaturedCollection/` entirely. `GoalCollectionGrid` is the chosen hero pattern (it's wired, has goal-archetype framing, and matches onboarding-v2's `GoalStep`). Keeping both tempts future re-litigation.
- Files to delete: `components/FeaturedCollection/` (whole dir, 7 files)
- If we want the time-of-day signal, add a single `getTimeOfDayBadge()` helper and overlay it on the featured `GoalCard` instead — *but propose this only if the user wants the time signal preserved.*

### 1.4 Drop the duplicate `CATEGORY_METADATA` in `useTemplatesData.ts`
- File: `src/screens/TemplatesScreen/useTemplatesData.ts:15-33` — duplicates a subset of `data/categoryMeta.ts:28-43`. Replace with `getCategoryMeta()` import. Removes ~20 lines of drift risk.

**Phase 1 ships:** chips render, start card shows for new users, exactly one featured pattern, no duplicate metadata.

## Phase 2 — Personalize from Onboarding Signals

**Goal:** The library reflects what the user told us during onboarding. Without this, "personalization" claims in marketing copy are aspirational, not real.

### 2.1 Persist `OnboardingAnswers` to Convex
- Currently stored only in onboarding-v2 client state (`useOnboardingV2State`). Confirm whether `useOnboardingV2Complete.ts` writes them to `convex/users` or `convex/settings` — if not, add a mutation.
- New schema fields on `userSettings` (or new `userIntent` table):
  - `onboardingGoal: v.optional(v.string())` — one of 7 goal ids
  - `onboardingPainPoints: v.optional(v.array(v.string()))`
  - `onboardingCategories: v.optional(v.array(v.string()))`

### 2.2 New hook: `useUserIntent()`
- Returns `{ resolvedCategories: string[], primaryGoalId: string | null, painPointIds: string[] }`
- Uses `CATEGORY_MAP` from `src/screens/onboarding-v2/data/categoryMap.ts` to convert onboarding categories → backend categories
- Maps onboarding `goal` → matching `GoalCollection.id` (e.g., `morning` → `more-energy`, `sleep` → `sleep-better`, `mind` → `less-stress`)

### 2.3 Re-rank `popularTemplates` by intent overlap
- File: `src/screens/TemplatesScreen/hooks/useMainBrowseData.ts:30-35`
- Replace pure popularity sort with: `intentMatch * 100 + popularityScore`, where `intentMatch = 1` if `template.category ∈ resolvedCategories`, else `0`
- Header copy: when intent is known, change `subtitle="What people are starting this week"` → `"Popular in your areas"` (PopularSection.tsx:48)

### 2.4 Default the featured `GoalCollection` to the user's onboarding goal
- File: `src/screens/TemplatesScreen/data/goalCollections.ts:77` — extend `getFeaturedGoalId(now, userGoalId?)` to honor the user's pick when present, fall back to daily rotation
- Acceptance: a user who picked "Sleep" in onboarding lands on the "Sleep deeper" hero card instead of whatever's rotating today.

### 2.5 (Optional) Address pain-point #3 explicitly: "I try too many at once"
- For users whose `painPointIds` includes `'too-many-habits'`, cap the `PopularSection` to 3 templates and lead with copy like *"Three habits we'd start with — no more."*
- Risk: adds branching logic. Stage behind an A/B if controversial.

**Phase 2 ships:** the page differs measurably between two test users with different onboarding answers.

## Phase 3 — Deepen the Science Layer

**Goal:** Move the science from "branding" to "specific to this habit." Already flagged in `Plans/floofy-sprouting-swan.md:65-69`.

### 3.1 Add `whyItWorks` to the templates schema
- File: `convex/schema.ts:268` (templates table) — add `whyItWorks: v.optional(v.string())`
- Per-template 1–2 sentence explanation, distinct from `scientificReference` (citation) and `description` (what it is)

### 3.2 Backfill in `templatesDataSeed.ts` (~328 entries)
- Bulk update plan: handcraft for top-50 by popularity, use Claude/Perplexity to draft the rest, human-review before commit.
- Until backfill is complete, `getWhyItWorksText()` becomes the fallback path.

### 3.3 Replace `getWhyItWorksText()` with stored field
- Find the call site (currently in `FullsizeTemplatePreview/components/ScienceEvidenceSection.tsx` per the audit)
- Use `template.whyItWorks ?? getWhyItWorksText(template)` so unbacfilled rows still render

### 3.4 (Bonus) Surface `suggestedCue` / `suggestedIdentity` in preview
- These already exist on the schema (`schema.ts:317-319`) but the preview doesn't show them. Add a small "Try cueing it after: {suggestedCue}" line in `DescriptionSection.tsx` when present.

**Phase 3 ships:** every template has a real "why it works"; the preview feels less generic.

## Phase 4 — Tech Debt (Run in parallel any time)

### 4.1 Decompose `HabitsEmptyState.tsx` (1,094 lines)
- Per `CLAUDE.md` decomposition rules. Extract `*.styles.ts`, `*.hooks.ts`, sub-components per the canonical pattern in `docs/DECOMPOSITION_PATTERNS.md`.

### 4.2 `borderRadius: 9999` → `borderRadius.full` token migration
- 26 instances per the consistency review (`DESIGN_CONSISTENCY_REVIEW.md`). Codemod-able.
- Includes `FullsizeTemplatePreview/styles/hero.styles.ts:24` and 7 in `TemplatesScreen/`.

### 4.3 Drop the `eslint-disable max-lines` from `TemplatesScreen.tsx:1`
- File is 227 lines. The disable is a leftover. Either decompose to ≤100 (preferred) or accept the warning.

## Non-Goals (Explicitly Not Doing)

- **Bringing back premium packs.** `SHOW_PREMIUM_PACKS = false` in `MainBrowseView.tsx:36` — leave as-is unless monetization explicitly asks.
- **Replacing the goal-archetype hero with the time-of-day hero.** Phase 1.3 picks one; do not implement both.
- **Building a new "recommendation engine."** Phase 2 is rule-based intent matching. ML/embedding work is out of scope.
- **Aligning to the Mar 3 `003-templates-ux-redesign` spec.** Per user, treat as fully stale; do not reconcile against it.
- **Touching the onboarding flow itself.** Library reads onboarding output, doesn't modify the flow.

## Critical Files

**Phase 1 (wire up):**
- `src/screens/TemplatesScreen/views/MainBrowseView.tsx` — add chips + start card
- `src/screens/TemplatesScreen/views/MainBrowseView.types.ts` — extend props
- `src/screens/TemplatesScreen/hooks/useTemplatesScreenProps.ts` — thread new data through
- `src/screens/TemplatesScreen/useTemplatesData.ts` — drop duplicate metadata
- `src/screens/TemplatesScreen/components/FeaturedCollection/` — delete (Phase 1.3)

**Phase 2 (personalize):**
- `convex/schema.ts` — userSettings or userIntent extensions
- `src/screens/onboarding-v2/useOnboardingV2Complete.ts` — write answers
- `src/screens/TemplatesScreen/hooks/useUserIntent.ts` — new hook
- `src/screens/TemplatesScreen/hooks/useMainBrowseData.ts:30-35` — intent-aware ranking
- `src/screens/TemplatesScreen/data/goalCollections.ts:77` — `getFeaturedGoalId(now, userGoal?)`
- `src/screens/onboarding-v2/data/categoryMap.ts` — already exists, reuse

**Phase 3 (science):**
- `convex/schema.ts:268` — `whyItWorks` field
- `convex/templatesDataSeed.ts` — backfill ~328 rows
- `src/components/FullsizeTemplatePreview/components/ScienceEvidenceSection.tsx` — read field
- `src/components/FullsizeTemplatePreview/components/DescriptionSection.tsx` — `suggestedCue` line

**Phase 4 (debt):**
- `src/features/habits/components/HabitsEmptyState/` (decompose)
- Codebase-wide `borderRadius: 9999` → `borderRadius.full`

## Verification

**Phase 1:**
- Open app, tap "+ Add Habit" → see filter chips below search; tap "Sleep" → only sleep templates show; tap "All" → all reappear.
- Reset onboarding/clear habits → reopen library → "New here? Start with these" card appears above goal grid; import 2 habits → reopen → card gone.
- `grep -r "FeaturedCollection" src/` returns zero matches after deletion.
- `npx tsc --noEmit` clean.

**Phase 2:**
- Two test users complete onboarding-v2 with different answers (one picks Sleep + "miss-a-day" pain; another picks Movement + "novelty-fades").
- Both open the library — verify the featured goal card differs, and the Popular section ordering differs.
- Convex dashboard shows `onboardingGoal`, `onboardingPainPoints` written to user record.

**Phase 3:**
- Run a Convex query: `templates` table has `whyItWorks` populated on top-50 popular templates.
- Open `FullsizeTemplatePreview` for a backfilled template → see specific "why it works" copy, not generic fallback.
- Open one not yet backfilled → fallback still renders without crash.

**Phase 4:**
- `npm run lint:max-lines` reports `HabitsEmptyState` ≤ 100.
- `grep -rn "borderRadius: 9999" src/` returns 0.

## Suggested Sequencing

If you only have time for one: **Phase 1.1 + 1.2** — half a day of work, immediate visible impact, zero risk to other surfaces.

If you have a week: **Phase 1 + Phase 2.1–2.3** — the page becomes meaningfully personalized; everything else compounds on this foundation.

If you have two weeks: add Phase 3 — the science layer is the brand promise; making it specific is the highest user-trust win after personalization.

Phase 4 is opportunistic — slot in between feature work or when a related file is being touched.
