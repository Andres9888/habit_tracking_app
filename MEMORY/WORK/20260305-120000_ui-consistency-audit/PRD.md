---
task: Audit and fix app-wide UI consistency
slug: 20260305-120000_ui-consistency-audit
effort: advanced
phase: execute
progress: 0/28
mode: interactive
started: 2026-03-05T12:00:00-05:00
updated: 2026-03-05T12:01:00-05:00
---

## Context

Andres wants the entire habit tracking app to feel consistent — animations, micro-transitions, colors, and design system usage should be uniform everywhere.

The app has an excellent canonical design system in `src/theme/` (animations.ts, colors/, spacing.ts, typography.ts). However, enforcement across 111+ components has drifted:

1. **4 overlapping animation token files** — theme/animations.ts (canonical), constants/animations.ts (facade), constants/motion.ts (Motion.duration with unique values), constants/ui-values.ts (ANIMATION_DURATION with 20 values). Creates confusion about which to import.
2. **50+ components use hard-coded animation durations** — raw numbers (1000, 1200, 1500, 2000) instead of importing theme tokens.
3. **20+ files use hard-coded hex colors** — #059669, #10b981, etc. instead of importing from colors.
4. **Redundant spring aliases** — snappy, micro, button are all identical to standard ({damping:18, stiffness:150}).
5. **Motion.duration has orphan values** — `emphasized: 220` and `exit: 220` have no equivalent in canonical durations.

### Risks

- Touching 30+ files risks regressions — must verify build passes
- Some "hard-coded" values may be intentional (e.g., category colors are design choices, not theme violations)
- Removing spring aliases could break imports if not done as deprecation

### Plan

**Approach:** Token consolidation first, then component migration.

1. **Add missing durations** to theme/animations.ts for loop/breathing/glow animations (1000, 1500, 2000)
2. **Consolidate constants/ui-values.ts** ANIMATION_DURATION to re-export from theme
3. **Consolidate constants/motion.ts** Motion.duration to re-export from theme
4. **Remove MAGIC_NUMBERS** from constants/animations.ts
5. **Migrate component animation constants** to use theme tokens
6. **Migrate component color constants** to use theme color tokens
7. **Remove redundant spring aliases** or document them as intentional aliases
8. **Verify build passes**

## Criteria

- [ ] ISC-1: theme/animations.ts includes loop duration token (1000ms)
- [ ] ISC-2: theme/animations.ts includes breathing duration token (1500ms)
- [ ] ISC-3: theme/animations.ts includes drift duration token (2000ms)
- [ ] ISC-4: constants/ui-values.ts ANIMATION_DURATION references theme durations
- [ ] ISC-5: constants/motion.ts Motion.duration references theme durations
- [ ] ISC-6: constants/animations.ts MAGIC_NUMBERS section removed
- [ ] ISC-7: Redundant spring aliases documented as intentional in comments
- [ ] ISC-8: successAnimations.ts durations use theme tokens
- [ ] ISC-9: DailyMomentumMeter useAnimations uses theme tokens
- [ ] ISC-10: PulsingIcon.tsx uses theme duration tokens
- [ ] ISC-11: TemplateScienceModal animationConstants uses theme tokens
- [ ] ISC-12: WeeklySummaryCard celebrationAnimations uses theme tokens
- [ ] ISC-13: HeroAnimation.tsx uses theme duration tokens
- [ ] ISC-14: AnimatedLogo.tsx uses theme duration tokens
- [ ] ISC-15: LoadingSpinner.tsx uses theme duration tokens
- [ ] ISC-16: ConfettiParticle.tsx uses theme duration tokens
- [ ] ISC-17: StrengthProgressBar uses canonical spring presets
- [ ] ISC-18: burstConfigs.ts colors reference theme color tokens
- [ ] ISC-19: StrengthRing.constants.ts colors reference theme color tokens
- [ ] ISC-20: ProgressSectionConsolidated strengthLevels uses theme colors
- [ ] ISC-21: WeeklySummaryCard utils.ts colors reference theme color tokens
- [ ] ISC-22: ShareCardGenerator constants use theme color tokens
- [ ] ISC-23: Auth component AnimatedDot uses theme color tokens
- [ ] ISC-24: AnimatedBorderBox.tsx uses theme color tokens
- [ ] ISC-25: StrengthProgressBar useGlowPulse uses theme duration tokens
- [ ] ISC-A-1: No inline {damping:X, stiffness:Y} in component .tsx files
- [ ] ISC-A-2: App builds without TypeScript errors after all changes
- [ ] ISC-A-3: No new animation tokens added that duplicate existing ones
