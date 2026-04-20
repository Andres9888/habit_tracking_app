# Rename "Most used" filter chip to "Popular"

## Context

In the category drill-down view (e.g. "Stress less" category showing 61 habits), three filter chips appear above the habits list: **Most used**, **A-Z**, **Not added · 61**. The currently-active chip is "Most used", which sorts by popularity score and produces a sectioned list with a **⭐ Popular** header (top 3 picks) and an **All habits** header (the rest).

The user wants the chip label to read **Popular** instead of **Most used** so the chip reflects the same concept as the section header it drives. No data/logic changes — only the chip label.

## The change

**File:** `src/screens/TemplatesScreen/views/CategoryDrillView.tsx`

Line 45, inside `SORT_OPTIONS`:

```diff
- { key: 'popular', label: 'Most used' },
+ { key: 'popular', label: 'Popular' },
```

That's the entire change. The underlying sort key remains `'popular'`, so no downstream code needs to change:
- `useCategoryDrillFilters` still receives `'popular'` as the sort key.
- `useDrillSections` still emits the `⭐ Popular` / `All habits` section headers when sort is `'popular'`.
- No tests reference the old label.
- No i18n files exist — label is hardcoded in the component.

## Verification

1. Run `npm run lint` and `npm run typecheck` — no lint or type changes expected since it's a string literal.
2. Launch the app, open the Library, tap a category (e.g. "Stress less"), and confirm:
   - The first filter chip now reads **Popular** (instead of "Most used").
   - Tapping it still sorts the list with the `⭐ POPULAR` section on top and `ALL HABITS` below.
   - Tapping **A-Z** still switches to alphabetical.
   - **Not added · N** still toggles imported-habit filtering.

## Post-approval steps (not done in plan mode)

1. Rename git branch: `git branch -m popular-filter-label`
2. Apply the one-line edit above.
3. Commit with message like `chore(library): rename "Most used" chip to "Popular"`.
