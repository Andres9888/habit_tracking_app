# Design Consistency Audit & Remediation Plan

## Context

The app has a mature, well-documented design token system in `src/theme/` with centralized spacing, colors, typography, animations, and border radii. Overall token compliance is ~90%+. However, a review reveals scattered hardcoded values, missing premium/indigo tokens, animation library inconsistencies, and ad-hoc component styling that deviates from the system. This plan addresses these gaps to bring the codebase to full design-system compliance.

---

## 1. Color Token Gaps (High Priority)

### Problem: Premium/indigo colors not in design system
4+ files use hardcoded indigo/violet/purple values that don't exist in `src/theme/colors/core.ts`.

| File | Hardcoded Values |
|------|-----------------|
| `src/features/habits/components/HabitsList/MonetizationHero/MonetizationHero.tsx:11-14` | `#a5b4fc`, `#cbd5f5`, `#6d28d9`, `#312e81` |
| `src/features/habits/components/HabitsList/UpgradePrompt.tsx` | `#7c3aed`, `#4f46e5` gradient |
| `src/features/habits/components/SelectAllRow.tsx:49` | `#a855f7` (purple count badge) |

**Fix:** Add `indigo` scale to `colors` in `core.ts`:
```ts
indigo: {
  200: '#cbd5f5',
  300: '#a5b4fc',
  600: '#4f46e5',
  700: '#6d28d9',
  900: '#312e81',
}
```
Then replace all hardcoded values with `colors.indigo[*]` or `colors.premium[*]` imports.

### Problem: Hardcoded error red outside token system
| File | Value | Should Be |
|------|-------|-----------|
| `BatchDeleteConfirmModal.tsx:30,59,64` | `#ef4444`, `rgba(239,68,68,0.12)` | `colors.error` (`#B53030`) + opacity helper |

**Fix:** Replace `#ef4444` with `colors.error` from theme. Create a `withOpacity` helper or use the existing `hexToRgba` pattern for the background tint.

### Problem: Isolated color file in BinaryHeatmap
`src/components/BinaryHeatmap/MonthlyCalendarGrid/colors.ts:7-18` defines its own palette (`BORDER`, `CARD_BG`, `GREEN_COMPLETED`, etc.) that duplicates theme values.

**Fix:** Replace with imports from `@/theme/colors`:
- `COLORS.BORDER` -> `colors.gray[200]` (`#DDD8D2` vs `#e7e5e4` - close but not matching, normalize)
- `COLORS.GREEN_COMPLETED` -> `colors.primary[700]`
- `COLORS.GREEN_COMPLETED_LIGHT` -> `colors.primary[600]`
- `COLORS.GREEN_EMPTY` -> `colors.primary[100]`
- Text colors -> `colors.text.*` or `colors.gray.*`

### Problem: SVG icon hardcoded colors
`src/features/habits/components/HabitsEmptyStateMinimal/SeedlingIcon.tsx:14-17` defines `LEAF_HIGHLIGHT`, `STEM_COLOR`, `SOIL_COLOR` as raw hex.

**Fix:** Map to `colors.primary[400]`, `colors.primary[600]`, `colors.gray[400]`, `colors.gray[500]`.

### Problem: AppProviders fallback screens
`src/app/AppProviders.tsx:41-116` uses hardcoded dark colors for error/loading fallbacks.

**Fix:** Import `colors.dark.*` from theme for these fallback screens.

---

## 2. Animation Consistency (High Priority)

### Problem: FAB uses legacy `Animated` API
`src/features/habits/components/FloatingActionButton/useFABAnimations.ts:2` imports from `react-native` (legacy Animated) while the rest of the app uses `react-native-reanimated`.

**Fix:** Migrate to `react-native-reanimated` using `useSharedValue`, `withTiming`, and `withSpring`. Reference `Springs.standard` and `durations.*` from theme.

### Problem: Hardcoded animation durations instead of constants
| File | Value | Should Be |
|------|-------|-----------|
| `SelectAllRow.tsx:28` | `FadeInDown.duration(200)` | `durations.enter` (280) or `durations.standard` (200) |
| `SelectAllRow.tsx:28` | `FadeOutUp.duration(150)` | `durations.quick` (150) - correct value but hardcoded |
| `SelectionActionBar.tsx:11` | `.duration(280).springify().damping(18)` | `durations.enter` + `springs.standard` |
| `MonetizationHero animations` | 420, 720, 960ms | `ANIMATION_DURATION.*` from `ui-values.ts` |

**Fix:** Replace all inline duration/damping values with imports from `@/theme/animations` or `@/constants/ui-values`.

### Problem: Inconsistent enter animation duration
`SelectAllRow` uses 200ms while `SelectionActionBar` and `HabitsApp` use 280ms for the same FadeIn pattern. Per the spec, entry motion should be 280ms.

**Fix:** Standardize on `durations.enter` (280ms) for all component entry animations.

### Problem: Spring configs hardcoded inline
`SelectionActionBar.tsx:11` and `HabitsApp.tsx` use `.springify().damping(18)` inline instead of referencing `Springs.standard`.

**Fix:** Create a shared `ENTERING` constant or use `Springs.standard` values.

### Problem: `Motion.duration.emphasized` (220ms) and `exit` (220ms) in motion.ts are not from theme
`src/constants/motion.ts:18,20` has `emphasized: 220` and `exit: 220` as hardcoded values not referencing any theme duration.

**Fix:** Either add 220ms to `durations` in theme, or map to the closest existing value (`durations.standard` 200ms or `durations.enter` 280ms).

---

## 3. Border Radius Inconsistencies (Medium Priority)

| File | Value | Nearest Token |
|------|-------|--------------|
| `BatchDeleteConfirmModal.tsx:55` | `borderRadius: 20` | `borderRadius.large` (16) or `borderRadius.xl` (24) |
| `SelectionActionBar.tsx:12` | `CAPSULE_RADIUS = 32` | Not in system - add or use `borderRadius.full` |
| `SelectionActionBar.tsx:80` | `borderRadius: 22` | Not in system - should be `borderRadius.xl` (24) |
| `TemplateAddedToast/styles.ts` | 14px, 10px, 50px, 60px | Non-standard values |
| `FullsizeTemplatePreview/layout.styles.ts` | 20px | `borderRadius.large` (16) or `borderRadius.xl` (24) |
| `ModalCloseButton.tsx:50` | `borderRadius: 9999` | `borderRadius.full` (same value, use token) |

**Fix:** Normalize all to nearest token value. For the capsule/pill shape (`32`), use `borderRadius.full` (9999) since these are pill-shaped elements.

---

## 4. Typography Token Usage (Medium Priority)

Several components use inline `fontSize`/`fontWeight` instead of `typography.*` tokens:

| File | Inline Style | Should Be |
|------|-------------|-----------|
| `SelectAllRow.tsx:49` | `fontSize: 12, fontWeight: '600'` | `typography.caption` (13px) or new `overline` token |
| `SelectAllRow.tsx:50` | `fontSize: 14, fontWeight: '500'` | `typography.bodySmall` (14px) |
| `SelectionActionBar.tsx:82` | `fontSize: 13, fontWeight: '600'` | `typography.caption` |
| `BatchDeleteConfirmModal.tsx:57` | `fontSize: 14, fontWeight: '600'` | `typography.bodySmall` |
| `BatchDeleteConfirmModal.tsx:77` | `fontSize: 17, fontWeight: '700'` | `typography.body` + bold weight |
| `MonetizationHero.tsx` | Multiple `className` font sizes | Should use typography tokens |

**Fix:** Replace inline font definitions with `typography.*` token imports.

---

## 5. Shadow Overrides (Low Priority)

| File | Issue |
|------|-------|
| `MiniTemplateCard/styles/cardStyles.ts:29` | `shadowOpacity: 0.08` overrides `shadows.card` (0.06) |
| `FullsizeTemplatePreview/footer.styles.ts` | Custom `shadowOpacity: 0.15, 0.3, 0.6` |
| `SortBottomSheet.tsx` | Hardcoded `shadowColor: '#000000'` / `'#1c1917'` |

**Fix:** Use `shadows.*` presets from theme. If intentional deviation is needed, document with a comment referencing the token it deviates from.

---

## 6. Spacing Deviations (Low Priority)

| File | Value | Nearest Token |
|------|-------|--------------|
| `SelectAllRow.tsx:54` | `gap: 10` | `spacing.sm` (8) or `spacing.md` (12) |
| `BatchDeleteConfirmModal.tsx:55` | `padding: 28` | `spacing.lg` (24) or `spacing.xl` (32) |
| `FullsizeTemplatePreview/footer.styles.ts` | `20px` padding | `spacing.lg` (24) |
| `FullsizeTemplatePreview/science.styles.ts` | `14px` | `spacing.md` (12) or `spacing.base` (16) |

**Fix:** Round to nearest grid value from `spacing.*`.

---

## 7. Mixed Styling Approaches (Low Priority)

`MonetizationHero.tsx` mixes NativeWind `className` with inline `style` for colors, creating two sources of truth for the same element. Example: `className='text-[13px] font-medium'` + `style={{ color: PREMIUM_INDIGO_LIGHT }}`.

**Fix:** Prefer consistent approach per component. Since the app primarily uses inline styles with theme tokens, align MonetizationHero to that pattern.

---

## Implementation Order

1. **Add indigo/premium color tokens to `core.ts`** (unblocks 4+ files)
2. **Replace hardcoded colors** in MonetizationHero, SelectAllRow, BatchDeleteConfirmModal, BinaryHeatmap/colors.ts, SeedlingIcon, AppProviders
3. **Standardize animation entry durations** to `durations.enter` (280ms) across all entering animations
4. **Replace inline spring configs** with `Springs.standard` references
5. **Migrate FAB from legacy Animated** to react-native-reanimated
6. **Normalize border radius** values to token system
7. **Replace inline typography** with `typography.*` tokens
8. **Fix shadow overrides** to use `shadows.*` presets
9. **Normalize spacing** to grid values

---

## Files to Modify

### Theme (add tokens)
- `src/theme/colors/core.ts` - Add indigo scale

### High-priority fixes (hardcoded colors + animations)
- `src/features/habits/components/HabitsList/MonetizationHero/MonetizationHero.tsx`
- `src/features/habits/components/HabitsList/UpgradePrompt.tsx`
- `src/features/habits/components/SelectAllRow.tsx`
- `src/features/habits/components/BatchDeleteConfirmModal.tsx`
- `src/features/habits/components/SelectionActionBar/SelectionActionBar.tsx`
- `src/features/habits/components/FloatingActionButton/useFABAnimations.ts`
- `src/components/BinaryHeatmap/MonthlyCalendarGrid/colors.ts`
- `src/features/habits/components/HabitsEmptyStateMinimal/SeedlingIcon.tsx`
- `src/app/AppProviders.tsx`

### Medium-priority fixes (border radius + typography)
- `src/components/ui/ModalCloseButton.tsx`
- `src/components/TemplateAddedToast/styles.ts`
- `src/components/FullsizeTemplatePreview/styles/layout.styles.ts`
- `src/constants/motion.ts` (normalize 220ms values)

### Low-priority fixes (shadows + spacing)
- `src/components/MiniTemplateCard/styles/cardStyles.ts`
- `src/components/FullsizeTemplatePreview/styles/footer.styles.ts`
- `src/features/habits/components/SortBottomSheet/SortBottomSheet.tsx`

---

## Existing Utilities to Reuse
- `useThemeColors()` from `@/theme/ThemeContext` - for theme-aware colors
- `durations`, `springs`, `easings` from `@/theme/animations` - canonical animation tokens
- `Springs`, `Motion` from `@/constants/motion` - frozen spring presets
- `ANIMATION_DURATION`, `ANIMATION_VALUES` from `@/constants/ui-values` - UI animation constants
- `spacing`, `borderRadius`, `shadows` from `@/theme/spacing` - layout tokens
- `typography` from `@/theme/typography` - text style tokens
- `colors` from `@/theme/colors/core` - color palette
- `hexToRgba` from `BinaryHeatmap/colors.ts` (move to shared util)

---

## Verification

1. **Lint check**: `npm run lint` passes with no new warnings
2. **Type check**: `npx tsc --noEmit` passes
3. **Visual regression**: Run app on iOS simulator, verify:
   - MonetizationHero colors match current appearance
   - BatchDeleteConfirmModal error colors are consistent with error token
   - Selection mode animations feel identical (280ms entry)
   - FAB bounce animation still works after reanimated migration
   - BinaryHeatmap calendar colors unchanged
4. **Grep audit**: No remaining hardcoded hex colors outside theme files:
   ```bash
   grep -rn '#[0-9a-fA-F]\{6\}' src/ --include='*.tsx' --include='*.ts' | grep -v theme/ | grep -v constants/ | grep -v __tests__
   ```
5. **Animation consistency**: All entering animations use `durations.enter` (280ms), all springs reference `Springs.*`
