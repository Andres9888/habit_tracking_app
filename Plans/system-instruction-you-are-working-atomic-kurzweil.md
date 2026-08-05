# Habit Library — Replace Add Animation & Fix Confetti Green Dot

## Context

In the Habit Library flow, when the user taps a template and adds it via the full-size preview, two problems occur:

1. **Add animation feels off.** The current success animation (green glow burst, button-morph-to-checkmark with multi-stage spring + sequence timings, plus confetti) is busy and doesn't match the app's otherwise calm tone. The user wants a different animation that's more aligned with the app.
2. **Confetti leaves a green dot.** After the confetti plays, a small green particle remains visible on screen. The confetti overlay stays mounted indefinitely while `isImported = true` — any particle whose final `fadeOut` frame doesn't fully complete (a known quirk of `react-native-confetti-cannon`) stays stuck as a static dot at its final position.

## Scope of this plan

- The `FullsizeTemplatePreview` "Add to my habits" success animation + confetti.
- Does **not** touch the zero-state full-screen `CelebrationOverlay` (`src/components/TemplateAddedToast/CelebrationOverlay.tsx`) — that's a different surface used only when the user has 0 habits.
- Does **not** touch the `TemplateAddedToast` (toast has no confetti and its spring animation is not what the user is describing).

## Current implementation (for reference)

- Preview: `src/components/FullsizeTemplatePreview/FullsizeTemplatePreview.tsx`
- Success animation hook: `src/components/FullsizeTemplatePreview/hooks/useSuccessAnimations.ts` — drives `successGlow`, `successGlowScale`, `checkmarkScale/Rotation`, `successButtonGlow` (4-stage pulse), `successIconBounce`.
- Success button render: `src/components/FullsizeTemplatePreview/components/FooterSection.tsx:51-72` (replaces Add button with "Added!" pill + glow + icon bounce).
- Full-screen green wash overlay: `src/components/FullsizeTemplatePreview/components/SuccessGlowOverlay.tsx`.
- Confetti: `src/components/FullsizeTemplatePreview/components/ConfettiOverlay.tsx` (`count=60`, `fadeOut`, green-heavy palette in `FullsizeTemplatePreview.constants.ts:11-18`).
- Confetti wiring: `src/components/FullsizeTemplatePreview/components/PreviewContent.tsx:70-72` — `visible={isImported ? !reducedMotion : null}`. Once imported, the overlay never unmounts until the modal closes.

## Root cause of the green dot

`react-native-confetti-cannon` renders each particle as an absolutely-positioned `<Animated.View>`. With `fadeOut`, each particle's opacity animates to 0, but the particle view itself stays in the tree for the lifetime of the `ConfettiCannon`. If any particle's fade-out frame doesn't reach opacity 0 cleanly (dropped frame during the JS pause when importing, an interrupted animation, or the library's known edge case when `count` is high), it leaves a visible stub. Because `ConfettiOverlay` keeps `visible=true` forever after import, the stuck particle persists.

## Recommended fix

### A. Confetti green-dot fix (regardless of animation choice)

Unmount the `ConfettiCannon` a deterministic time after it fires, so any stuck particle is removed from the tree.

**File:** `src/components/FullsizeTemplatePreview/components/PreviewContent.tsx`
- Replace `visible={isImported ? !reducedMotion : null}` with a local state `confettiActive` that:
  - Sets to `true` when `isImported` transitions `false → true` and `!reducedMotion`.
  - Flips back to `false` via a `setTimeout` matching the confetti lifetime (fallSpeed 2500ms + buffer → **3000ms**).
  - Is cleaned up in the effect's cleanup (clearTimeout) to avoid leaks if the modal closes mid-animation.
- `ConfettiOverlay` already returns `null` when `visible` is falsy (`ConfettiOverlay.tsx:22-24`), so the unmount will remove every particle view.

This is a surgical 1-file change; no new components, no library swap.

### B. New add animation — pick direction (user question below)

The current animation stack in `useSuccessAnimations.ts` runs 5 simultaneous tracks (glow opacity sequence, glow scale sequence, checkmark spring, button-glow 4-stage pulse, icon bounce). Replacing it with something calmer aligned with the app means reducing to 1–2 focused motions.

Three candidate directions (all reuse existing `springs` tokens from `@/theme/animations` for consistency):

1. **Calm checkmark morph (no confetti).** Button cross-fades to "Added!" pill with a single `springs.standard` scale from 0.95→1 and checkmark scale 0→1 with `springs.bouncy`. No glow overlay, no confetti. Clean and in line with the rest of the app's button interactions.
2. **Soft ring ripple.** Single expanding success-green ring from the button center (scale 0→2.5, opacity 0.6→0, `withTiming` 600ms). Button morphs to "Added!" pill. No confetti. Feels intentional and local rather than screen-wide.
3. **Keep confetti, simplify the rest.** Fix confetti unmount (A), drop the full-screen `SuccessGlowOverlay` and the 4-stage `successButtonGlow` pulse, keep only the checkmark-morph + brief icon bounce + confetti. Preserves celebration moment but quiets the surrounding motion.

## Files to modify (final list depends on direction)

Always:
- `src/components/FullsizeTemplatePreview/components/PreviewContent.tsx` — add confetti unmount timer.

If direction 1 (calm checkmark morph):
- `src/components/FullsizeTemplatePreview/hooks/useSuccessAnimations.ts` — simplify to checkmark scale + button scale only; remove glow/pulse/confetti triggers.
- `src/components/FullsizeTemplatePreview/FullsizeTemplatePreview.tsx` — stop rendering `SuccessGlowOverlay` and `ConfettiOverlay`.
- Remove unused exports from `useSuccessAnimations` (`successGlow`, `successGlowScale`, `successButtonGlow`, `successIconBounce`) and their animated styles in `useFullsizeAnimatedStyles`.

If direction 2 (ring ripple):
- Same as direction 1, plus a new small `SuccessRingOverlay.tsx` that renders a single expanding ring anchored to the Added button position (use absolute positioning within the footer, not screen-wide).

If direction 3 (simplified + confetti):
- `src/components/FullsizeTemplatePreview/hooks/useSuccessAnimations.ts` — drop `successGlow`, `successGlowScale`, `successButtonGlow` tracks; keep checkmark + icon bounce + confetti trigger.
- `src/components/FullsizeTemplatePreview/FullsizeTemplatePreview.tsx` — remove `SuccessGlowOverlay`.
- `FullsizeTemplatePreview.constants.ts` — optional: trim `CONFETTI_COLORS` (6 greens is heavy; reduce to 3 colors, keep gold accent).

## Verification

1. Start dev server: `npm run start` (or `npx expo start`).
2. Open the app, go to the Habit Library, tap any template → preview appears.
3. Tap **Add to my habits**:
   - Confirm the new animation plays as designed.
   - Watch for 5 seconds after the confetti finishes — **no green dots or particles should remain on screen**.
   - Close and reopen the preview, add again — verify consistent behavior.
4. Toggle "Reduce Motion" in iOS Settings → re-run the flow. The success state should still appear (static) with no animation and no stuck particles.
5. Visual comparison: screenshot before/after and confirm the new animation matches the chosen direction.
6. Run `npm run typecheck` and `npm run lint` to confirm no type or lint regressions.
