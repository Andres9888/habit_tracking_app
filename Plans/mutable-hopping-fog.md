# Templates Screen Review & Improvements

## Context

The Templates screen is how users discover and import science-backed habit templates. It has 289 templates across 14 categories, a time-aware featured hero, trending carousel, category grid, and premium packs. The screen is well-architected but has several gaps that reduce its value to users: no memory of what they've imported, no duplicate prevention, broken pack imports, and a flat browse experience that doesn't scale well for returning users.

This plan focuses on high-impact, low-to-medium effort improvements that make the templates screen genuinely useful rather than a one-time browse.

---

## Tier 1: Quick Wins

### 1. Persist "Already Imported" state across sessions
**Problem:** `importedTemplateIds` is a `useState<Set>` that resets every session. Users have no memory of what they already imported. The `templateUsage` table tracks imports but has no `by_user` index and no query fetches user's imports.

**Changes:**
- `convex/schema.ts` (line 302): Add `.index('by_user', ['userId'])` to `templateUsage`
- `convex/templates/queries.ts`: New `getImportedTemplateIds` query returning template IDs for authenticated user
- `src/screens/TemplatesScreen/useTemplatesData.ts`: Call the new query, return as initial imported set
- `src/screens/TemplatesScreen/TemplatesScreen.hooks.ts`: Initialize `importedTemplateIds` from fetched data instead of empty Set

### 2. Duplicate import prevention
**Problem:** `importTemplate` mutation has no duplicate check. Users can create 5 identical habits from the same template.

**Changes:**
- `convex/schema.ts`: Add `.index('by_user_template', ['userId', 'templateId'])` to `templateUsage`
- `convex/templates/importTemplate.ts` (after line 41): Query `templateUsage` for existing `userId + templateId`. If found, return `{ habitId: existing.habitId, success: true, alreadyExists: true }`
- `src/screens/TemplatesScreen/hooks/useTemplateImportHandlers.ts`: Handle `alreadyExists` response with toast "You've already imported this habit"

### 3. Fix pack name matching (fragile string matching)
**Problem:** `usePackConfirm.ts` line 30-31 does exact string matching: `names.has(t.name)`. Any name mismatch silently drops habits from the pack import. Errors are swallowed (line 40: `catch { /* skip */ }`).

**Changes:**
- `src/screens/TemplatesScreen/hooks/usePackConfirm.ts`: Normalize matching with `t.name.trim().toLowerCase()` for both pack habit names and template names
- Log/surface failed matches so pack imports don't silently drop habits

### 4. Increase popular carousel from 5 to 10
**Problem:** `POPULAR_LIMIT = 5` in `useMainBrowseData.ts` line 14. Only 5 of 289 templates shown in the highest-visibility section.

**Changes:**
- `src/screens/TemplatesScreen/hooks/useMainBrowseData.ts` line 14: Change `5` to `10`

### 5. Better screen title
**Problem:** "Import Habits" is functional, not aspirational. Users come here to discover, not "import."

**Changes:**
- `src/screens/TemplatesScreen/views/MainBrowseView.tsx` line 30-31: Change title to "Discover Habits", subtitle to "Science-backed templates to kickstart your routine"

---

## Tier 2: Medium Efforts

### 6. Add sort/filter to CategoryDrillView
**Problem:** Drilling into a category (e.g., Health with 64 templates) gives a flat unsorted list with no way to filter or sort.

**Changes:**
- `src/screens/TemplatesScreen/views/CategoryDrillView.tsx`: Add a compact filter bar using existing `SortDropdown` and `ResearchFilterButton` components
- New hook: `src/screens/TemplatesScreen/hooks/useCategoryDrillFilters.ts` for sort/filter state
- Sort options: Popular (default), A-Z, Science-backed first

### 7. "Already added" visual treatment + hide-imported toggle
**Problem:** Returning users see the same 289 templates with no indication of what they already have. Must tap into each card to see.

**Changes:**
- `src/components/TemplateCard/TemplateCardRender.tsx`: Add subtle opacity reduction + "Added" chip for imported templates
- `src/screens/TemplatesScreen/views/CategoryDrillView.tsx`: Add "Hide imported" toggle
- `src/screens/TemplatesScreen/views/SeeAllView.tsx`: Same toggle

### 8. Featured collection links to curated templates, not just category
**Problem:** Featured hero card (e.g., "Morning Mastery") dumps user into full category with 30+ templates. The 4 chips shown on the hero are just decorative strings, not linked to actual templates.

**Changes:**
- `src/screens/TemplatesScreen/components/FeaturedCollection/featuredCollections.ts`: Add `templateNames: string[]` to `FeaturedCollectionData` matching the chip labels to actual template names
- `src/screens/TemplatesScreen/hooks/useViewNavigation.ts`: Add `{ type: 'curated'; templates: Doc<'templates'>[] }` view state
- New: `src/screens/TemplatesScreen/views/CuratedSetView.tsx`: Focused view showing only the 4-6 curated templates
- `src/screens/TemplatesScreen/views/renderSubView.tsx`: Handle new `curated` view type

---

## Tier 3: Bigger Bets (future consideration)

### 9. "Recommended for You" personalized section
Analyze user's existing habit categories, suggest templates from unexplored categories. New `useRecommendations` hook + `RecommendedSection` component inserted between FeaturedCollection and PopularSection.

### 10. Pack detail view with individual template previews
Instead of blind "Import Pack" confirmation, show a `PackDetailView` listing each habit with descriptions and science info. Users can preview individual templates before committing to the whole pack.

### 11. Dynamic popularity from real usage data
Replace static `popularityScore` (76-98) with real scores computed from `templateUsage` import counts via a Convex scheduled function.

---

## Implementation Order

1. Items 1-2 together (schema changes, queries, import logic)
2. Item 3 (pack fix - standalone)
3. Items 4-5 together (trivial constant/string changes)
4. Item 6 (category drill filtering)
5. Item 7 (visual treatment for imported)
6. Item 8 (curated featured)
7. Tier 3 items as separate PRs

## Verification

- **Items 1-2:** Import a template, close and reopen Templates screen, verify checkmark persists. Try importing same template again, verify toast/error. Check `templateUsage` table has proper indexes.
- **Item 3:** Import a pack, verify all habits are created (not just exact name matches).
- **Item 4:** Open Templates screen, verify 10 cards in trending carousel.
- **Item 5:** Open Templates screen, verify new title/subtitle.
- **Items 6-8:** Navigate to category, verify sort/filter controls. Check imported templates show "Added" treatment. Tap featured hero, verify curated view shows specific templates.

## Key Files Reference

| File | Role |
|------|------|
| `convex/schema.ts:296-303` | templateUsage table + indexes |
| `convex/templates/importTemplate.ts` | Core import mutation |
| `convex/templates/queries.ts` | Template queries |
| `src/screens/TemplatesScreen/useTemplatesData.ts` | Data fetching hooks |
| `src/screens/TemplatesScreen/hooks/useMainBrowseData.ts` | Browse data aggregation |
| `src/screens/TemplatesScreen/hooks/usePackConfirm.ts` | Pack import logic |
| `src/screens/TemplatesScreen/hooks/useTemplateImportHandlers.ts` | Import handlers |
| `src/screens/TemplatesScreen/views/MainBrowseView.tsx` | Main layout |
| `src/screens/TemplatesScreen/views/CategoryDrillView.tsx` | Category detail view |
| `src/screens/TemplatesScreen/components/FeaturedCollection/featuredCollections.ts` | Time-aware featured data |
| `src/screens/TemplatesScreen/components/TrendingCard/TrendingCard.tsx` | Trending carousel card |
| `src/components/TemplateCard/` | Standard template card |
