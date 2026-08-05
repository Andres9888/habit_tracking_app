# Habit Library: Items 7-11 Implementation Plan

## Context

The `templates-review-improve` branch already has Tier 1 + partial Tier 2 done: imported state persistence, duplicate prevention, category drill sort/filter, pack name normalization, popular carousel (5->10), title rename. This plan covers the 5 remaining items that complete the habit library improvements.

---

## Implementation Order: 7 -> 8 -> 10 -> 9 -> 11

Items 7 and 8 are independent. Item 10 reuses patterns from 8. Item 9 depends on stable data flow. Item 11 is backend-only, done last so it doesn't disrupt in-progress frontend work.

---

## Item 7: "Already Added" Visual Treatment

**What exists:** `ActionButtons.tsx:32-42` already shows "Added to Habits" checkmark. `CardContainer.tsx:79` changes accent bar to `SUCCESS_COLOR`. These only show when you look at the full card detail.

**What's missing:** No at-a-glance visual for imported cards in lists/carousels. No "Hide imported" toggle in SeeAllView.

### Changes

**`src/components/TemplateCard/components/CardContainer.tsx` (86 lines)**
- Add subtle opacity on the container when `isImported`: `opacity: isImported ? 0.7 : 1`
- This is a 1-line change in the existing style computation (~line 59)

**`src/components/TemplateCard/components/TemplateCardContent.tsx` (96 lines)**
- After `CategoryBadge` in the header row, conditionally render a small green "Added" pill
- Inline: `{isImported && <View style={addedBadgeStyle}><Text style={addedTextStyle}>Added</Text></View>}`
- Add 2 small style objects at bottom (pill + text) - ~8 lines added
- File stays under 100 lines if we keep the badge inline (no separate component needed for 8 lines)

**`src/screens/TemplatesScreen/components/TrendingCard/TrendingCard.tsx` (55 lines)**
- Add opacity treatment: `style={[s.card, isImported && { opacity: 0.65 }]}`
- Verify `isImported` prop is already threaded through (check TrendingCard.types.ts)

**`src/screens/TemplatesScreen/views/SeeAllView.tsx` (69 lines)**
- Add `const [hideImported, setHideImported] = useState(false)`
- Filter: `const displayTemplates = hideImported ? templates.filter(t => !importedTemplateIds.has(t._id)) : templates`
- Add toggle chip between ScreenHeader and FlatList (matching CategoryDrillView chip style)
- Update subtitle to show filtered count
- File grows to ~88 lines

---

## Item 8: Featured Collection -> Curated Templates View

**Problem:** Hero card dumps user into entire category (30-64 templates). The 4 chips are decorative.

### Changes

**`src/screens/TemplatesScreen/components/FeaturedCollection/featuredCollections.ts` (57 lines)**
- Add `templateNames: string[]` to `FeaturedCollectionData` interface
- Add matching template names to each collection:
  - MORNING: `['Consistent Wake Time', 'Hydration First', 'Morning Pages', '5-Minute Meditation']`
  - AFTERNOON: `['Deep Work Session', 'Walking Break', 'Hydration First', 'Daily Reading']`
  - EVENING: `['Digital Detox Hour', 'Daily Reading', 'Evening Stretch Routine', 'Sleep Preparation Routine']`
  - WEEKEND: `['5-Minute Meditation', 'Daily Reading', 'Creative Practice', 'Social Connection']`
- These names must match DB template names exactly (verify via `listTemplateNames` query before implementation)

**`src/screens/TemplatesScreen/hooks/useViewNavigation.ts` (75 lines)**
- Add to `TemplateViewState` union: `| { type: 'curated'; title: string; templateNames: string[] }`
- Add `openCurated` callback (same pattern as `openCategory`)
- File grows to ~88 lines

**`src/screens/TemplatesScreen/components/FeaturedCollection/FeaturedCollection.tsx`**
- Change `onPress` to pass `(title, templateNames)` instead of `(categoryId)`

**New: `src/screens/TemplatesScreen/views/CuratedSetView.tsx` (~65 lines)**
- Props: `title`, `templateNames`, `allTemplates`, + shared import/preview props
- Filters `allTemplates` by name match (case-insensitive, trimmed)
- `ScreenHeader` with title + "X curated templates" subtitle
- `FlatList` of `TemplateCard` components
- Graceful empty state if no names match

**`src/screens/TemplatesScreen/views/renderSubView.tsx` (37 lines)**
- Import `CuratedSetView`
- Add `curated` type handler - filter allTemplates by templateNames, render CuratedSetView
- File grows to ~55 lines

**`src/screens/TemplatesScreen/TemplatesScreen.tsx` (104 lines)**
- Change `onFeaturedPress` wiring from `viewNav.openCategory(categoryId)` to `viewNav.openCurated(title, templateNames)`
- File is already at 104 lines - will need to extract a helper or reduce existing code

---

## Item 10: Pack Detail View

**Problem:** Pack press immediately shows confirm modal. Users can't preview individual templates in the pack.

### Changes

**`src/screens/TemplatesScreen/hooks/useViewNavigation.ts`**
- Add to union: `| { type: 'pack'; packId: string }`
- Add `openPack` callback
- File grows to ~95 lines (getting tight on 100-line limit - monitor)

**New: `src/screens/TemplatesScreen/views/PackDetailView.tsx` (~85 lines)**
- Props: `packId`, `allTemplates`, + shared props + `onImportAll`
- Finds pack from `PREMIUM_PACKS` by id
- Matches pack habits to templates using normalized name matching (same as `usePackConfirm`)
- Renders:
  - `ScreenHeader` with pack name + habit count subtitle
  - Gradient banner (pack colors) with description + "Import All" button
  - `FlatList` of matched `TemplateCard` components
  - Unmatched habits shown as simple rows with emoji + name

**New: `src/screens/TemplatesScreen/views/PackDetailHeader.tsx` (~45 lines)**
- Gradient banner extracted to keep PackDetailView under 100 lines
- `LinearGradient` with pack emoji group, description, "Import All" CTA

**`src/screens/TemplatesScreen/views/renderSubView.tsx`**
- Add `pack` type handler
- Add `onImportAll` to `SubViewProps`
- File grows to ~65 lines

**`src/screens/TemplatesScreen/TemplatesScreen.tsx`**
- Change `PremiumPacksSection` onPress from `packConfirm.handlePackPress` to `viewNav.openPack`
- Thread `onImportAll` through renderSubView to trigger existing pack confirm flow

---

## Item 9: "Recommended for You" Section

**Problem:** No personalization. Every user sees the same browse order regardless of their habits.

### Changes

**New: `src/screens/TemplatesScreen/hooks/useRecommendations.ts` (~60 lines)**
- Inputs: `allTemplates`, `importedTemplateIds`
- Algorithm:
  1. Find categories of imported templates
  2. Identify underrepresented/unexplored categories
  3. From those categories, pick top templates by popularityScore (exclude imported)
  4. Return 6-8 recommendations
- Returns `{ recommendations: Doc<'templates'>[], isPersonalized: boolean }`
- `isPersonalized = false` when user has no imports (fallback to "Popular to Get Started")
- Wrapped in `useMemo` for performance

**New: `src/screens/TemplatesScreen/components/RecommendedSection/RecommendedSection.tsx` (~70 lines)**
- Mirrors `PopularSection` structure (horizontal FlatList of TrendingCards)
- Header: "Recommended for You" or "Popular to Get Started"
- Same card interactions (preview, import)

**New: `src/screens/TemplatesScreen/components/RecommendedSection/index.ts`**
- Barrel export

**`src/screens/TemplatesScreen/views/MainBrowseView.tsx` (66 lines)**
- Add `RecommendedSection` between FeaturedCollection and PopularSection
- Shift animation stagger indices
- File grows to ~78 lines

**`src/screens/TemplatesScreen/hooks/useTemplatesScreenProps.ts` (104 lines)**
- Call `useRecommendations` hook
- Pass results to MainBrowseView props
- File is at 104 lines - may need to extract recommendation logic

---

## Item 11: Dynamic Popularity from Usage Data

**Problem:** `popularityScore` is static (76-98), hardcoded in seed data. Doesn't reflect real user behavior.

### Changes

**New: `convex/templates/computePopularity.ts` (~45 lines)**
- `internalMutation` that:
  1. Gets all templates
  2. Gets all templateUsage records (using `by_template` index)
  3. Groups usage counts by templateId
  4. Computes score: `Math.min(100, Math.max(baselineScore, importCount * scaleFactor))`
  5. Patches each template's `popularityScore`
- Baseline score prevents all templates from dropping to 0 on first run
- Scale factor TBD based on total user count (e.g., `importCount * 10` for early stage)

**New: `convex/crons.ts` (~15 lines)**
- Daily cron at 4 AM UTC calling `internal.templates.computePopularity.compute`
- First cron file in the project

**`convex/templates.ts`**
- Export the new `computePopularity` module

**No query changes needed** - `getPopular` already sorts by `popularityScore`, which the cron writes to directly.

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| `TemplatesScreen.tsx` already at 104 lines | Extract view-specific prop builders into helpers during Item 8 |
| `useViewNavigation.ts` growing with 3 new view types | If >100 lines after Item 10, extract callbacks to `viewNavigation.helpers.ts` |
| Featured collection templateNames don't match DB | Run `listTemplateNames` query to get exact names before hardcoding |
| Item 11 cron zeroes out scores on first run | Use `max(baseline, liveCount)` formula to preserve seed scores |
| TrendingCard may not have `isImported` prop | Verify prop threading in `PopularSection` -> `TrendingCard` |

---

## Verification

- **Item 7:** Import a template, return to browse. Verify: opacity dimming on TrendingCard + "Added" badge on TemplateCard + SeeAllView toggle hides imported
- **Item 8:** Tap featured hero card at different times of day. Verify: CuratedSetView shows 4 specific templates (not full category). Back nav works
- **Item 10:** Tap pack card. Verify: PackDetailView shows all pack habits matched to templates. Individual preview works. "Import All" still has confirm step
- **Item 9:** New user sees "Popular to Get Started". User with habits in 2 categories sees recommendations from other categories
- **Item 11:** Run `computePopularity` mutation manually. Verify `popularityScore` updates on template docs. Trending section reflects new order

## Key Files

| File | Items | Current Lines |
|------|-------|:---:|
| `src/components/TemplateCard/components/CardContainer.tsx` | 7 | 86 |
| `src/components/TemplateCard/components/TemplateCardContent.tsx` | 7 | 96 |
| `src/screens/TemplatesScreen/components/TrendingCard/TrendingCard.tsx` | 7 | 55 |
| `src/screens/TemplatesScreen/views/SeeAllView.tsx` | 7 | 69 |
| `src/screens/TemplatesScreen/components/FeaturedCollection/featuredCollections.ts` | 8 | 57 |
| `src/screens/TemplatesScreen/hooks/useViewNavigation.ts` | 8, 10 | 75 |
| `src/screens/TemplatesScreen/views/renderSubView.tsx` | 8, 10 | 37 |
| `src/screens/TemplatesScreen/TemplatesScreen.tsx` | 8, 10 | 104 |
| `src/screens/TemplatesScreen/views/MainBrowseView.tsx` | 9 | 66 |
| `src/screens/TemplatesScreen/hooks/useTemplatesScreenProps.ts` | 9 | 104 |
| `convex/templates.ts` | 11 | ~140 |
