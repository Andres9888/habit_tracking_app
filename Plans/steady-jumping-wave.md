# Templates Page UX Improvements

## Context

The Templates (Habit Library) page has 10 targeted UX improvements based on behavioral science principles. Each improvement addresses a specific friction point or engagement opportunity identified in a design audit. The mockup is at `.superdesign/design_iterations/templates_improvements_1.html`.

---

## Improvements by Priority

### Group A: Quick Visual Fixes (< 30 min each)

#### 7. Match skeleton margins to loaded cards (Perceptual Stability)
- **File:** `src/screens/TemplatesScreen/components/SkeletonCard.tsx:11`
- **Change:** Replace `mx-5 ... p-5` (20px) with `mx-4 ... p-4` (16px) to match loaded card margins
- **Risk:** None

#### 2. Add "12.4k users" to trending cards (Social Proof)
- **File:** `src/screens/TemplatesScreen/components/TrendingCard/formatPopularity.ts`
- **Change:** Replace `"X.XK track this"` format with `"X.Xk users"`. Change `"New"` to keep or replace per preference.
- **Risk:** None — existing tests at `tests/unit/components/TrendingCard/formatPopularity.test.ts` need updating

#### 10. Increase premium pack text readability (WCAG AA Contrast)
- **File:** `src/screens/TemplatesScreen/components/PremiumPacksSection/PremiumPackCard.tsx:50-53`
- **Change:** Add `textShadowColor: 'rgba(0,0,0,0.3)'`, `textShadowOffset: {width: 0, height: 1}`, `textShadowRadius: 2` to name and desc styles
- **Risk:** None — purely additive styling

---

### Group B: Theme Consistency (1-2 hrs each)

#### 9. Replace white-alpha colors in FeaturedCollection with theme tokens (Theme Consistency)
- **Files:**
  - `src/screens/TemplatesScreen/components/FeaturedCollection/FeaturedCollection.styles.ts` — 7 instances of `rgba(255,255,255,...)`. Convert interactive elements (badge, cta, description, habitCount) to use `colors.text.inverse` with opacity. Keep decorative circles (circleOne, circleTwo) as-is since they're visual-only on gradient.
  - `src/screens/TemplatesScreen/components/FeaturedCollection/HeroFooter.tsx:22` — Replace hardcoded `'#FFFFFF'` with `colors.text.inverse`
- **Approach:** Convert `FeaturedCollection.styles.ts` from static `StyleSheet.create` to a factory function `createStyles(colors)` called inside the component, so it can reference semantic tokens
- **Risk:** Low — the card is always on a green gradient, so white text is always correct, but using tokens is the right pattern

#### 5. Fix science badge dark mode with burnished gold tokens (Credibility Signaling)
- **Files:**
  - `src/components/FullsizeTemplatePreview/styles/science.styles.ts` — Uses static `import { colors } from '@/theme'` which NEVER adapts to dark mode. Must convert to dynamic styles using `useThemeColors()`. Switch from `primary[100]/[700]` to `status.streakLight/status.streakText` (burnished gold)
  - `src/screens/TemplatesScreen/components/ExploreAllSection/ExploreHabitRow.tsx:61-62` — Science badge uses `colors.primary[100]/[700]`. Change to `colors.status.streakLight/streakText`
  - `src/screens/TemplatesScreen/views/TemplateListCard.tsx` — Same badge swap
- **Approach:** Convert `science.styles.ts` to a function that accepts colors, use streak tokens for gold
- **Risk:** Low — verify streak tokens exist in both light and dark palettes

---

### Group C: Category UX (30 min - 1 hr each)

#### 1. Collapse Categories + Premium below fold (Paradox of Choice)
- **File:** `src/screens/TemplatesScreen/views/MainBrowseView.tsx:69-77`
- **Change:** Swap the order of `{p.exploreAllSection}` (stagger 4) with `{p.categoryGrid}` (stagger 2) and `{p.premiumPacksSection}` (stagger 3). New order: Featured → Popular → ExploreAll → CategoryGrid → PremiumPacks
- **Risk:** Low — pure reorder of Animated.View children

#### 6. Add chevrons + borders + press state to category tiles (Norman's Signifiers)
- **Files:**
  - `src/screens/TemplatesScreen/components/CategoryGrid/CategoryTile.tsx` — Add `borderWidth: 1`, `borderColor` prop, `ChevronRight` icon from lucide, press opacity via Pressable style function
  - `src/screens/TemplatesScreen/components/CategoryGrid/CategoryGrid.tsx:14` — Add `borderColor` to `CategoryItem` interface, pass to CategoryTile
  - Data source where categories are built — add `borderColor` from `CATEGORY_META`
- **Risk:** Low — additive changes only

---

### Group D: Search Recovery (2-3 hrs)

#### 8. Replace dead-end empty search with category pills + "Create custom" (Abandonment Recovery)
- **Files:**
  - `src/screens/TemplatesScreen/components/TemplatesListEmpty.tsx` — Redesign to show category suggestion pills and "Create custom habit" CTA instead of just "No habits match"
  - `src/screens/TemplatesScreen/views/CategorySearchView.tsx` — Thread category data and create-custom handler down to TemplatesListEmpty
- **Risk:** Low — self-contained component change

---

### Group E: Sort Logic (3-4 hrs)

#### 3. Show simple habits first + "Start small" tags (Anchoring Effect)
- **New file:** `src/screens/TemplatesScreen/utils/simplicityScore.ts` — Client-side heuristic based on frequency (daily = simpler), description length, tip count
- **Modified files:**
  - `src/screens/TemplatesScreen/components/TrendingCard/TrendingCard.tsx` — Add "Start small" badge for simple habits
  - Sort logic in data hook — blend simplicity into popular template ordering
- **Risk:** Medium — changes template ordering which affects user experience

---

### Deferred (not in scope)

- **#4 Merge preview + customize** — High risk, 35+ files, defer to dedicated sprint

---

## Implementation Order

1. **#7** Skeleton margins `mx-5 p-5` → `mx-4 p-4` (trivial)
2. **#2** formatPopularity format strings + update test (trivial)
3. **#10** PremiumPackCard text shadow (trivial)
4. **#1** Reorder MainBrowseView sections (quick swap)
5. **#6** CategoryTile borders + chevron + press state (small)
6. **#9** FeaturedCollection styles → dynamic with theme tokens (medium)
7. **#5** Science badge gold tokens + dark mode fix (medium)
8. **#8** TemplatesListEmpty → category pills + create custom CTA (medium)
9. **#3** Simplicity score + "Start small" tags + sort (largest)

---

## Verification Plan

1. **Visual check (dark + light mode):** Open Templates screen in both themes, verify:
   - Skeleton cards align with loaded cards (improvement 7)
   - Trending cards show "Xk users" format (improvement 2)
   - Premium pack text is readable over gradients (improvement 10)
   - Science badges show burnished gold, not blue, in dark mode (improvement 5)
   - FeaturedCollection uses theme tokens (improvement 9)
   - Category tiles have borders, chevrons, press feedback (improvement 6)
   - Categories/Premium are below ExploreAll in scroll (improvement 1)
2. **Search empty state:** Search for nonsense term, verify pills + "Create custom" appear (improvement 8)
3. **Unit tests:** Update `formatPopularity.test.ts` for new format strings
4. **Lint:** Run `npm run lint:max-lines` to verify no file exceeds 100 lines
