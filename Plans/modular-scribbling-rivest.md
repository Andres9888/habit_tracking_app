# Design Consistency Audit & Fix Plan

## Context

The app has a well-designed theme system (`src/theme/`) with spacing, typography, colors, border radius, and shadows — but implementation across screens is inconsistent. Many components use hardcoded values instead of theme tokens, and there's a mix of Tailwind `className` text sizing vs `typography.*` objects. This plan fixes the verified inconsistencies to bring all screens into alignment with the design system.

---

## Findings Summary

| Category | Count | Severity |
|---|---|---|
| Hardcoded colors (non-theme hex) | ~15 production files | Medium |
| Hardcoded font sizes (bypassing typography) | ~10 files | High |
| Off-grid spacing values | ~5 files | Medium |
| Hardcoded shadows (bypassing `shadows.*`) | 1 file | Medium |
| Hardcoded border radius (bypassing `borderRadius.*`) | 2 files | Low |

---

## Fixes (grouped by file)

### 1. `src/screens/auth/components/AuthError/AuthError.tsx`
**Hardcoded shadow** — lines 23-26 use inline `shadowColor: '#1c1917'` etc. instead of theme shadow.
- **Fix:** Replace inline shadow with `...shadows.floatingActionButton` (closest match: offset 4, opacity 0.08, radius 16). Import `shadows` from `@/theme/spacing`.

### 2. `src/components/SettingsModal/ProfileCard.tsx`
**Multiple issues:**
- Line 23: Hardcoded `'#111111'` / `'#000000'` for high-contrast card bg
  - **Fix:** Use `themeColors.gray[900]` (dark) / `themeColors.text.primary` (light) for high contrast — these are the darkest theme tokens
- Line 38: `gap: 14` is off the spacing grid (should be 12 or 16)
  - **Fix:** Change to `gap: spacing.md` (12) — tighter is better for avatar+text
- Line 69: `text-[18px] font-bold` — no typography match
  - **Fix:** Apply `typography.heading3` (20px semibold DM Sans) via style prop — closest named size for a user name. Or keep 18px if intentional, but use a style object referencing `fontFamilies.primary.text`.
  - **Recommendation:** Use heading3 for consistency
- Line 76: `text-[13px]` matches `typography.caption` — apply via style prop
- Line 89: `text-[11px] font-bold` — no exact match (smallest is caption at 13px). This is the "PRO" badge — keep as-is since badges can be smaller than the type scale.

### 3. `src/screens/HabitEditScreen/NameInputSection.tsx`
- Line 28: `marginBottom: 40` — not on the spacing grid (nearest: `spacing.xl` = 32 or `spacing['2xl']` = 48)
  - **Fix:** Change to `spacing['2xl']` (48) — this is a hero section separator, larger gap is appropriate
- Line 36: `text-[22px] font-bold` — matches `typography.heading1` (22px Literata bold) or `typography.heading2` (22px DM Sans semibold)
  - **Fix:** Apply `typography.heading2` via style prop (it's a screen section title, DM Sans is correct here)
- Line 47: `text-[22px] font-medium` on TextInput — keep as inline since TextInput styling doesn't compose well with typography objects
- Line 53: `backgroundColor: '#FFFFFF'` hardcoded for light mode input
  - **Fix:** Use `colors.light.surfaceMuted` (`#FAF8F5`) or create a white alias. Since the design uses warm tones, `'#FFFFFF'` stands out. Use `themeColors.card` or a conditional `isDark ? colors.card : '#FFFFFF'` is acceptable for inputs.
  - **Recommendation:** Keep `'#FFFFFF'` — pure white input fields are standard UX and intentional contrast
- Line 59: `'#a1a1aa'` hardcoded placeholder color
  - **Fix:** Use `themeColors.text.tertiary` for placeholder — already available and theme-aware
- Line 67: `text-[13px]` matches `typography.caption` — apply via style prop

### 4. `src/screens/HabitEditScreen/CustomizeSection.tsx`
- Lines 48, 64: `text-[13px] font-semibold uppercase` with `letterSpacing: 0.5`
  - **Fix:** Apply `typography.caption` via style prop + keep uppercase/letterSpacing overrides. Caption is 13px medium — bumping to semibold for labels is fine as an override.

### 5. `src/screens/HabitEditScreen/SectionLabel.tsx`
- Line 18: `'#F87171'` hardcoded for danger variant color
  - **Fix:** Use `themeColors.status.error` or `colors.error` (`#B53030`) — the current red-400 (`#F87171`) is too light for the warm palette. Or if intentional for the separator label, use `themeColors.status.errorLight` for consistency.
  - **Recommendation:** Use `themeColors.status.error` for danger text
- Line 19: `'#DDD8D2'` hardcoded for light mode border
  - **Fix:** Use `themeColors.border` — it already resolves correctly per theme. Remove the conditional.

### 6. `src/screens/HabitEditScreen/HabitEditScreen.tsx`
- Line 165: `borderRadius: 4` hardcoded for drag handle
  - **Fix:** Use `borderRadius.xs` (4px) — same value but references the token

### 7. `src/components/CreateHabitModal/CreateHabitModalCentered.tsx`
- Line 110: `borderRadius: 4` hardcoded for drag handle (same as above)
  - **Fix:** Use `borderRadius.xs` — import from `@/theme/spacing`

### 8. `src/features/habits/components/HabitsModals/HapticTestModalSection.tsx`
- Line 21: `backgroundColor: '#111827'` hardcoded
  - **Fix:** Use `colors.dark.background` from `@/theme/colors/core` — this is a dev-only screen but should still reference theme tokens
- Line 28: `color: '#ffffff'` hardcoded
  - **Fix:** Use `colors.text.inverse`

### 9. `src/components/SettingsModal/sections/SignOutCard.tsx`
- Line 20: `'#111111'` hardcoded for high-contrast card bg
  - **Fix:** Same as ProfileCard — use `themeColors.gray[900]`
- Line 22: `'#2f2f2f'` hardcoded for high-contrast border
  - **Fix:** Use `themeColors.gray[700]` — closest dark border token

### 10. `src/components/HabitCard/components/SwipeGripLines.tsx`
- Lines 51-52: `paddingHorizontal: 6`, `paddingVertical: 16`
  - `paddingVertical: 16` = `spacing.base` (correct)
  - `paddingHorizontal: 6` — off-grid (nearest: `spacing.xs` = 4 or `spacing.sm` = 8)
  - **Fix:** Change to `spacing.sm` (8) — slightly more padding is fine for grip affordance

### 11. `src/components/TemplateCard/components/TemplateCardContent.tsx`
- Line 92: `color: '#4b5563'` hardcoded description text
  - **Fix:** Use `colors.text.secondary` (`#6B6560`)
- Line 95: `color: '#1c1917'` hardcoded name text
  - **Fix:** Use `colors.text.primary` (`#2D2A26`)

### 12. `src/components/CreateHabitModal/components/EnhancedReminderSelector/PermissionBanner.tsx`
- Line 27: `backgroundColor: '#FEF3C7'` hardcoded warning bg
  - **Fix:** Use `colors.warningLight` (`#FEF3CD`) — nearly identical
- Lines 32, 35: `color: '#92400E'`, `color: '#A16207'` hardcoded warning text
  - **Fix:** Use `colors.warning` (`#9A5504`) for both

---

## Files to modify (in order)

1. `src/screens/auth/components/AuthError/AuthError.tsx`
2. `src/components/SettingsModal/ProfileCard.tsx`
3. `src/screens/HabitEditScreen/NameInputSection.tsx`
4. `src/screens/HabitEditScreen/CustomizeSection.tsx`
5. `src/screens/HabitEditScreen/SectionLabel.tsx`
6. `src/screens/HabitEditScreen/HabitEditScreen.tsx`
7. `src/components/CreateHabitModal/CreateHabitModalCentered.tsx`
8. `src/features/habits/components/HabitsModals/HapticTestModalSection.tsx`
9. `src/components/SettingsModal/sections/SignOutCard.tsx`
10. `src/components/HabitCard/components/SwipeGripLines.tsx`
11. `src/components/TemplateCard/components/TemplateCardContent.tsx`
12. `src/components/CreateHabitModal/components/EnhancedReminderSelector/PermissionBanner.tsx`

## Out of scope (intentional / data files / tests)

- `SuggestionChips.tsx` hardcoded colors — these are habit-specific accent colors, not theme colors
- `CelebrationExample.tsx` — example/demo file
- Test files (`*.test.tsx`) — hardcoded values in assertions are fine
- `TemplateAddedToast.tsx` — uses overlay-specific dark bg intentionally
- `FloatingXPText.tsx` — gamification colors are decorative
- `InlineTrialBar.tsx` — gradient overlay text, intentional white
- `PremiumPackCard.tsx` — gradient card with white text overlay, intentional
- `ModalBackdrop.tsx` — `#000` for backdrop is universal

## Verification

1. Run `npx eslint --no-error-on-unmatched-pattern src/screens/auth/components/AuthError/AuthError.tsx src/components/SettingsModal/ProfileCard.tsx src/screens/HabitEditScreen/NameInputSection.tsx src/screens/HabitEditScreen/CustomizeSection.tsx src/screens/HabitEditScreen/SectionLabel.tsx` to verify no lint errors
2. Run `npx tsc --noEmit` to verify no type errors
3. Grep for remaining hardcoded hex values in modified files to confirm all are replaced
4. Visual check: each modified component should look identical (same colors, same sizes) — the changes are token replacements, not visual changes
