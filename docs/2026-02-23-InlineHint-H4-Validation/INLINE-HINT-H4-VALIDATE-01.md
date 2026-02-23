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

- [x] **Fix any failing width checkpoints.** _(Skipped — Phase 1 passed all 6/6, no regressions to fix.)_

## Phase 3: Maestro Visual Validation

- [ ] **Run the Maestro E2E flow and capture screenshots.** Execute: `JAVA_HOME=~/java/jdk-21.0.10+7/Contents/Home maestro test .maestro/inline-hint-h4-validation.yaml`. The flow validates: divider visibility, both CTAs visible with correct text/emoji/badge, navigation works for both buttons, and captures 4 screenshots. If the flow fails on an `assertVisible` check, investigate whether the element testID exists in the component. If it fails on navigation, check that `onBrowseTemplates` and `onCreateCustom` callbacks are wired up in `ActionSection.tsx`. Report the result (pass/fail) and which screenshots were captured.

  > **Result: FAIL — Infrastructure (2026-02-23)**
  >
  > `maestro test` failed 4 times with `IOSDriverTimeoutException: iOS driver not ready in time` (Maestro 2.2.0 + iOS 26.2 on iPhone 13 Pro Max simulator). Tried `MAESTRO_DRIVER_STARTUP_TIMEOUT=240000`, `--device <UDID>`, killing stale XCTest processes, and upgrading Maestro. All failed.
  >
  > **However, `maestro hierarchy` succeeded** — the XCTest driver connected for read-only queries but not for `maestro test`. Alternative evidence gathered:
  >
  > **Hierarchy analysis findings:**
  > | Element | testID | In hierarchy? | Bounds |
  > |---------|--------|--------------|--------|
  > | Divider | `inline-hint-divider` | Yes | [24,596][404,614] |
  > | Left line | `inline-hint-divider-line-left` | Yes | [24,604][173,605] |
  > | Right line | `inline-hint-divider-line-right` | Yes | [254,604][404,605] |
  > | Actions container | `inline-hint-actions` | Yes (empty children) | [24,624][404,669] — only 45px |
  > | Browse templates | `inline-hint-browse-templates` | **NO** | Missing entirely |
  > | Browse badge | `inline-hint-badge` | **NO** | Missing entirely |
  > | Build my own | `inline-hint-create-custom` | Yes | [24,632][404,669] |
  > | Accent stripe | `inline-hint-accent-stripe` | Yes | [24,632][27,669] |
  >
  > **Screenshot analysis** (captured via `xcrun simctl io`):
  >
  > - Saved to `.maestro/screenshots/inline-hint-h4-light-mode.png`
  > - "or explore" divider visible
  > - InlineHint actions area is **clipped at the bottom of the screen**
  > - Only the Build-my-own emoji barely visible; Browse templates button NOT visible at all
  > - The content exceeds viewport height — hero + input + chips + CTA + secondary links don't all fit
  >
  > **Root cause hypothesis:** The `inline-hint-browse-templates` button renders at zero height in the accessibility tree. The `inline-hint-actions` container is only 45px (expected ~104px for both buttons). This may be caused by a Reanimated `Animated.View` layout issue where `templatesAnimatedStyle` (transform-only, no explicit height) collapses the wrapper. The content is also generally clipped by the screen viewport — the empty state layout needs scrollability or condensed spacing to fit all elements.
  >
  > **Next steps:** Retry after upgrading to a newer Maestro version with iOS 26 support, or try on an iOS 18 simulator. Also investigate why `inline-hint-browse-templates` is missing from the accessibility tree.

## Phase 4: Visual Width Inspection

- [ ] **Inspect the Maestro screenshot for CTA width.** Open the screenshot at `.maestro/screenshots/inline-hint-h4-light-mode.png` (or wherever Maestro saved it). Visually confirm that both CTA buttons ("Browse templates" gradient button and "Build my own" card) span the full width of the screen minus padding — they should match the phone-frame width shown in the HTML mock. If they appear narrow/centered instead of full-width, this means the static validation passed but runtime behavior differs — go back to Phase 2 and check for new `Animated.View` wrappers or style overrides that weren't in the original 6 checkpoints.
