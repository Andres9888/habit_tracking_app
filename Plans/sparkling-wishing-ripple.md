# Plan: SortBottomSheet Visual Refresh

## Context

The SortBottomSheet uses hardcoded colors, ad-hoc typography, and manual shadow values instead of the app's established design tokens. Other bottom sheets (DayHabitsBottomSheet, QuickActionsSheet) already use the proper theme system. This refresh aligns the sort sheet with the rest of the app — no structural or behavioral changes.

## Files to Modify

1. `src/features/habits/components/SortBottomSheet/constants.ts`
2. `src/features/habits/components/SortBottomSheet/SortBottomSheet.tsx`
3. `src/features/habits/components/SortBottomSheet/SortOptionRow.tsx`
4. `src/features/habits/components/SortBottomSheet/QuickPickChips.tsx`

No changes to `useSortBottomSheet.ts` — updated constants flow through automatically.

---

## Step 1: `constants.ts`

| Current | Change |
|---|---|
| `SHEET_SPRING_CONFIG = springs.standard` | `springs.bottomSheet` (damping:26, stiffness:300 — proper bottom sheet spring) |
| `WHITE_ICON_COLOR = '#ffffff'` | Rename to `ICON_ON_GRADIENT_COLOR = '#FFFFFF'` (semantic: always white on gradient bg) |
| `DARK_SURFACE_COLOR = '#1f2937'` | **Delete** — consumers will use `themeColors.card` |
| `LIGHT_SURFACE_COLOR = '#f5f5f4'` | **Delete** — consumers will use `themeColors.card` |
| `BACKDROP_VISIBLE_OPACITY = 0.5` | Change to `0.4` (match other sheets) |
| `BACKDROP_FADE_IN_DURATION_MS = 200` | Change to `300` (match other sheets) |
| `BACKDROP_FADE_OUT_DURATION_MS = 150` | Change to `250` (match other sheets) |
| Icon gradient `['#78716c', '#57534e']` (cool gray) | `['#6B6560', '#524D47']` (warm stone `gray[500]`, `gray[600]`) |
| Icon gradient `['#34d399', '#14b8a6']` (teal) | `['#34D399', '#10B981']` (emerald `primary[400]`, `primary[500]`) |
| Icon gradient `['#ef4444', '#f97316']` (red/orange) | Keep — decorative flame metaphor, no matching token |

## Step 2: `SortBottomSheet.tsx`

| Current | Change |
|---|---|
| Manual close button (10 lines: Pressable + X icon + gray bg) | Replace with `<ModalCloseButton onClose={handleDismiss} />` (~1 line) |
| `backgroundColor: themeColors.card` | `backgroundColor: themeColors.surface` (match other sheets) |
| Manual shadow props (shadowColor, shadowOffset, shadowOpacity, shadowRadius) | `...shadows.modal` (from `@/theme/spacing`) |
| Title `className='text-[17px] font-bold'` | `style={[typography.button, { color: themeColors.text.primary }]}` (17px semibold DM Sans) |
| Drag handle bg `themeColors.gray[300]` | Keep — standard drag handle color across all sheets |
| Import `X`, `iconSizes`, `SCREEN`, `SHADOW_OPACITY` | Remove — no longer needed |
| Add imports | `ModalCloseButton`, `shadows` from spacing, `typography` |

## Step 3: `SortOptionRow.tsx`

| Current | Change |
|---|---|
| Selected bg: `isDark ? '#1f2937' : '#ecfdf5'` | `themeColors.status.successLight` (light: `#D1FAE5`, dark: `rgba(5,150,105,0.15)`) |
| `WHITE_ICON_COLOR` for icon + checkmark | `ICON_ON_GRADIENT_COLOR` (renamed constant) |
| Title `className='text-[15px] font-medium'` | `style={[typography.bodySmall, { color: themeColors.text.primary, fontWeight: '500' }]}` |
| Description `className='text-[13px] font-normal'` | `style={[typography.caption, { color: themeColors.text.secondary, fontWeight: '400' }]}` |
| Import `DARK_SURFACE_COLOR` | Remove |
| Add import | `typography` from `@/theme/typography` |

## Step 4: `QuickPickChips.tsx`

| Current | Change |
|---|---|
| Unselected bg: `isDark ? DARK_SURFACE_COLOR : LIGHT_SURFACE_COLOR` | `themeColors.card` (light: `#EDEAE5` warm stone, dark: `#1F2937`) |
| `WHITE_ICON_COLOR` for selected icon | `ICON_ON_GRADIENT_COLOR` |
| Selected text color: `WHITE_ICON_COLOR` | `'#FFFFFF'` (always white on primary green, even in dark mode) |
| Chip label `className='text-[13px] font-medium'` | `style={[typography.caption, { color: ... }]}` |
| Import `DARK_SURFACE_COLOR`, `LIGHT_SURFACE_COLOR`, `WHITE_ICON_COLOR` | Replace with `ICON_ON_GRADIENT_COLOR` |
| Add import | `typography` from `@/theme/typography` |

---

## What's NOT Changing

- Component structure and hierarchy (no rearchitecting)
- Gesture behavior and dismiss logic
- Sort options data (7 options, same labels/descriptions)
- Quick pick chip selection (4 chips)
- Accessibility labels and roles
- `useSortBottomSheet.ts` (constants flow through)
- Haptic feedback behavior

## Verification

1. Open the app, navigate to habits list, tap the sort chip to open the SortBottomSheet
2. Verify light mode: warm stone tones, proper shadows, typography looks crisp
3. Verify dark mode: proper dark surfaces, selected state has subtle green overlay
4. Test selecting each sort option — haptics fire, selected state highlights correctly
5. Test quick pick chips — selected chip is green with white text/icon
6. Test drag-to-dismiss gesture — sheet slides down smoothly with new spring config
7. Test close button — matches the style of other modals (surface bg, X icon)
8. Run `npx expo lint` to check for lint issues
