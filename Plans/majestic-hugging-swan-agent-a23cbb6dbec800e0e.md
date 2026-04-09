# Design Consistency Review: Habit Detail Screen

## Overview

This plan documents all design system deviations found in the Habit Detail Screen and its child components, organized into prioritized fix groups with explicit file-level instructions.

**Design System**: "Warm Minimal" — semantic tokens via `useThemeColors()`, 8px spacing grid, Literata/DM Sans/JetBrains Mono type scale, warm `#2D2A26`-based shadows.

**Core Principle**: Components should NEVER reference raw hex values. They should consume `SemanticColors` from the theme so that dark mode works automatically.

---

## Priority 1 — HIGH: HabitStrengthSection Hardcoded Colors (Dark Mode Broken)

**Impact**: The entire HabitStrengthSection renders with light-only colors. In dark mode, users see white card backgrounds on dark surfaces, unreadable text, and non-adapting status colors. This is a functional bug, not just a style deviation.

**Root Cause**: `src/components/HabitStrengthSection/constants.ts` exports two static objects — `COLORS` and `STRENGTH_COLORS` — containing ~20 raw hex values that never change based on theme.

### Files Affected (7 files consume these constants)

| File | Usage |
|------|-------|
| `src/components/HabitStrengthSection/constants.ts` | Defines `COLORS` (lines 85-119) and `STRENGTH_COLORS` (lines 40-82) |
| `src/components/HabitStrengthSection/HabitStrengthSection.tsx` | `COLORS.textPrimary` as `shadowColor` (line 78) |
| `src/components/HabitStrengthSection/StrengthStatsRow.tsx` | `COLORS.positive`, `COLORS.textPrimary`, `COLORS.border` (lines 57, 71) |
| `src/components/HabitStrengthSection/StrengthHero/StatusDisplay.tsx` | `COLORS.positive`, `COLORS.negative`, `COLORS.textSecondary`, `STRENGTH_COLORS[label].primary`, `STRENGTH_COLORS[label].background` (lines 55-64, 27, 43-47) |
| `src/components/HabitStrengthSection/StrengthHero/StrengthHero.tsx` | `STRENGTH_COLORS[label].primary` (line 43) |
| `src/components/HabitStrengthSection/StrengthHero/ProgressRing.tsx` | `COLORS.ringTrack` (line 60) |
| `src/components/HabitStrengthSection/StrengthChart/ChartGrid.tsx` | `COLORS.gridLine` (line 34) |
| `src/components/HabitStrengthSection/StrengthChart/StrengthChart.tsx` | `STRENGTH_COLORS[label].primary` (line 41) |

### Recommended Fix

**Approach**: Follow the existing codebase pattern from `CalendarTimeline.styles.ts` which exports a `getColors(highContrastMode, isDark)` function, and `ErrorFallback.styles.ts` which uses `createErrorFallbackStyles(colors: SemanticColors)`.

**Step 1**: Convert `COLORS` to a function `getStrengthColors(colors: SemanticColors)` in `constants.ts`:

```
COLORS.cardBackground -> colors.card
COLORS.textPrimary    -> colors.text.primary
COLORS.textSecondary  -> colors.text.secondary
COLORS.textMuted      -> colors.text.tertiary
COLORS.border         -> colors.border
COLORS.gridLine       -> colors.gray[300]
COLORS.ringTrack      -> colors.gray[50]
COLORS.positive       -> colors.status.successText
COLORS.negative       -> colors.status.errorText
```

**Step 2**: Convert `STRENGTH_COLORS` to a function `getStrengthLevelColors(colors: SemanticColors)`:

```
developing.primary     -> colors.status.warning (light) / colors.status.warningText (dark)
developing.background  -> colors.status.warningLight
strong.primary         -> colors.status.success (light) / colors.status.successText (dark)
strong.background      -> colors.status.successLight
weak.primary           -> colors.status.error (light) / colors.status.errorText (dark)
weak.background        -> colors.status.errorLight
gradient values        -> derive from the resolved primary with rgba alpha
```

**Step 3**: Update all 7 consuming files to call these functions with `colors` from `useThemeColors()`, passing the result into child components via props or calling the function at render time.

**Step 4**: In `HabitStrengthSection.tsx` line 78-79, replace `shadowColor: COLORS.textPrimary, shadowOpacity: 0.05` with `shadows.card` from the spacing module (which already uses `#2D2A26` as shadowColor with `shadowOpacity: 0.06`).

### Additional Sub-Issue: Tailwind className for Typography (MEDIUM)

In `HabitStrengthSection.tsx`:
- Line 58: `className='mb-2 text-lg font-bold'` — the `text-lg font-bold` portion should use `typography.heading3` (20px DM Sans semibold) via `style` prop instead. Keep layout classes (`mb-2`) in className.
- Line 84: `className='text-lg font-bold'` — same fix.
- Line 63: `className='text-center'` — acceptable for layout, no change needed.

In `StatusDisplay.tsx`:
- Line 46: `className='text-sm font-semibold'` — should use `typography.bodySmall` with `fontWeight: fontWeights.semibold` via style.
- Line 55/59: `className='text-sm'` — should use `typography.bodySmall` via style.

In `StrengthStatsRow.tsx`:
- Line 53: `className='text-[10px]'` — should use `typography.tabBar` (10px, medium weight).
- Line 55: `className='text-sm font-semibold'` — should use `typography.bodySmall` with `fontWeight: fontWeights.semibold`.

In `XAxisLabels.tsx`:
- Line 35: `className='text-xs'` — should use `typography.tabBar` or `typography.caption` via style.

---

## Priority 2 — MEDIUM: Hardcoded Surface Color in DetailViewTabs

**File**: `src/screens/HabitDetailScreen/components/DetailViewTabs.tsx`, line 63

**Issue**: 
```typescript
const indicatorBg = isDark ? colors.card : '#FFFFFF';
```

`#FFFFFF` is pure white, which does not exist in the warm-minimal light palette. The light mode card color is `#EDEAE5`, surface is `#EDEAE5`, and background is `#F5F1ED`. The lightest warm tone is `gray[50]` = `#FAF8F5`.

**Fix**: Replace with `colors.card` for both branches (since the indicator sits on the tab bar surface and should look "elevated"), or use `colors.gray[50]` if a lighter contrast is desired:
```typescript
const indicatorBg = colors.card;
```

This is a one-line change in a single file.

---

## Priority 3 — LOW-MEDIUM: Inline rgba Values (2 Files)

### 3a. DetailViewTabButton.tsx (line 36)

**File**: `src/screens/HabitDetailScreen/components/DetailViewTabButton.tsx`

```typescript
const hintBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
```

**Fix Options**:
1. **Preferred**: Add a `subtle` or `overlay` semantic token to `SemanticColors` (e.g., `colors.overlay.subtle`) if this pattern recurs. Grep shows this same dark/light rgba pattern appears in HeaderButton too.
2. **Pragmatic**: Extract to a shared constant file, e.g., `src/theme/overlays.ts` with `overlaySubtle(isDark)` helper, or add to the existing `ui-values.ts` constants.
3. **Minimal**: Leave as-is but add a comment referencing the design system intent. This is the lowest-effort option.

### 3b. HeaderButton.tsx (lines 53-55)

**File**: `src/screens/HabitDetailScreen/components/HeaderButton.tsx`

```typescript
backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
```

**Fix**: Same approach as 3a. These could share a common `overlayBackground` / `overlayBorder` helper. If extracting to a shared module, both files benefit from one change.

---

## Priority 4 — LOW: Minor Token Deviations (3 Files)

### 4a. QuickStatsRow.tsx — Non-Token Font Sizes and Gaps

**File**: `src/screens/HabitDetailScreen/components/QuickStatsRow.tsx`

| Line | Current | Design System Token | Notes |
|------|---------|-------------------|-------|
| 81 | `gap: 2` | `spacing.xs` (4) or leave at 2 | 2 is not on the 4px grid; evaluate visual impact of 4 |
| 84 | `fontSize: 18` | None exact; 17 (`body`) or 20 (`heading3`) | Emoji sizing; 18 is between tokens but cosmetic |
| 90 | `marginBottom: 2` | Nearest: `spacing.xs` (4) | Same 2px issue; evaluate visual impact |
| 93-96 | `fontSize: 11, fontWeight: medium` | `typography.tabBar` (10px) or `typography.caption` (13px) | 11px is between tokens; closest is tabBar at 10 |

**Recommendation**: 
- Change `gap: 2` and `marginBottom: 2` to either `0` or `spacing.xs` (4). Test visually — 4px may be better for the 8px grid.
- Change `fontSize: 11` to `typography.tabBar` (10px) or `typography.caption` (13px). The label "streak" / "best streak" / "completions" at 10px may be too small; 13px (`caption`) is likely the better choice.
- Keep `fontSize: 18` for the emoji as emoji rendering is platform-specific and this is cosmetic.

### 4b. DetailHero.tsx — marginTop Magic Number

**File**: `src/screens/HabitDetailScreen/components/DetailHero.tsx`, line 78

```typescript
style={{ ...typography.caption, marginTop: 4, color: colors.text.secondary }}
```

**Fix**: Replace `marginTop: 4` with `marginTop: spacing.xs`. The value is identical (4px) but references the token for consistency. One-line change; import `spacing` from `@/theme/spacing`.

### 4c. DetailHeader.constants.ts — Custom Shadow

**File**: `src/screens/HabitDetailScreen/components/DetailHeader.constants.ts`, lines 7-13

```typescript
export const iconShadow = {
  elevation: 6,
  shadowColor: '#2D2A26',
  shadowOffset: { height: 6, width: 0 },
  shadowOpacity: 0.15,
  shadowRadius: 16,
};
```

This is close to `shadows.floatingActionButton` (elevation 6, offset 4, opacity 0.08, radius 16) but uses a higher offset (6 vs 4) and higher opacity (0.15 vs 0.08). The `buttonShadow` in the same file correctly uses `shadows.floatingActionButton`.

**Fix Options**:
1. **Replace** with `shadows.floatingActionButton` — slight visual change (less prominent shadow).
2. **Add** a new `shadows.icon` preset to `spacing.ts` if the stronger shadow is intentional for large icon containers.
3. **Accept** as intentional — the icon shadow on the hero is meant to be more prominent. Add a comment explaining the deviation.

**Recommendation**: Option 3 (accept with comment) unless design review dictates otherwise, since this shadow is used on a single large element (the 80x80 habit icon).

---

## Priority 5 — LOW: Modal Presentation Inconsistency

**File**: `src/screens/HabitDetailScreen/HabitDetailScreen.tsx`, line 63-68

```typescript
<Modal
  accessibilityViewIsModal
  transparent
  animationType='slide'
  visible={visible}
  onRequestClose={onClose}
>
```

Missing `presentationStyle='overFullScreen'` and `statusBarTranslucent` that other modals (SettingsModal, TemplatesModal, HabitEditScreen, etc.) consistently use.

**Fix**: Add both props to match the established pattern:
```typescript
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

This ensures consistent rendering on Android (status bar overlap) and iOS (presentation style).

---

## Priority 6 — INFO: Unused SectionLabel Component

**File**: `src/screens/HabitDetailScreen/components/SectionLabel.tsx`

This component exists in the directory but is NOT exported from the barrel file (`components/index.ts`) and is not imported by any file within the HabitDetailScreen. The component itself is well-written and follows design tokens correctly (`typography.caption`, `fontWeights.semibold`).

**Recommendation**: No action needed unless the component is planned for future use. If not, consider removing it to reduce dead code. Note: a different `SectionLabel` exists at `src/screens/HabitEditScreen/SectionLabel.tsx` which IS in active use.

---

## Implementation Sequence

| Phase | Priority | Effort | Files Changed | Description |
|-------|----------|--------|---------------|-------------|
| 1 | HIGH | ~2hr | 8 files | Convert HabitStrengthSection to theme-aware colors |
| 2 | MEDIUM | ~10min | 1 file | Fix `#FFFFFF` in DetailViewTabs |
| 3 | LOW-MED | ~30min | 2-3 files | Extract rgba overlay helpers for tab button + header button |
| 4 | LOW | ~20min | 3 files | Token-align font sizes, gaps, marginTop |
| 5 | LOW | ~5min | 1 file | Add modal presentation props |
| 6 | INFO | ~2min | 1 file | Optionally remove unused SectionLabel |

**Total estimated effort**: ~3 hours

### Testing Strategy

After each phase:
1. Toggle between light and dark mode on both iOS and Android simulators
2. Verify HabitStrengthSection renders correctly with all three strength levels (weak, developing, strong)
3. Verify chart grid lines, progress ring track, and stats row are visible in both modes
4. Verify tab indicator and header button backgrounds blend with their parent surfaces
5. Run existing component tests (if any) to ensure no regressions

---

## Key Files Reference

- **Theme definitions**: `src/theme/darkColors.ts` (light + dark semantic palettes)
- **Typography tokens**: `src/theme/typography.ts`
- **Spacing/shadow tokens**: `src/theme/spacing.ts`
- **Animation tokens**: `src/theme/animations.ts`
- **Icon size tokens**: `src/theme/iconSizes.ts`
- **Theme hook**: `src/theme/ThemeContext.tsx` → `useThemeColors()`
- **Existing pattern for theme-aware constants**: `src/components/CalendarTimeline/CalendarTimeline.styles.ts` → `getColors()`
