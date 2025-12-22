# Motivation Tab UX Improvements

## Overview
Enhance the Motivation tab with animations and visual polish to make it more engaging and encourage users to fill out their motivation sections.

## Design Mock
See: `.superdesign/design_iterations/motivation_tab_ux_1.html`

## Tasks

### T1: Staggered Entrance Animations
- [x] T1.1: Create `AnimatedSection` wrapper component with staggered entrance
  - **Completed**: Created `AnimatedSection` component in `HabitDetailScreen.tsx:411-462` with spring-based slide-up animation
- [x] T1.2: Apply 80ms stagger delay between sections (Your Why → Identity → Cue → Vision Board → Affirmations → Mental Exercises)
  - **Completed**: Applied 80ms stagger via `index * STAGGER_DELAY` in AnimatedSection. Wrapped all 7 sections with indexes 0-6
- [x] T1.3: Use `Springs.gentle` for slide-up animation with slight overshoot
  - **Completed**: Using `damping: 28, stiffness: 180, mass: 1.2` (Springs.gentle values) for natural spring motion
- [x] T1.4: Respect `reduceMotion` preference - skip animations if enabled
  - **Completed**: AnimatedSection checks `reduceMotion` prop and sets final values immediately without animation
- [x] T1.5: Only animate on first tab switch to Motivation (not on every render)
  - **Completed**: Added `hasVisitedMotivation` state and `shouldAnimateMotivation` computed value. Resets when modal closes/reopens

### T2: Progress Checkmarks
- [x] T2.1: Add completion checkmark badge to filled sections (Why, Identity, Cue)
  - **Completed**: Created `CompletionCheckmark` component in `HabitDetailScreen.tsx:480-554`. Added to all three sections (Your Why, Your Identity, Your Cue)
- [x] T2.2: Animate checkmark with pop-in effect (scale 0 → 1.2 → 1)
  - **Completed**: Using `withSequence` with `Springs.bouncy` (damping: 8, stiffness: 300) for overshoot, then settling spring
- [x] T2.3: Position badge at top-right of section icon
  - **Completed**: Positioned with `absolute`, `top: -4`, `right: -4` on parent View with `relative` class
- [x] T2.4: Use emerald-500 background with white check icon
  - **Completed**: `bg-emerald-500` background, white `Check` icon with `size={12}` and `strokeWidth={3}`
- [x] T2.5: Delay checkmark animation until after section entrance (600ms)
  - **Completed**: `BASE_CHECKMARK_DELAY = 600` plus staggered delay based on section index (0/80/160ms)

### T3: Improved Empty States
- [x] T3.1: Add subtle pulse animation to empty section icons
  - **Completed**: Created `PulsingIcon` component in `HabitDetailScreen.tsx:558-636` with opacity (0.5→1) and scale (1→1.05) pulse animation using 2000ms loop
  - Applied to Your Why, Your Identity, Your Cue icons when sections are empty, Vision Board and Affirmations empty state icons
- [x] T3.2: Add helpful tip text for empty Cue section ("Habits with cues are 2x more likely to stick")
  - **Completed**: Added Lightbulb icon + tip text in amber-colored badge: "Habits with cues are 2x more likely to stick" at `HabitDetailScreen.tsx:1228-1234`
- [x] T3.3: Add "Set up" action hint with plus icon for empty sections
  - **Completed**: Added "Set up" hints with Plus icon to Your Why (rose-600), Your Identity (violet-600), Your Cue (amber-600), Vision Board ("Add a vision" in violet-600), and Affirmations ("Add affirmation" in emerald-600)
- [x] T3.4: Use gradient backgrounds for empty state containers (subtle shimmer optional)
  - **Completed**: Added LinearGradient backgrounds to Vision Board empty state (#faf5ff → #f3e8ff, violet gradient) and Affirmations empty state (#ecfdf5 → #d1fae5, emerald gradient)

### T4: Section Card Press Feedback
- [ ] T4.1: Add scale animation on press (0.98) using `Springs.button`
- [ ] T4.2: Ensure press feedback works alongside entrance animations
- [ ] T4.3: Add subtle shadow elevation change on press

### T5: Testing & Cleanup
- [ ] T5.1: Test animations on low-end device for performance
- [ ] T5.2: Verify reduce motion preference is respected throughout
- [ ] T5.3: Test tab switching doesn't re-trigger entrance animations
- [ ] T5.4: Remove any debug console.logs

## Animation Specifications

### Entrance Animation
- **Type**: Slide up + fade in
- **Duration**: ~500ms (spring-based)
- **Stagger**: 80ms between sections
- **Spring**: `Springs.gentle` (damping: 28, stiffness: 180, mass: 1.2)
- **Initial state**: opacity: 0, translateY: 24

### Checkmark Pop
- **Type**: Scale with overshoot
- **Duration**: ~400ms
- **Spring**: `Springs.bouncy` (damping: 8, stiffness: 300)
- **Sequence**: scale 0 → 1.2 → 1
- **Delay**: 600ms after section entrance

### Empty State Pulse
- **Type**: Opacity + scale pulse
- **Duration**: 2000ms
- **Loop**: Infinite
- **Values**: opacity 0.5 → 1 → 0.5, scale 1 → 1.05 → 1

### Press Feedback
- **Type**: Scale down
- **Value**: 0.98
- **Spring**: `Springs.button` (damping: 15, stiffness: 300)

## Dependencies
- Uses existing `Springs` constants from `src/constants/motion.ts`
- Uses existing `SectionCard` component
- Uses existing `reduceMotion` hook
