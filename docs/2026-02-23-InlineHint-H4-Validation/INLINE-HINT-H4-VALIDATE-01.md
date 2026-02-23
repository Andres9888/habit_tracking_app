# InlineHint H4 — Validate & Fix Full-Width CTAs

> **Spec:** `INLINE-HINT-H4-SPEC.md` (in this folder)
> **Mock:** `.superdesign/design_iterations/inline_hint_h4_mock_1.html`
> **Maestro flow:** `.maestro/inline-hint-h4-validation.yaml`

## Known Issue

The "Browse templates" and "Build my own" CTA buttons repeatedly regress to not being full width. The root cause is Reanimated's `Animated.View` — it does **not** correctly merge `width: '100%'` from style arrays like `[{ width: '100%' }, animatedStyle]`. Every `Animated.View` in the layout chain must have explicit `alignSelf: 'stretch'` to propagate width correctly.

## Width Contract (6 checkpoints)

These 6 locations form the full-width chain. If ANY one breaks, the CTAs shrink:

| #   | File                             | What to check                                                                     |
| --- | -------------------------------- | --------------------------------------------------------------------------------- |
| 1   | `ActionSection.tsx`              | Outer `<View>` wrapping InlineHint has `width: '100%'`                            |
| 2   | `useKeyboardLayoutAnimations.ts` | `secondaryLinksAnimatedStyle` includes `alignSelf: 'stretch'` AND `width: '100%'` |
| 3   | `AnimatedEntrance.tsx`           | `Animated.View` style includes `alignSelf: 'stretch'`                             |
| 4   | `InlineHint.tsx`                 | Container `<View>` has `alignSelf: 'stretch'` AND `width: '100%'`                 |
| 5   | `InlineHint.hooks.ts`            | `templatesAnimatedStyle` includes `alignSelf: 'stretch'`                          |
| 6   | `InlineHint.hooks.ts`            | `buildMyOwnAnimatedStyle` includes `alignSelf: 'stretch'`                         |

---

## Phase 1: Static Code Validation

- [x] **Validate all 6 width checkpoints against the spec.** _(All 6/6 passed — Phase 2 skipped)_ Read each file listed in the Width Contract table above (all in `src/features/habits/components/HabitsEmptyStateMinimal/`). For each checkpoint, verify the exact style property exists. Report results as a table: `| # | File | Expected | Found | Pass/Fail |`. If ALL 6 pass, mark this task complete and skip Phase 2 entirely — proceed to Phase 3. If ANY fail, mark this task complete and continue to Phase 2.

## Phase 2: Fix Width Regressions (skip if Phase 1 all passed)

- [ ] **Fix any failing width checkpoints.** For each checkpoint that failed in Phase 1, apply the fix. The fix is always the same pattern: add `alignSelf: 'stretch'` (and `width: '100%'` where noted) to the style. Do NOT use style arrays on `Animated.View` (e.g., `[{ width: '100%' }, animatedStyle]`) — Reanimated ignores merged styles. Instead, put width properties INSIDE `useAnimatedStyle()` return values. After fixing, re-run the Phase 1 validation to confirm all 6 checkpoints pass. If they still don't pass, read the component tree more carefully — another `Animated.View` wrapper may have been added that also needs `alignSelf: 'stretch'`.

## Phase 3: Maestro Visual Validation

- [ ] **Run the Maestro E2E flow and capture screenshots.** Execute: `JAVA_HOME=~/java/jdk-21.0.10+7/Contents/Home maestro test .maestro/inline-hint-h4-validation.yaml`. The flow validates: divider visibility, both CTAs visible with correct text/emoji/badge, navigation works for both buttons, and captures 4 screenshots. If the flow fails on an `assertVisible` check, investigate whether the element testID exists in the component. If it fails on navigation, check that `onBrowseTemplates` and `onCreateCustom` callbacks are wired up in `ActionSection.tsx`. Report the result (pass/fail) and which screenshots were captured.

## Phase 4: Visual Width Inspection

- [ ] **Inspect the Maestro screenshot for CTA width.** Open the screenshot at `.maestro/screenshots/inline-hint-h4-light-mode.png` (or wherever Maestro saved it). Visually confirm that both CTA buttons ("Browse templates" gradient button and "Build my own" card) span the full width of the screen minus padding — they should match the phone-frame width shown in the HTML mock. If they appear narrow/centered instead of full-width, this means the static validation passed but runtime behavior differs — go back to Phase 2 and check for new `Animated.View` wrappers or style overrides that weren't in the original 6 checkpoints.
