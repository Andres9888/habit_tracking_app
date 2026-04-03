# Design Review: HabitDetailScreen Token Consistency

## Context

The HabitDetailScreen and its sub-components were recently redesigned but introduced inline magic numbers, hardcoded hex values, and ad-hoc typography/spacing that don't reference the established design tokens in `src/theme/`. This review audits each component for consistency with the token system (typography, spacing, colors, shadows, animations) and proposes surgical fixes.

This continues the pattern established in `docs/Design-Consistency/DESIGN-CONSISTENCY-09.md` (Phase 9: migrating recently redesigned screens to theme tokens).

---

## Findings & Fixes

### 1. `DetailHero.tsx` (line 29-86)

| Issue | Current | Should Be |
|-------|---------|-----------|
| Habit name doesn't use typography token | `fontSize: 34, letterSpacing: -0.5, lineHeight: 41` + `className='font-bold'` | `...typography.displayLarge` (fontSize: 34, letterSpacing: -0.85, lineHeight: 41, fontFamily: Literata, fontWeight: 700) |
| Schedule text uses Tailwind arbitrary | `className='mt-1 text-[13px]'` | `style={{ ...typography.caption, color: colors.text.secondary, marginTop: spacing.xs }}` |
| Emoji fontSize is magic number | `fontSize: 34` | OK as-is (emoji sizing is independent of type scale) |
| Check badge uses hardcoded white | `color='#FFFFFF'` | `color={colors.text.inverse}` |
| Check badge dimensions are magic numbers | `height: 24, width: 24, borderWidth: 2` | Acceptable (badge sizing is contextual) |
| Padding uses Tailwind arbitrary | `className='px-4 pb-6'` | `style={{ paddingHorizontal: spacing.base, paddingBottom: spacing.lg }}` or keep Tailwind (px-4=16, pb-6=24 map correctly) |

**Changes:** Replace inline habit name styles with `typography.displayLarge`, schedule with `typography.caption`, white hex with `colors.text.inverse`.

### 2. `QuickStatsRow.tsx` (line 84-111)

| Issue | Current | Should Be |
|-------|---------|-----------|
| Pill gap is magic number | `gap: 4` | `gap: spacing.xs` |
| Pill paddingHorizontal is magic | `paddingHorizontal: 12` | `paddingHorizontal: spacing.md` |
| Pill paddingVertical off-grid | `paddingVertical: 6` | `paddingVertical: 6` (keep — 6px is acceptable micro-adjustment between xs:4 and sm:8) |
| Row gap is magic number | `gap: 8` | `gap: spacing.sm` |
| Row paddingVertical is magic | `paddingVertical: 8` | `paddingVertical: spacing.sm` |
| Label fontSize not in type scale | `fontSize: 11` | Keep 11 (acceptable micro-text for pill labels) |
| Value fontSize not in type scale | `fontSize: 13` | Matches caption scale — acceptable for monospace data |
| Emoji fontSize magic | `fontSize: 12` | Keep (emoji micro-sizing) |

**Changes:** Replace raw `4`, `8`, `12` numbers with `spacing.xs`, `spacing.sm`, `spacing.md` imports.

### 3. `DetailViewTabs.tsx` (line 72-84)

| Issue | Current | Should Be |
|-------|---------|-----------|
| Indicator shadow is inline | `elevation: 3, shadowColor: accentColor, shadowOffset: {height: 3, width: 0}, shadowOpacity: 0.12, shadowRadius: 8` | Use `shadows.card` for base, override `shadowColor` with `accentColor` |
| Light indicator bg hardcoded | `'#FFFFFF'` | `colors.card` or `colors.text.inverse` (white for light mode is acceptable for pill indicators — keep as-is since card in light mode is `#EDEAE5`, not white) |

**Changes:** Replace inline shadow with `{ ...shadows.card, shadowColor: accentColor }`. Keep `#FFFFFF` — it's intentionally white for the pill indicator contrast, not a semantic card surface.

### 4. `DetailViewTabButton.tsx` (line 48-69)

| Issue | Current | Should Be |
|-------|---------|-----------|
| Label className with arbitrary size | `className='text-[13px]'` + inline fontWeight | `style={{ ...typography.caption, fontWeight: isActive ? fontWeights.semibold : fontWeights.medium, color: foreground }}` |
| Hint badge font size | `className='text-[12px] font-medium'` | Keep as micro-text (12px hint badge is contextual) |
| Hint bg uses hardcoded rgba | `'rgba(255,255,255,0.06)'` / `'rgba(0,0,0,0.06)'` | Acceptable — these are micro-overlays with no semantic token equivalent |

**Changes:** Replace tab label with typography.caption + fontWeights tokens.

### 5. `HeaderButton.tsx` (line 46-101)

| Issue | Current | Should Be |
|-------|---------|-----------|
| Text button bg hardcoded rgba | `'rgba(255,255,255,0.08)'` / `'rgba(0,0,0,0.04)'` | Acceptable translucent overlay — no token equivalent |
| Text button border hardcoded rgba | `'rgba(255,255,255,0.1)'` / `'rgba(0,0,0,0.08)'` | Acceptable — same reason |
| borderRadius: 24 | `borderRadius: 24` | `borderRadius: borderRadius.xl` |
| gap: 8 | `gap: 8` | `gap: spacing.sm` |
| height: 44 | `height: 44` | `height: componentSpacing.button.height` |
| paddingHorizontal: 16 | `paddingHorizontal: 16` | `paddingHorizontal: spacing.base` |
| opacity: 0.7 | `{ opacity: 0.7 }` | `{ opacity: OPACITY.high }` |
| Text style fontSize/letterSpacing inline | `fontSize: 14, letterSpacing: -0.2` | `...typography.bodySmall` (fontSize: 14, letterSpacing: 0, lineHeight: 20) — note: bodySmall has letterSpacing: 0, so the -0.2 is intentional tightening. Use `{ ...typography.bodySmall, letterSpacing: -0.2 }` |

**Changes:** Replace raw numbers with token imports for borderRadius, gap, height, padding, opacity. Use `typography.bodySmall` as base for text label style.

### 6. `DetailHeader.constants.ts` (line 7-12)

| Issue | Current | Should Be |
|-------|---------|-----------|
| iconShadow missing shadowColor | No `shadowColor` property | Add `shadowColor: '#2D2A26'` for warm tonal consistency (matches all shadows in spacing.ts) |
| iconShadow doesn't use token | Custom values | Keep custom values — this is intentionally stronger than FAB shadow for the hero icon. Add missing shadowColor. |

**Changes:** Add `shadowColor: '#2D2A26'` to iconShadow.

### 7. `SectionLabel.tsx` (line 33)

| Issue | Current | Should Be |
|-------|---------|-----------|
| Text uses Tailwind arbitrary | `className='text-[13px] font-semibold tracking-wider'` | `style={{ ...typography.caption, fontWeight: fontWeights.semibold, letterSpacing: 1, color: textColor }}` |

**Changes:** Replace className with typography.caption + fontWeights token. Note: `tracking-wider` in Tailwind is `letterSpacing: 0.05em` = ~0.65px at 13px. The caption token has `letterSpacing: 0.12`. Decide: keep caption's 0.12 or use custom wider spacing. Since section labels are uppercase-like dividers, wider tracking (0.5-1.0) is appropriate — override caption's letterSpacing.

### 8. `HabitDetailScreen.tsx` (line 86)

| Issue | Current | Should Be |
|-------|---------|-----------|
| Edit icon size not from iconSizes | `size={15}` | Use `16` (standard small icon) from iconSizes, or keep 15 as intentional micro-sizing for the button context |

**Changes:** Change to `size={16}` to align with standard icon size grid.

---

## Files to Modify

1. `src/screens/HabitDetailScreen/components/DetailHero.tsx`
2. `src/screens/HabitDetailScreen/components/QuickStatsRow.tsx`
3. `src/screens/HabitDetailScreen/components/DetailViewTabs.tsx`
4. `src/screens/HabitDetailScreen/components/DetailViewTabButton.tsx`
5. `src/screens/HabitDetailScreen/components/HeaderButton.tsx`
6. `src/screens/HabitDetailScreen/components/DetailHeader.constants.ts`
7. `src/screens/HabitDetailScreen/components/SectionLabel.tsx`
8. `src/screens/HabitDetailScreen/HabitDetailScreen.tsx`

## Verification

1. Run `npx eslint src/screens/HabitDetailScreen/ --fix` to ensure no lint errors
2. Run `npx tsc --noEmit` to verify type correctness
3. Visual check on device/simulator — these are purely token alignment changes, no visual differences should be noticeable (the token values match the hardcoded values in most cases)
