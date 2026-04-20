# Smooth Back Transition for Habit Library Details Modal

## Context

The habit library **details page** (`FullsizeTemplatePreview` — the preview with science section and YouTube video) opens with a rich, polished entrance (content slides up 100px, fades in, icon springs to scale, glow pulses, backdrop fades, close button fades). But when the user taps **back**, the modal **vanishes instantly** — a hard cut that feels jarring against the smooth entrance.

### Root cause

`FullsizeTemplatePreview.tsx:67-77` renders `<Modal>` with both `inline={true}` and `skipAnimation={true}`. These flags disable Modal's own built-in slide-out animation (`runExitAnimation.ts:37-43`). Additionally, Modal returns `null` immediately when `visible=false` (`Modal.tsx:82`). Meanwhile, `useEntranceAnimations.ts` only runs its effect when `visible && template`; it has no exit branch. The net effect: no exit animation at all, and the component unmounts in the same tick the parent flips `showFullsizePreview=false`.

This issue also affects the **auto-close after successful import** path at `useTemplateImportHandlers.ts:60-63` (1000ms timer closes the preview after a successful habit import), which is the primary happy-path exit.

### Goal

Add a symmetric, slightly faster exit animation that mirrors the entrance. Keep the fix surgical: no changes to `Modal.tsx`, `runExitAnimation.ts`, or any other modal consumer.

## Approach

**Delayed unmount + dedicated exit hook.** Track a local `shouldRender` state that stays `true` during the exit animation so shared values have time to animate, then unmount. A new `useExitAnimations` hook runs alongside the existing `useEntranceAnimations`, writing to the same shared values on `visible=false` transition.

### Timing (per codebase convention — `useViewNavigation.ts:37-38` + `Motion.duration`)

- `contentTranslateY`: 0 → 60 over 260ms with `Motion.easing.inCubic`
- `contentOpacity`: 1 → 0 over 200ms with `Motion.easing.inCubic`
- `backdropOpacity`: 0.5 → 0 over 200ms with `Motion.easing.inCubic`
- `closeButtonOpacity`: 1 → 0 over 120ms (snaps fast)
- **Unmount delay: 280ms** (matches `durations.enter` and the `useViewNavigation` precedent)

Exit durations are ~70% of entrance durations — fast dismissal maintains perceived responsiveness.

### What NOT to animate on exit

Icon scale, icon glow, and icon glow opacity stay frozen. They're inside the content container and ride along with the container's opacity/translateY automatically. Animating them independently creates a second competing motion layer that reads as fidget.

### Edge cases handled

1. **Rapid open/close toggling** — timeout handle stored in `useRef`, cleared whenever `visible` flips back to true or on cleanup.
2. **Template change during exit** (e.g., "Customize" path at `useTemplateImportHandlers.ts:30-37` sets a new template and closes the preview in the same tick) — use a `useRef` snapshot to freeze the rendered template during exit, preventing a mid-animation swap.
3. **Reduced motion** — snap shared values to exit state and skip the 280ms unmount delay entirely.
4. **Initial mount with `visible=false`** — `shouldRender` starts false, so the existing test (`FullsizeTemplatePreview.test.tsx:182-195`) asserting null render still passes.
5. **Import success auto-close** — `handleDirectImport` at `useTemplateImportHandlers.ts:60-63` sets `showFullsizePreview=false` after 1000ms; our new exit animation will fire on this path automatically.

## Files to Change

### Change 1 — New file: `src/components/FullsizeTemplatePreview/hooks/useDeferredUnmount.ts`

Pure React hook (no Reanimated). Signature: `useDeferredUnmount({ visible, duration, reducedMotion }): boolean`.

- Tracks `shouldRender` via `useState`.
- When `visible` → true: clear timeout, set `shouldRender = true`.
- When `visible` → false and was previously visible:
  - reducedMotion: set `shouldRender = false` immediately.
  - Otherwise: `setTimeout(() => setShouldRender(false), duration)` with handle stored in `useRef`.
- Cleanup clears the timeout.

### Change 2 — New file: `src/components/FullsizeTemplatePreview/hooks/useExitAnimations.ts`

Takes the shared values returned by `useEntranceAnimations` plus `visible` and `reducedMotion`. Uses a `useRef<boolean>` to track "previously visible" so exit doesn't fire on initial mount.

When `visible` transitions from true → false:
- **reducedMotion:** snap `backdropOpacity = 0`, `contentOpacity = 0`, `contentTranslateY = 60`, `closeButtonOpacity = 0`.
- **Animated:** `withTiming` each to exit state using durations from the Approach section and `Motion.easing.inCubic` from `src/constants/motion.ts`.

### Change 3 — Edit: `src/components/FullsizeTemplatePreview/FullsizeTemplatePreview.tsx`

- **After line 32** (`const reducedMotion = useReduceMotion();`): add
  ```tsx
  const shouldRender = useDeferredUnmount({ visible, duration: 280, reducedMotion });
  const lastTemplateRef = useRef(template);
  if (template) lastTemplateRef.current = template;
  const effectiveTemplate = visible ? template : lastTemplateRef.current;
  ```
- **Line 35-39:** pass `template: effectiveTemplate` to `useEntranceAnimations`.
- **After `useEntranceAnimations` call:** invoke `useExitAnimations({ ...entranceAnimations, visible, reducedMotion })`.
- **Line 65:** `if (!template) return null;` → `if (!shouldRender || !effectiveTemplate) return null;`
- **Line 75:** `visible={visible}` → `visible={shouldRender}`
- **Line 90:** `template={template}` → `template={effectiveTemplate}`
- Add `useRef` to React imports.

### Change 4 — Edit: `src/components/FullsizeTemplatePreview/hooks/index.ts`

Add barrel exports for `useExitAnimations` and `useDeferredUnmount`.

### Explicit non-changes

- `src/components/Modal/Modal.tsx` — untouched (keeps `inline` + `skipAnimation` contract intact for all modal consumers).
- `src/components/Modal/runExitAnimation.ts` — untouched.
- `src/components/FullsizeTemplatePreview/hooks/useEntranceAnimations.ts` — untouched (avoids mutating a tested contract).
- Test file `FullsizeTemplatePreview.test.tsx` — untouched (behaviors preserved: initial `visible=false` renders null, `onClose`/`onImport` callbacks fire synchronously).

## Critical Files Referenced

- `/Users/andres/conductor/workspaces/habit_tracking_app/tel-aviv-v1/src/components/FullsizeTemplatePreview/FullsizeTemplatePreview.tsx`
- `/Users/andres/conductor/workspaces/habit_tracking_app/tel-aviv-v1/src/components/FullsizeTemplatePreview/hooks/useEntranceAnimations.ts` (reference only — read shared-value shape)
- `/Users/andres/conductor/workspaces/habit_tracking_app/tel-aviv-v1/src/components/FullsizeTemplatePreview/hooks/useAnimatedStyles.ts` (reference only — confirms which styles the shared values drive)
- `/Users/andres/conductor/workspaces/habit_tracking_app/tel-aviv-v1/src/components/FullsizeTemplatePreview/hooks/index.ts`
- `/Users/andres/conductor/workspaces/habit_tracking_app/tel-aviv-v1/src/constants/motion.ts` (source of `Motion.easing.inCubic`, `Motion.duration.exit`)
- `/Users/andres/conductor/workspaces/habit_tracking_app/tel-aviv-v1/src/screens/TemplatesScreen/hooks/useTemplateImportHandlers.ts` (reference only — confirms auto-close path at line 60-63)

## Reused Patterns

- `Motion.easing.inCubic` from `src/constants/motion.ts:25` — inverse of entrance's `Easing.out(Easing.cubic)`.
- 280ms unmount delay mirrors `useViewNavigation.ts:37-38` (`setTimeout(onComplete, 280)`).
- `useRef` pattern for timeout handles matches `useTemplateImportHandlers.ts:12-20`.

## Verification

### Manual (primary — UI animation, can't be tested by type/lint alone)

1. `npm run start` (or current dev workflow).
2. Navigate to Templates/Library screen.
3. Tap a habit card to open the full-size preview.
4. Tap **back** button (top-left chevron). **Expect:** content slides down ~60px while fading to transparent over ~260ms, backdrop fades, close button snaps out. No hard cut.
5. Tap **X** button (top-right). **Expect:** same smooth exit.
6. Open preview, tap **Customize** button. **Expect:** smooth exit before customize modal appears (template freeze prevents mid-animation swap).
7. Open preview, tap **Add to my habits**. Wait for success state → 1000ms auto-close. **Expect:** smooth exit, not hard cut.
8. **Reduced motion test:** enable iOS/Android reduce motion in OS settings. Tap back. **Expect:** instant close, no 280ms hold on a faded screen.
9. **Rapid toggle test:** open card A, immediately back, immediately open card B. **Expect:** card B renders without flicker; no orphaned unmount.

### Automated

- `npx tsc --noEmit` — verify no type errors from new hooks or prop shape changes.
- `npm test -- FullsizeTemplatePreview` — existing test suite should still pass (initial render with `visible=false`, close/import handlers fire synchronously).
- `npm run lint` — new files must respect the 100-line `max-lines` rule (both new hooks are well under).

### Screenshot comparison (per project feedback in memory)

Screenshot the back transition on a local build and visually confirm it matches the intent: a symmetric, subdued mirror of the entrance — not a double-slide, not a pop, not a jarring cut.
