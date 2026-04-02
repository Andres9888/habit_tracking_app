# Design Consistency Review — Full Application

## Context

The app has a well-defined design system (`src/theme/`) with semantic color tokens, typography scales, spacing grid, shadow presets, and dark mode support. However, many components bypass these tokens with hardcoded hex values, raw font sizes, and inline shadows. This review identifies every inconsistency and fixes them to ensure the entire app uses the design system consistently.

## Scope

~224 hardcoded color occurrences across ~82 files. The fixes below focus on the **verified high-severity issues** — components using raw hex values instead of available theme tokens.

---

## Phase 1: Critical Dark Mode Breakage (P0)

### 1. `src/components/RewardCelebrationToast/RewardCelebrationToast.tsx`
**Issues:**
- Line 40: `bg-white` — hardcoded white background, broken in dark mode
- Line 41: `text-[#1c1917]` — hardcoded dark text color
- Line 50: `colors={['#faf5ff', '#eff6ff']}` — hardcoded gradient
- Line 54: `text-[#7c3aed]` — hardcoded premium purple
- Line 62: `border-[#d6d3d1]` — hardcoded border
- Line 76: `backgroundColor: '#7c3aed'` — hardcoded premium purple

**Fixes:**
- `bg-white` → `style={{ backgroundColor: themeColors.card }}`
- `text-[#1c1917]` → `style={{ color: themeColors.text.primary }}`
- Gradient colors → `isDark ? [themeColors.status.premiumLight, themeColors.card] : ['#faf5ff', '#eff6ff']`
- `#7c3aed` → `themeColors.status.premium`
- `border-[#d6d3d1]` → `style={{ borderColor: themeColors.border }}`

---

## Phase 2: Hardcoded Colors (P1)

### 2. `src/components/SettingsModal/ProfileCard.tsx`
**Issues:**
- Line 41: `backgroundColor: '#7c3aed'` — avatar bg should use `themeColors.status.premium`
- Line 42: `borderRadius: 26` — non-standard, should be `borderRadius.xl` (24)
- Line 31: `shadowColor: isDark ? '#000' : '#1c1917'` — should use theme shadow token
- Line 67: `backgroundColor: isDark ? '#3d2e06' : '#fef3c7'` — should use `themeColors.status.streakLight` / `themeColors.status.warningLight`
- Lines 69, 72: `color: isDark ? '#fbbf24' : '#92400e'` — should use `themeColors.status.streakText` / `themeColors.status.warningText`
- Line 20-21: High contrast colors `#111111`, `#2f2f2f` — should be constants or theme tokens

**Fixes:**
- `'#7c3aed'` → `themeColors.status.premium`
- `borderRadius: 26` → `borderRadius.xl` (24)
- Shadow → use `shadows.card` from spacing tokens
- PRO badge colors → use `themeColors.status.streak*` / `themeColors.status.warning*` tokens

### 3. `src/components/SettingsModal/sections/PremiumStatus.tsx`
**Issues:**
- Line 99: `isDark ? '#422006' : palette.warningLight` — should use `themeColors.status.streakLight`
- Lines 131-132: Gradient colors `['#2e1f5e', '#1e1b4b', '#312e81']` / `['#8b5cf6', '#6366f1', '#818cf8']` — should reference `palette.indigo` or `palette.premium` scales
- Line 182: `color: isDark ? '#E0E7FF' : palette.text.inverse` — should use `themeColors.text.inverse` or `palette.indigo[200]`
- Line 188: `isDark ? 'rgba(224,231,255,0.6)' : 'rgba(255,255,255,0.8)'` — opacity variants of text.inverse
- Line 202: `color: isDark ? '#C4B5FD' : palette.text.inverse` — should use `themeColors.status.premiumText`
- Line 27: `SHIMMER_DURATION = 3000` — matches `durations.celebration` but doesn't reference it
- Lines 62-63: `duration: 1000` — should use `durations.loop`

**Fixes:**
- Map gradient colors to `palette.indigo.*` and `palette.premium.*` scales
- Replace isDark ternaries with semantic tokens where available
- Replace raw durations with `durations.*` tokens

### 4. `src/components/NotificationBadge.tsx`
**Issues:**
- Line 64: `backgroundColor: '#ef4444'` — should use `themeColors.status.error`
- Line 39: `duration: 800` — should use `durations.progress` (800ms)
- Line 46: `duration: 200` — should use `durations.standard` (200ms)

**Fixes:**
- `'#ef4444'` → `themeColors.status.error`
- `800` → `durations.progress`
- `200` → `durations.standard`

### 5. `src/components/FullsizeTemplatePreview/components/SuccessGlowOverlay.tsx`
**Issues:**
- Line 20: `backgroundColor: '#22c55e'` — should use theme token

**Fix:**
- Import `useThemeColors` and use `themeColors.status.success` or `themeColors.accent`

### 6. `src/components/ProgressSectionConsolidated/InsightChips/InsightChip.tsx`
**Issues:**
- Line 37: Fallback `'#e7e5e4'` — should use `themeColors.border`
- Line 67: `borderColor: '#fb923c'` — hardcoded orange for pulse ring

**Fixes:**
- Fallback → `colors.border` (from `useThemeColors`)
- `'#fb923c'` → `themeColors.status.streak` or `themeColors.status.warning`

### 7. `src/components/ProgressSectionConsolidated/InsightChips/constants.ts`
**Issues:**
- Lines 17-22: `BORDER_COLOR_MAP` uses hardcoded hex values (`#fde68a`, `#a7f3d0`, `#fed7aa`, `#ddd6fe`)

**Fix:**
- This is a static map so it can't use hooks, but could reference `colors.*` from core.ts or accept colors as parameters

---

## Phase 3: Broader Sweep (P2)

After fixing the verified P0/P1 issues above, run a codebase-wide grep to find remaining hardcoded values:

```bash
# Find all hardcoded hex colors in component files (excluding theme/, test files, data files)
grep -rn "#[0-9a-fA-F]\{6\}" --include="*.tsx" src/ \
  | grep -v "theme/" | grep -v "__tests__" | grep -v ".test." \
  | grep -v "\.styles\." | grep -v "\.data\." | grep -v "constants"
```

Known areas needing attention from the automated scan:
- **CharacterScreen components** — ~8 raw fontSize values in CharacterCard
- **HabitEditScreen components** — ~16 raw values across sub-components
- **AnalyticsScreen/EmptyState** — 6 fontSize + 3 borderRadius violations
- **DraggableHabit components** — 7 files with issues
- **PremiumPaywall components** — 5 files

---

## Phase 4: Typography Token Adoption (P2)

Components using raw `fontSize` values instead of `typography.*` tokens. Pattern to fix:

```tsx
// Before
fontSize: 17
// After
fontSize: typography.body.fontSize

// Before (NativeWind)
className='text-[17px]'
// After
style={{ fontSize: typography.body.fontSize }}
// Or keep NativeWind if value matches the scale (17px = body, 13px = caption, etc.)
```

Key files: CharacterCard, StatCard, AchievementCard, AnalyticsScreen components.

---

## Verification

After each phase:

1. **Grep check** — confirm no hardcoded hex values remain in fixed files:
   ```bash
   grep -n "#[0-9a-fA-F]\{6\}" <fixed-file>
   ```

2. **TypeScript check** — ensure no type errors:
   ```bash
   npx tsc --noEmit
   ```

3. **Lint check** — ensure ESLint passes:
   ```bash
   npx eslint <fixed-files>
   ```

4. **Visual verification** — run on iOS simulator in both light and dark mode, check each fixed screen

5. **Specific screens to visually verify:**
   - Settings modal (ProfileCard, PremiumStatus)
   - Reward celebration toast (trigger a streak milestone)
   - Insight chips on progress section
   - Template preview success glow
   - Notification badge appearance

---

## Files to Modify

| File | Phase | Changes |
|------|-------|---------|
| `src/components/RewardCelebrationToast/RewardCelebrationToast.tsx` | P0 | Replace 6 hardcoded colors with theme tokens |
| `src/components/SettingsModal/ProfileCard.tsx` | P1 | Replace 5 hardcoded colors, fix borderRadius, fix shadow |
| `src/components/SettingsModal/sections/PremiumStatus.tsx` | P1 | Replace ~8 hardcoded colors, 2 raw durations |
| `src/components/NotificationBadge.tsx` | P1 | Replace 1 hardcoded color, 2 raw durations |
| `src/components/FullsizeTemplatePreview/components/SuccessGlowOverlay.tsx` | P1 | Replace 1 hardcoded color, add useThemeColors |
| `src/components/ProgressSectionConsolidated/InsightChips/InsightChip.tsx` | P1 | Replace 2 hardcoded colors |
| `src/components/ProgressSectionConsolidated/InsightChips/constants.ts` | P1 | Consider parameterizing color map |

## Key Theme Files (Reference Only — Do Not Modify)

- `src/theme/darkColors.ts` — SemanticColors interface, light/dark palettes
- `src/theme/colors/core.ts` — Static color scales
- `src/theme/spacing.ts` — borderRadius, shadows tokens
- `src/theme/typography.ts` — Font scales
- `src/theme/animations.ts` — Duration and spring tokens
