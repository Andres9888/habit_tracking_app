# Design Consistency Review: Habit Detail Screen

## Context

The Habit Detail Screen was recently redesigned (PR #1218, #1233) with design token alignment. This review audits all components in the HabitDetailScreen tree against the "Warm Minimal" design system tokens to surface remaining inconsistencies. The goal is to ensure dark mode correctness, token compliance, and visual consistency with the rest of the app (Settings, Dashboard).

---

## Findings

### P1 (HIGH) -- HabitStrengthSection: Hardcoded Colors Break Dark Mode

**Files:**
- `src/components/HabitStrengthSection/constants.ts` (lines 40-119)
- `src/components/HabitStrengthSection/HabitStrengthSection.tsx` (lines 58, 63, 79, 84)

**Issue:** The `COLORS` object contains ~10 hardcoded hex values (`#ffffff`, `#1c1917`, `#78716c`, `#a8a29e`, `#e7e5e4`, `#d6d3d1`, `#f5f5f4`, `#15793C`, `#ef4444`) that never adapt to dark mode. These stone-based grays don't match the app's warm palette either (e.g., `textPrimary` is `#1c1917` stone vs design system `#2D2A26` warm brown).

The `STRENGTH_COLORS` record has 3 strength levels with raw hex backgrounds (`#fffbeb`, `#ecfdf5`, `#fef2f2`) that will appear as bright white patches in dark mode.

Additionally, `HabitStrengthSection.tsx` uses Tailwind className for typography (`text-lg font-bold`) at lines 58 and 84 instead of `typography.heading3` style objects, which bypasses the DM Sans font family.

**Fix:** Convert `COLORS` and `STRENGTH_COLORS` from static objects to functions that accept the theme's `SemanticColors` (following the existing pattern in `SettingsModal/colors.ts` which exports `getSettingsColors()`). Map each value to its semantic equivalent:

| Hardcoded | Semantic Token |
|-----------|---------------|
| `cardBackground: '#ffffff'` | `colors.card` |
| `textPrimary: '#1c1917'` | `colors.text.primary` |
| `textSecondary: '#78716c'` | `colors.text.secondary` |
| `textMuted: '#a8a29e'` | `colors.text.tertiary` |
| `border: '#e7e5e4'` | `colors.border` |
| `gridLine: '#d6d3d1'` | `colors.gray[300]` |
| `ringTrack: '#f5f5f4'` | `colors.gray[50]` |
| `positive: '#15793C'` | `colors.status.successText` |
| `negative: '#ef4444'` | `colors.status.error` |

For `STRENGTH_COLORS`, add dark mode variants for each background color (use semantic `rgba` patterns from `darkColors.status.*Light`).

Replace `className='text-lg font-bold'` with `style={typography.heading3}` (2 occurrences).

---

### P2 (MEDIUM) -- DetailViewTabs: Pure White Indicator

**File:** `src/screens/HabitDetailScreen/components/DetailViewTabs.tsx` (line 63)

**Issue:**
```ts
const indicatorBg = isDark ? colors.card : '#FFFFFF';
```
`#FFFFFF` is not part of the warm-minimal palette. The lightest surface is `#FAF8F5` (gray-50). This creates a harsh white pill against the warm parchment background.

**Fix:** Change to `colors.card` for both modes (the dark branch already does this), or use `colors.gray[50]` for a warmer light-mode match:
```ts
const indicatorBg = isDark ? colors.card : colors.gray[50];
```

---

### P3 (LOW-MEDIUM) -- Inline rgba in DetailViewTabButton & HeaderButton

**Files:**
- `src/screens/HabitDetailScreen/components/DetailViewTabButton.tsx` (line 36)
- `src/screens/HabitDetailScreen/components/HeaderButton.tsx` (lines 53-55)

**Issue:** Both files use inline `isDark ? 'rgba(255,255,255,X)' : 'rgba(0,0,0,X)'` patterns for overlay/glass effects. While functionally correct, they're ad-hoc and not reusable.

**Fix:** Extract to a shared utility or add `overlay` tokens to the semantic color system. Or at minimum, extract to named constants within each file. This is low-urgency since the pattern works correctly in both modes.

---

### P4 (LOW) -- QuickStatsRow: Minor Token Deviations

**File:** `src/screens/HabitDetailScreen/components/QuickStatsRow.tsx`

**Issue:** Several small values don't reference tokens:
- `gap: 2` (line 81) — below `spacing.xs` (4px); should be `spacing.xs` or intentional
- `fontSize: 11` (line 93) — between `tabBar` (10) and `caption` (13); not in the type scale
- `fontSize: 18` (line 84) — emoji size, between `monospace` (16) and `heading3` (20); not in type scale
- `marginBottom: 2` (line 92) — below `spacing.xs` (4px)

**Fix:** Align to nearest tokens: `fontSize: 11` -> either `typography.tabBar` (10) or `typography.caption` (13), `gap: 2` -> `spacing.xs`. The emoji fontSize (18) is acceptable as a visual-size override for emoji rendering.

---

### P5 (LOW) -- Modal Presentation Props Inconsistency

**File:** `src/screens/HabitDetailScreen/HabitDetailScreen.tsx` (line 63)

**Issue:** The `<Modal>` is missing `presentationStyle='overFullScreen'` and `statusBarTranslucent` that SettingsModal and other modals use. This can cause different rendering behavior on Android (status bar overlap).

**Fix:** Add both props to match other modals:
```tsx
<Modal
  accessibilityViewIsModal
  transparent
  animationType='slide'
  presentationStyle='overFullScreen'
  statusBarTranslucent
  visible={visible}
  onRequestClose={onClose}
>
```

---

### P6 (LOW) -- DetailHero: Magic Number marginTop

**File:** `src/screens/HabitDetailScreen/components/DetailHero.tsx` (line 78)

**Issue:** `marginTop: 4` is used inline. While it equals `spacing.xs`, it doesn't reference the token.

**Fix:** Change to `marginTop: spacing.xs` (import `spacing` from theme).

---

### P7 (LOW) -- DetailHeader.constants: Custom iconShadow

**File:** `src/screens/HabitDetailScreen/components/DetailHeader.constants.ts` (lines 8-13)

**Issue:** `iconShadow` defines `shadowOpacity: 0.15` and `shadowOffset.height: 6` which don't match any standard shadow preset. The closest is `shadows.floatingActionButton` (opacity 0.08, height 4).

**Fix:** Consider using `shadows.floatingActionButton` with an accent `shadowColor` override, or document this as an intentional decorative shadow for the hero icon. Low priority since it's a single visual element.

---

### P8 (INFO) -- Unused SectionLabel Export

**File:** `src/screens/HabitDetailScreen/components/SectionLabel.tsx`

**Issue:** Exported from the barrel `index.ts` but never imported within HabitDetailScreen. A separate `SectionLabel` exists in HabitEditScreen.

**Fix:** Remove from barrel export if unused. Keep the file if it may be needed for future detail views.

---

## Implementation Order

1. **P1** -- HabitStrengthSection color tokenization (biggest impact, dark mode correctness)
2. **P2** -- DetailViewTabs `#FFFFFF` fix (one-line change)
3. **P5** -- Modal props alignment (two-line change)
4. **P4** -- QuickStatsRow token alignment
5. **P6** -- DetailHero marginTop token
6. **P3** -- Inline rgba extraction (optional, design debt)
7. **P7** -- iconShadow review (optional)
8. **P8** -- SectionLabel cleanup (optional)

## Verification

After each fix:
1. Run `npx expo start` and visually check HabitDetailScreen in both light and dark mode
2. Verify HabitStrengthSection renders correctly in dark mode (the main regression risk)
3. Run `npm run lint` to check for any new violations
4. Run existing tests: `npx jest --testPathPattern=HabitDetail`
