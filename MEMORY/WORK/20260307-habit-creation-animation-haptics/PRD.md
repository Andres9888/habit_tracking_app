---
task: Best animation and haptics for habit creation flow
slug: 20260307-habit-creation-animation-haptics
effort: standard
phase: complete
progress: 10/10
mode: interactive
started: 2026-03-07T12:00:00-06:00
updated: 2026-03-07T12:01:00-06:00
---

## Context

Improving the habit creation workflow UX — the flow from tapping the FAB plus button to the modal appearing, interacting with it, and dismissing it. Two concerns: (1) determine the best animation approach using UX principles, and (2) add haptic feedback at every meaningful interaction point.

Current state: Modal uses stock RN `animationType='slide'`, swipe dismiss has spring snap-back but no exit animation, haptics only on FAB press (toggle pattern). Close button, save button, and swipe dismiss have no haptic feedback.

### Risks

- Spring-based custom animation could feel worse than stock if miscalibrated
- Too many haptic events could feel noisy rather than premium

## Criteria

- [x] ISC-1: UX analysis of animation options documented with framework references
- [x] ISC-2: Animation recommendation chosen based on UX analysis
- [x] ISC-3: Modal open uses spring-based slide-up animation (not stock)
- [x] ISC-4: Modal close uses spring-based slide-down animation (not stock)
- [x] ISC-5: Backdrop fades in/out synchronized with sheet position
- [x] ISC-6: Close button (X) fires haptic feedback on press
- [x] ISC-7: Save/Create button fires haptic success on successful creation
- [x] ISC-8: Swipe-to-dismiss fires haptic when threshold crossed
- [x] ISC-9: TypeScript compiles with no new errors
- [x] ISC-10: All changed files stay under 100 lines

## Decisions

- Spring-based slide chosen over stock ease curve — closer to Apple's own UIKit sheet behavior
- `springs.bottomSheet` for enter, `springs.exit` for close — asymmetric timing matches Material "enter decelerate, exit accelerate"
- Haptics: light tap for close, ultra-light selection for swipe threshold — lower energy for dismissal vs creation
- Save/Create success haptic already exists in useModalCleanup — no duplicate needed

## Verification

- ISC-1: First Principles analysis with Apple HIG, Material Design, Nielsen heuristics
- ISC-2: Spring-based slide with bottomSheet/exit springs chosen
- ISC-3: withSpring(0, springs.bottomSheet) on enter
- ISC-4: withSpring(SCREEN_HEIGHT, springs.exit) on close
- ISC-5: Backdrop opacity tracks sheet position proportionally
- ISC-6: triggerHaptic('tap') on close button press
- ISC-7: Pre-existing triggerSuccess in useModalCleanup
- ISC-8: HapticPatterns.tap on swipe dismiss threshold
- ISC-9: tsc --noEmit clean
- ISC-10: 98/88/65 lines — all under 100
