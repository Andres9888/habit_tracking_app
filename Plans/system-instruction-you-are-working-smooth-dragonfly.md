# Calm Habit Library entrance animations

## Context

The **Habit Library** (TemplatesScreen) currently animates its search bar, tab bar, and content in on mount using a stiff spring (`springs.exit`: damping 26, stiffness 420, mass 1). Three elements spring simultaneously, and although each is a small 15–20px translateY, the compound spring physics produce a visibly bouncy settle that reads as "hyper" / distracting.

The downstream workflow — **FullsizeTemplatePreview** (opens when user taps a template) — slides content up 100px with `Springs.gentle` (damping 20, stiffness 100). That longer travel distance + spring physics creates an obvious wobble at the end.

Canonical fix already applied on HabitDetail (commit `6a8826ea8`): **replace entrance springs with `Easing.out(Easing.cubic)` timing.** The design system already prescribes this: `animations.ts` line 13 reads _"Entry motion: fade + translateY, 280ms ease-out"_. Springs are reserved for feedback (button press, tab indicator), not page entrance.

This change makes the Library feel calm and intentional on open, which is the single most-seen screen before the first template tap — a better impression here directly supports activation/conversion.

## Changes

### 1. `src/screens/TemplatesScreen/useEntranceAnimations.ts`

Replace the three `withSpring(…, springs.exit)` translateY animations with `withTiming` using ease-out cubic, matching the canonical HabitDetail fix.

- Remove `withSpring` from imports (keep `withTiming`, `Easing`)
- Remove `import { springs } from '@/theme/animations'` and `const ENTRANCE_SPRING = springs.exit`
- Add a single `TRANSLATE_CONFIG = { duration: 280, easing: Easing.out(Easing.cubic) }` (matches the design-system entry-motion spec)
- Lines 44, 47, 50: `withSpring(0, ENTRANCE_SPRING)` → `withTiming(0, TRANSLATE_CONFIG)`
- Leave fade timings (`FADE_CONFIG` 150ms, `CONTENT_FADE` 180ms) untouched
- Leave reduced-motion branch untouched

### 2. `src/components/FullsizeTemplatePreview/hooks/useEntranceAnimations.ts`

Calm the 100px content slide-up. Leave icon micro-interactions alone (they're delayed, small-scale, and intentional).

- Line 54: `contentTranslateY.value = withSpring(0, Springs.gentle)` → `contentTranslateY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) })` (matches the existing 400ms fade on line 55–58, so translate + fade land together)
- **Keep unchanged:** `iconScale` (line 63, delayed subtle pop), `iconGlowScale` (line 64, intentional pulse/glow), backdrop fade, close button fade.

## Out of scope

- The `springs` presets in `src/theme/animations.ts` — keep intact; other screens rely on them.
- Tab-switch animations, button press feedback, tab indicator spring — user explicitly asked about entrance; feedback springs are correct as-is.
- HabitDetail animations — already calmed in commit `6a8826ea8`.
- Any layout/content changes to the Library itself.

## Verification

1. Run app: `npm run start` → open on simulator/device.
2. Navigate to Habit Library tab.
3. Observe entrance: search + tab bar + content should fade + translate up smoothly with no visible overshoot. Compare to HabitDetail entrance (same feel now).
4. Tap any template → FullsizeTemplatePreview should slide up from bottom with a clean settle (no wobble at the end).
5. Icon should still gently pop + glow (unchanged micro-interactions).
6. Toggle Reduce Motion (iOS Settings → Accessibility) → both screens should appear instantly with no motion.
7. `npx tsc --noEmit` passes.
8. `npm run lint:max-lines` — no new violations (both files remain well under 100 lines).

## Critical files

- `src/screens/TemplatesScreen/useEntranceAnimations.ts` (83 lines)
- `src/components/FullsizeTemplatePreview/hooks/useEntranceAnimations.ts` (79 lines)
- Reference pattern: `src/screens/HabitDetailScreen/components/DetailHero.tsx` (canonical `Easing.out(Easing.cubic)` entrance)
- Reference spec: `src/theme/animations.ts` lines 13, 29–30 (entry-motion rule)
