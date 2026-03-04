# P2: Non-Canonical Shadows → Use `shadows.*` Tokens

Replace custom shadow definitions with the 5 canonical shadow presets from `@/theme/spacing`. The theme defines warm-toned shadows using `#2D2A26` at specific opacity/radius/offset levels. Files that define their own shadow properties should instead spread the nearest canonical preset.

## Context

Canonical shadow presets from `src/theme/spacing.ts`:

```
shadows.subtle   = { shadowColor: '#2D2A26', shadowOffset: {h:1,w:0}, shadowOpacity: 0.04, shadowRadius: 3,  elevation: 1  }
shadows.card     = { shadowColor: '#2D2A26', shadowOffset: {h:2,w:0}, shadowOpacity: 0.06, shadowRadius: 8,  elevation: 3  }
shadows.floatingActionButton = { shadowColor: '#2D2A26', shadowOffset: {h:4,w:0}, shadowOpacity: 0.08, shadowRadius: 16, elevation: 6  }
shadows.modal    = { shadowColor: '#2D2A26', shadowOffset: {h:8,w:0}, shadowOpacity: 0.10, shadowRadius: 24, elevation: 8  }
shadows.alert    = { shadowColor: '#2D2A26', shadowOffset: {h:12,w:0}, shadowOpacity: 0.14, shadowRadius: 32, elevation: 12 }
```

Match custom shadows to presets based on elevation level:

- Chips, badges, subtle lift → `shadows.subtle`
- Cards at rest → `shadows.card`
- FAB, pressed cards, elevated elements → `shadows.floatingActionButton`
- Modals, bottom sheets, overlays → `shadows.modal`
- Top-level alerts, toasts → `shadows.alert`

---

- [x] **Replace custom shadows in `OnboardingScreen.styles.ts` and `onboarding.visuals.styles.ts`.** Read `src/screens/onboarding/OnboardingScreen.styles.ts` and `src/screens/onboarding/onboarding.visuals.styles.ts`. Both use `shadowColor: '#000'` with custom offset/opacity/radius. Add `import { shadows } from '@/theme/spacing'` if not present. Find each shadow definition and replace with the nearest canonical preset spread. For card-level elements use `...shadows.card`, for elevated buttons use `...shadows.floatingActionButton`. Remove the individual `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation` properties that are now covered by the spread. Ensure TypeScript compiles cleanly.

  > **Skipped:** Neither `src/screens/onboarding/OnboardingScreen.styles.ts` nor `src/screens/onboarding/onboarding.visuals.styles.ts` exist in the codebase. No `src/screens/onboarding/` directory exists. The audit likely referenced files from a planned-but-never-implemented onboarding feature.

- [x] **Replace custom shadows in `BottomActionBar/BottomActionBar.styles.ts` and `ProgressRingFAB.styles.ts`.** Read `src/features/habits/components/BottomActionBar/BottomActionBar.styles.ts` (uses `shadowColor: '#000'`) and `src/features/habits/components/BottomActionBar/ProgressRingFAB.styles.ts` (uses `shadowColor: '#059669'`). For `BottomActionBar.styles.ts`: replace the custom shadow with `...shadows.card` or `...shadows.floatingActionButton` depending on the elevation level. For `ProgressRingFAB.styles.ts`: the green shadow (`'#059669'`) is intentional (it's a colored glow effect on the FAB), so keep it but add a comment: `// Intentional: colored glow uses primary green, not canonical shadow`. Replace the `borderRadius: 22` or `32` with `borderRadius.full` (9999) if the FAB is meant to be circular, or appropriate token. Ensure TypeScript compiles cleanly.

  > **Skipped:** Neither `src/features/habits/components/BottomActionBar/BottomActionBar.styles.ts` nor `src/features/habits/components/BottomActionBar/ProgressRingFAB.styles.ts` exist in the codebase. No `BottomActionBar` directory or `ProgressRingFAB` file was found anywhere. Grep for both names returned zero results. The audit likely referenced components that were removed or never implemented.

- [x] **Replace custom shadows in `PerformanceDashboard.styles.ts`.** Read `src/components/PerformanceDashboard/PerformanceDashboard.styles.ts`. It uses `shadowColor: '#1c1917'` with custom values. Replace with `...shadows.card` (or `...shadows.modal` if it's an overlay panel). Remove individual shadow properties. Replace raw `borderRadius: 12` with `borderRadius.medium`. Ensure TypeScript compiles cleanly.

  > **Done:** Replaced custom shadow (`shadowColor: '#000', shadowOffset: {h:4,w:0}, shadowOpacity: 0.3, shadowRadius: 8`) with `...shadows.modal` canonical preset. Used `shadows.modal` because PerformanceDashboard is a floating debug overlay panel (position: absolute, zIndex: 9999). `borderRadius.medium` was already migrated in a previous task. Added shadow preset validation test (11/11 passing).

- [x] **Replace custom shadow in `NextHabitSuggestion.styles.ts`.** Read `src/components/NextHabitSuggestion/NextHabitSuggestion.styles.ts`. It uses `shadowColor: '#000'` with custom shadow properties. Replace with `...shadows.card`. Remove individual shadow properties. Ensure TypeScript compiles cleanly. (Note: if hex color replacement was already done in DESIGN-CONSISTENCY-03, just verify the shadow was also fixed.)

  > **Skipped:** `src/components/NextHabitSuggestion/NextHabitSuggestion.styles.ts` does not exist in the codebase. Glob and grep for `NextHabitSuggestion` returned zero results across the entire project. The audit likely referenced a component that was removed or never implemented.

- [x] **Fix shadow override in `EmojiPickerSheet.styles.ts`.** Read `src/components/EmojiPickerV2/EmojiPickerSheet/EmojiPickerSheet.styles.ts`. Lines 73-82 spread `...shadows.modal` but then override `shadowOffset`, `shadowOpacity`, and `shadowRadius` with custom values (height: -4, opacity: 0.15, radius: 20). Remove these overrides — the canonical `shadows.modal` preset (height: 8, opacity: 0.10, radius: 24) is the correct definition for bottom sheets. Also remove `elevation: 20` and let `shadows.modal.elevation` (8) be used. Ensure TypeScript compiles cleanly. (Note: if this was already fixed in DESIGN-CONSISTENCY-02, just verify.)

  > **Done:** The `shadowOffset`, `shadowOpacity`, and `shadowRadius` overrides had already been removed in a prior task (DESIGN-CONSISTENCY-02). The remaining override was `elevation: 20` on line 89, which silently defeated `shadows.modal.elevation` (4). Removed the `elevation: 20` override so the canonical `shadows.modal` preset is now used without any overrides. Strengthened the existing test from checking only `shadowColor` to validating all 5 shadow properties (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation`) match the canonical preset. All 59 tests passing.
