# Habit Library Review — Design System Compliance & UX Audit

## Context

The Habit Library (TemplatesScreen) is the template browsing and import feature with 70+ component files. PR #1235 recently polished the UI with ExploreAllSection, TrendingCard redesign, and search fixes. This review audits design system compliance, dark mode readiness, and UX quality. Previous full-app UI review scored 17/24; archive habits modal scored 19/24.

---

## Critical Finding: Stale Typography Docstring

`src/theme/index.ts` docstring (lines 106-113) claims scale: **38/30/24/20/16/14/12**
`src/theme/typography.ts` actual values: **34/22/20/17/14/13/10**

The docstring is wrong. This means `fontSize: 13` and `fontSize: 17` throughout the codebase are ON-SCALE, not violations.

**Fix:** Update the docstring in `theme/index.ts` lines 106-113 to match actual typography.ts values.

---

## Issue 1: Dark Mode Breakage — Static Color Imports (CRITICAL)

**12 files** import static `colors` from `theme/colors` instead of using `useThemeColors()`. These won't adapt to dark mode:

| File | Static Usage |
|------|-------------|
| `PopularSection/PopularSection.tsx` | `colors.text.primary`, `colors.primary[600]` in StyleSheet |
| `CategoryGrid/CategoryGrid.tsx` | `colors.light.surfaceMuted`, `colors.border`, `colors.text.primary` |
| `CategoryGrid/CategoryTile.tsx` | `colors.text.tertiary` |
| `TrendingCard/TrendingCard.styles.ts` | `colors.light.surfaceMuted` (×2), `colors.text.*` (×3) |
| `TrendingCard/AddButton.tsx` | `colors.primary[600]`, `colors.text.*` |
| `PremiumPackCard.tsx` | `colors.text.*`, `colors.border` |
| `PremiumPacksSection.tsx` | `colors.text.*` |
| `FeaturedCollection/FeaturedCollection.styles.ts` | `colors.text.inverse` (×4) |
| `UsageBanner/UsageBanner.tsx` | `colors.light.surfaceMuted` |
| `CategoryDrillView.tsx` | `colors.light.surfaceMuted` |
| `SeeAllView.tsx` | static colors import |
| `data/categoryMeta.ts` | data file — may be acceptable |

**Total: 5 uses of `colors.light.surfaceMuted`** — hardcoded light-mode background that will look wrong in dark mode.

**Fix pattern:** Move color references from StyleSheet.create into inline styles using `useThemeColors()`, or pass colors as props from the parent component.

---

## Issue 2: Hardcoded rgba Values (HIGH)

These rgba values bypass the theme system entirely:

| File | Values |
|------|--------|
| `FeaturedCollection.styles.ts` | 6 `rgba(255,255,255,...)` overlays — acceptable on gradient hero card since it's always on a gradient background |
| `QuickFilterChips.tsx:83-86` | 4 hardcoded rgba for scroll fade — dark/light values hardcoded instead of derived from theme |
| `ScrollShadows.tsx:23-30` | 6 hardcoded rgba for dark/light gradients |
| `PremiumPackCard.tsx:70` | `rgba(255,255,255,0.76)` for CTA button |

**Fix for QuickFilterChips + ScrollShadows:** Derive fade colors from `useThemeColors().colors.background` with opacity, or create semantic tokens like `colors.fadeGradient.opaque` / `colors.fadeGradient.transparent`.

---

## Issue 3: Off-Scale Typography (MEDIUM)

True off-scale values (not matching any typography token):

| File:Line | Value | Should Be |
|-----------|-------|-----------|
| `CategoryGroupHeader.tsx:47` | `fontSize: 18` | 17 (body) or 20 (heading3) |
| `ExploreDivider.tsx:34` | `fontSize: 11` | 10 (tabBar) or 13 (caption) |
| `TrendingCard.styles.ts:31` | `fontSize: 28` | Use typography token for icon emoji |
| `CategoryTile.tsx:57` | `fontSize: 28` | Same — emoji icon size |
| `ExploreHabitRow.styles.ts:26` | `fontSize: 20` | Use `typography.heading3` spread |

Note: `fontSize: 28` for emoji icons is a visual size, not a text scale concern — acceptable to keep.

---

## Issue 4: Off-Grid Spacing (LOW-MEDIUM)

Key off-grid values in the TemplatesScreen area:

| Pattern | Count | Examples |
|---------|-------|---------|
| `gap: 6` | 3 | browseStyles, categoryStyles, ExploreHabitRow meta |
| `padding: 5` or `margin: 5` | 4 | tabStyles (legacy) |
| `paddingVertical: 2` | 2 | categoryStyles, TrendingCard scienceBadge |
| `paddingVertical: 3` | 1 | customizeStyles |
| `height/width: 44` | 3 | Touch target size — acceptable (iOS HIG standard) |
| `height/width: 80` | 1 | previewStyles icon — should be 64 or keep as custom |

Note: `height: 44` is the iOS Human Interface Guideline minimum touch target. Keep as-is.

---

## Issue 5: Off-Scale Border Radius (LOW)

| File:Line | Value | Should Be |
|-----------|-------|-----------|
| `FeaturedCollection.styles.ts:34` | `borderRadius: 90` | `9999` (full) |
| `FeaturedCollection.styles.ts:43` | `borderRadius: 100` | `9999` (full) |
| `ExploreHabitRow.styles.ts:25` | `borderRadius: 2` | `4` (xs) for the tiny dot |

---

## Issue 6: UX/Copy Review Notes

### Good
- Accessibility: `accessibilityLabel`, `accessibilityRole`, `testID` on all interactive elements
- Error boundary wrapping at screen level
- Stagger animations on browse sections (nice reveal)
- Haptic feedback on chip selection and import actions
- Template warmup hook for performance

### Concerns
- **"Trending right now"** section — `popularityScore` is a static field on templates, not a real-time trending signal. The copy implies live data. Consider "Popular habits" or "Top picks"
- **FeaturedCollection** uses `getTimeAwareFeatured()` which rotates daily — good, but the hero card copy says things like "Featured Collection" with a badge like "🌅 MORNING" — verify this feels intentional vs generic
- **"Show all X categories"** button at bottom of CategoryGrid — `fontSize: 13` should use `typography.caption` spread for font family/weight consistency
- **ExploreAllSection "Show all N habits" link** — `paddingLeft: 74` is a magic number (presumably aligning with icon+gap). Should be calculated or use a named constant

---

## Execution Plan

### Wave 1: Critical (Dark Mode)
1. **Fix static color imports** — Convert 12 files from static `colors` to `useThemeColors()` pattern
2. **Replace `colors.light.surfaceMuted`** with theme-aware equivalent in 5 files
3. **Fix QuickFilterChips/ScrollShadows** rgba to derive from theme background

### Wave 2: Typography & Docstring
4. **Update theme/index.ts docstring** to match actual typography.ts scale (34/22/20/17/14/13/10)
5. **Fix truly off-scale font sizes** — `fontSize: 18` → 17, `fontSize: 11` → 10

### Wave 3: Spacing & Radius
6. **Normalize off-grid spacing** — `gap: 6` → `spacing.xs` (4) or `spacing.sm` (8)
7. **Fix border radius** — 90/100 → 9999, 2 → 4

### Wave 4: Polish
8. **Review copy** — "Trending right now" accuracy
9. **Replace magic number** `paddingLeft: 74`

---

## Files to Modify

### Critical Path (Wave 1)
- `src/screens/TemplatesScreen/components/PopularSection/PopularSection.tsx`
- `src/screens/TemplatesScreen/components/CategoryGrid/CategoryGrid.tsx`
- `src/screens/TemplatesScreen/components/CategoryGrid/CategoryTile.tsx`
- `src/screens/TemplatesScreen/components/TrendingCard/TrendingCard.styles.ts`
- `src/screens/TemplatesScreen/components/TrendingCard/AddButton.tsx`
- `src/screens/TemplatesScreen/components/PremiumPacksSection/PremiumPackCard.tsx`
- `src/screens/TemplatesScreen/components/PremiumPacksSection/PremiumPacksSection.tsx`
- `src/screens/TemplatesScreen/components/UsageBanner/UsageBanner.tsx`
- `src/screens/TemplatesScreen/views/CategoryDrillView.tsx`
- `src/screens/TemplatesScreen/views/SeeAllView.tsx`
- `src/screens/TemplatesScreen/components/QuickFilterChips/QuickFilterChips.tsx`
- `src/screens/TemplatesScreen/components/ScrollShadows.tsx`

### Wave 2
- `src/theme/index.ts` (docstring fix)
- `src/screens/TemplatesScreen/components/ExploreAllSection/CategoryGroupHeader.tsx`
- `src/screens/TemplatesScreen/components/ExploreAllSection/ExploreDivider.tsx`

### Wave 3
- `src/screens/TemplatesScreen/components/FeaturedCollection/FeaturedCollection.styles.ts`
- `src/screens/TemplatesScreen/components/ExploreAllSection/ExploreHabitRow.styles.ts`
- `src/screens/templates/styles/browseStyles.ts`
- `src/screens/templates/styles/categoryStyles.ts`

---

## Verification

1. **Dark mode toggle**: Switch app to dark mode, verify all TemplatesScreen sections render correctly — no light-mode backgrounds, text readable
2. **Visual scan**: Compare each section (Featured, Popular, Categories, Premium, Explore All) in both themes
3. **Lint check**: `npm run lint:max-lines` — no new violations
4. **Build**: `npx expo start` — no TypeScript errors
5. **Accessibility**: VoiceOver scan of main browse flow
