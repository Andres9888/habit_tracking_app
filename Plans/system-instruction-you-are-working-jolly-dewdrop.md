# Habit Library — Quick + High ROI chips, plus scroll affordance

## Context

The Habit Library page (`src/screens/TemplatesScreen/`) just shipped phase 1 (commit `a7667776c`) with a `QuickFilterChips` row containing **All + 7 category chips**. Two issues remain:

1. **No way to surface "quick habits" or "high-ROI habits"** as a one-tap filter. The user wants both as filter chips so they can quickly browse short-duration habits and high-impact habits without scanning every category.
2. **Scroll affordance is weak on iPhone 16 Pro Max.** The chip row has only a 32px right-edge fade. On a 430pt-wide screen more chips fit visually, so it's not obvious there are more categories off-screen to the right.

**Intended outcome:** Two new chips (`⚡ Quick`, `🔥 High ROI`) inserted right after `✨ All`, plus a wider fade with a chevron glyph that unmistakably says "scroll for more."

**Data reality check:** `estimatedMinutes` exists in `convex/schema.ts` but is **not populated** in any seed template (verified — only appears in schema definition). So "Quick" must be derived heuristically from `name + description` text. `popularityScore` IS populated across the 250+ seed templates with values 70-98, so it's the natural signal for "High ROI."

---

## Approach (recommended)

### A. Extend `Category` union — single state, no parallel `selectedPreset`

Add `'quick' | 'high-roi'` to the `Category` union. Keeps `selectedCategory` as the single source of truth — every existing call-site (`MainBrowseView`, `useFilteredTemplates`, `CategoryHeader`, `SearchResults`, `useTemplatesScreenProps`) keeps working with no fan-out. A parallel preset state would double every "is filter active" check and risk exclusivity bugs (Quick + Sleep simultaneously).

### B. Heuristic helpers in a new file (small, pure, testable)

New file `src/screens/TemplatesScreen/data/templateFilters.ts` (~40 lines):

```ts
const QUICK_RX =
  /\b(?:[1-5]\s*[-–]?\s*minute|one\s+minute|two\s+minute|three\s+minute|four\s+minute|five\s+minute|30\s*sec|10\s*sec|15\s*sec|micro|quick|brief|tiny|moment)\b/i;

export function isQuickTemplate(t: { description?: string; estimatedMinutes?: number; name?: string }): boolean {
  if (typeof t.estimatedMinutes === 'number') return t.estimatedMinutes <= 5;
  return QUICK_RX.test(`${t.name ?? ''} ${t.description ?? ''}`);
}

export const HIGH_ROI_THRESHOLD = 85;
export function isHighRoiTemplate(t: { popularityScore?: number }): boolean {
  return (t.popularityScore ?? 0) >= HIGH_ROI_THRESHOLD;
}
```

The regex caps minute-words at "five" deliberately — "15-minute intervals" should NOT match. Future-proofed to prefer `estimatedMinutes` if/when it gets populated. Tunable threshold via the exported constant.

### C. Filter wiring — extend the existing branch in `useFilteredTemplates`

In `src/screens/TemplatesScreen/useFilteredTemplates.ts`, replace lines 85-86:

```ts
if (selectedCategory === 'quick') data = data.filter(isQuickTemplate);
else if (selectedCategory === 'high-roi') data = data.filter(isHighRoiTemplate);
else if (selectedCategory !== 'all') data = data.filter((t) => t.category === selectedCategory);
```

Type safety: extending the `Category` union makes TS exhaust all branches. The existing cast at `TemplatesScreen.tsx:124` already widens the chip callback's `string | null`, so no change there.

### D. Chip placement — positions 2 & 3, after "All"

In `QuickFilterChips.tsx`, render two extra hardcoded `<Chip>` elements between the existing `✨ All` chip and the `categories.map(...)` loop. Don't thread them through `quickFilterCategories` from `useMainBrowseData` — they're presets, not categories. Keeps `useMainBrowseData` untouched.

Inline `activeMeta` for the new chips (since `getCategoryMeta('quick')` would fall back to defaults):
- `⚡ Quick` — amber active style (`bgColor: '#FBBF24', borderColor: '#F59E0B', textColor: '#78350F'`)
- `🔥 High ROI` — red active style (`bgColor: '#FEE2E2', borderColor: '#EF4444', textColor: '#7F1D1D'`)

Result: `✨ All | ⚡ Quick | 🔥 High ROI | 🌅 Morning | 🧠 Mental | 💪 Fitness | 😴 Sleep | 🧘 Mindful | 📚 Learning | 💰 Finance` (10 chips total — making the row inherently more obviously scrollable).

### E. Label override for `getCategoryLabel`

`useTemplatesScreenProps.ts:78` looks up label via `data.categories?.find()`. For preset values it'd fall back to the raw ID. Add a 2-line guard:

```ts
const getCategoryLabel = (categoryId: string) => {
  if (categoryId === 'quick') return 'Quick';
  if (categoryId === 'high-roi') return 'High ROI';
  return data.categories?.find((c) => c.id === categoryId)?.label || categoryId;
};
```

### F. Scroll affordance — widen fade to 64px + add `›` chevron glyph

In `QuickFilterChips.tsx`:

1. Bump fade width from `spacing.xl` (32px) → 64px.
2. Bump `row.paddingRight` from 40 → 72 so the last chip isn't visually clipped under the wider hint.
3. Wrap the existing `<LinearGradient>` in a `<View style={s.scrollHint}>` and add a faint `›` `<Text>` right-aligned inside, color `colors.text.tertiary`, `accessibilityElementsHidden`. Both elements share `pointerEvents='none'`.

Picked combo (a)+(b) over scroll-position-tracked left-edge fade because: zero new state, zero new dependencies, no `onScroll` handler. Adding 2 chips also helps inherently — more clipping = more obviously scrollable.

---

## Files to change (dependency order)

1. **`src/screens/templates/templates.types.ts`** — extend `Category` union with `| 'quick' | 'high-roi'`.
2. **`src/screens/TemplatesScreen/data/templateFilters.ts`** *(NEW, ~40 lines)* — `isQuickTemplate`, `isHighRoiTemplate`, `QUICK_RX`, `HIGH_ROI_THRESHOLD`.
3. **`src/screens/TemplatesScreen/useFilteredTemplates.ts`** — import helpers, branch on preset values before exact-category match.
4. **`src/screens/TemplatesScreen/components/QuickFilterChips/QuickFilterChips.tsx`** — render Quick + High ROI chips after All; widen fade to 64px; add chevron glyph; bump `row.paddingRight` to 72.
5. **`src/screens/TemplatesScreen/hooks/useTemplatesScreenProps.ts`** — add 2-line label guard for `'quick'` / `'high-roi'`.
6. **`src/screens/TemplatesScreen/__tests__/useFilteredTemplates.test.tsx`** — add 2 cases (preset filtering returns expected subsets).

**Branch:** This workspace is on `copenhagen`. The instruction says to rename to a concrete short name — `library-quick-roi-chips` (22 chars). Do at the very start of execution: `git branch -m library-quick-roi-chips`.

---

## Verification

1. **Type check:** `npx tsc --noEmit` — confirms `Category` union extension compiles cleanly across all 13+ call-sites.
2. **Lint:** `npm run lint:max-lines` — confirms new `templateFilters.ts` is under 100 lines and `QuickFilterChips.tsx` stays under 100 lines (currently 163 with `eslint-disable max-lines` at top — line count won't materially change, just adding 2 chips and 1 view wrapper).
3. **Unit tests:** `npm test -- useFilteredTemplates` — new cases pass: `selectedCategory: 'quick'` returns only items matching `QUICK_RX` (or `estimatedMinutes <= 5` if set); `selectedCategory: 'high-roi'` returns only `popularityScore >= 85`.
4. **Manual smoke (run dev server, open library):**
   - Tap `⚡ Quick` → results include "5-Minute Meditation", "Two-Minute Tidy", exclude "7-Minute Workout" / longer items.
   - Tap `🔥 High ROI` → results show only top-tier popularity templates.
   - Tap a regular category chip → still works (no regression).
   - Combine: tap Quick, then type "meditate" in search → composes correctly.
   - On iPhone 16 Pro Max simulator (430pt wide): chevron and wider fade visible at right edge; row scrolls to reveal Learning / Finance.
5. **Threshold sanity check:** Open console / log `templates.filter(isHighRoiTemplate).length` — should be ~30-40% of seed (not all, not just a handful). Tune `HIGH_ROI_THRESHOLD` if too narrow/wide.

---

## Risks & edge cases

- **`useCategoryCounts` (line 54-55):** writes `counts[template.category as Category]`. Fine because seed `template.category` never produces preset values — these are derived. Don't surface counts on preset chips. If counts are needed later, compute inline (`allTemplates.filter(isQuickTemplate).length`).
- **`isCategoryFilterActive` semantics in `MainBrowseView:27`:** `selectedCategory !== 'all'` returns `true` for presets — desirable (filtered body renders).
- **Empty filter results:** `SearchResults` already handles empty state with `onResetFilters` — no new UX work.
- **False positives in `isQuickTemplate`:** Acceptable per the heuristic nature. "Quick" appearing in flavor text will match — fine. "25-minute intervals" won't match (regex bounded to `[1-5]`).
- **Performance:** ~150-250 templates × one regex test inside `useMemo` — trivial.
- **i18n:** Hardcoded "Quick" / "High ROI" strings. No i18n infrastructure visible in chip file currently — defer.
- **A/B / analytics:** No `screens.templates.chip_press` event currently fires from `QuickFilterChips`. If telemetry is desired, can be added in a follow-up.
