# Habit Library (TemplatesScreen) — Slow Open Diagnosis & Fix Plan

## Context

Opening the Habit Library feels slow. The screen mounts `MainBrowseView`, which eagerly renders an `ExploreAllSection` containing every habit template grouped by category. The templates data set is large (~327 templates in `convex/templatesDataSeed.ts`), and every category group is expanded by default. All rows render synchronously inside a plain `ScrollView` (no virtualization), so the first paint waits on hundreds of `ExploreHabitRow` components — each one running a Reanimated shared-value hook (`useAddAnimation`), a theme-context read, and mounting an `AnimatedPressable` with icon children.

The intended outcome: opening the library should feel instant. Browse categories should be discoverable, but hundreds of rows should not render until the user asks for them.

## Root Cause (verified)

1. **Primary — mass synchronous row render on mount.**
   - `src/screens/TemplatesScreen/components/ExploreAllSection/ExploreAllSection.tsx:20` — `CategoryGroupSection` defaults `expanded = useState(true)`.
   - `ExploreAllSection.tsx:70-79` maps every group; each expanded group maps every template into `ExploreHabitRow` (`ExploreAllSection.tsx:32-43`).
   - With ~327 templates (from `convex/templatesDataSeed.ts`, 5,691 lines, 327 `name:` entries) that's ~327 rows × (Reanimated shared value + theme read + AnimatedPressable) on first paint.
   - The parent is a `ScrollView` (`views/MainBrowseView.tsx:45`), not a virtualized list, so React renders everything before the user sees anything.

2. **Secondary — `ExploreAllSection` is assembled in the parent and passed down as a prebuilt element.**
   - `TemplatesScreen.tsx:159-168` constructs `<ExploreAllSection …>` as JSX eagerly and passes it as `exploreAllSection` prop to `MainBrowseView`, so even the above-the-fold work is coupled to below-the-fold work.

3. **Minor — staggered entrance animations.**
   - `views/MainBrowseView.tsx:23-27, 53-95` stagger six `FadeInDown` animations; the last (`stagger(5)`) wraps the big Explore section. Not the dominant cost, but it compounds jank when the massive child is also mounting.

4. **Not a bottleneck (ruled out):** `useGroupedTemplates` (`useGroupedTemplates.ts:13-39`) is a single `useMemo` with O(n log n) sort — cheap at n=327. `habitCountsByGoalId` in `TemplatesScreen.tsx:74-82` is also cheap (≤ ~10 goals × 327 filter).

## Recommended Fix (surgical, smallest possible change)

### Step 1 — Collapse categories by default (one-line change, biggest win)

Flip the initial state in `ExploreAllSection.tsx:20`:

```ts
const [expanded, setExpanded] = useState(false);
```

Impact: initial render drops from ~327 rows to 0 rows in the Explore section. Users tap a category header to expand on demand.

Keep the existing `CategoryGroupHeader` tap-to-expand behavior — already supported (`ExploreAllSection.tsx:30`).

### Step 2 — Verify the above-the-fold sections aren't blocked by below-the-fold work

Read `views/MainBrowseView.tsx:93-95`. Since `exploreAllSection` is a JSX element passed as a prop from `TemplatesScreen.tsx:159-168`, React still reconciles its root on mount even though children (now collapsed) are empty. That's fine with Step 1 — the cost collapses to ~14 `CategoryGroupSection` shells + headers. No change needed unless Step 1 is insufficient after testing.

### Step 3 (only if still slow after Steps 1–2) — Defer the whole Explore section below the fold

If initial paint is still slow, wrap the `ExploreAllSection` prop in an `InteractionManager.runAfterInteractions` gate or an `onScroll`-triggered mount flag in `MainBrowseView.tsx`. Do **not** refactor to a `FlatList` unless necessary — `ScrollView` with collapsed categories should be fast enough.

## Critical Files

- `src/screens/TemplatesScreen/components/ExploreAllSection/ExploreAllSection.tsx` — **the one-line change** (line 20)
- `src/screens/TemplatesScreen/views/MainBrowseView.tsx` — reference only (no change in Step 1)
- `src/screens/TemplatesScreen/TemplatesScreen.tsx` — reference only (no change in Step 1)
- `convex/templatesDataSeed.ts` — source of the ~327 templates (reference)

## Verification Plan

1. **Before:** In the running app, from Today tab, tap the tab that opens Habit Library. Note perceived delay.
2. Apply Step 1.
3. **After:** Reopen Habit Library. The grid, search, popular, and "Browse all categories" link should appear immediately. The "Discover more habits" section should show only category headers (collapsed).
4. Tap a category header — it should expand and render its rows. Tap again — collapse.
5. Scroll the list — no jank.
6. Run `npm run lint` (or project equivalent) to ensure the one-line change passes.
7. No functional regression: imports, previews, search, and drill-in navigation still work.

## Out of Scope

- No refactor of `useMainBrowseData` (not a bottleneck at n=327).
- No switch to `FlatList` / `FlashList` unless Step 1 proves insufficient.
- No changes to animations, theme, or data shape.
