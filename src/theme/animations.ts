/**
 * Animation Timing System - Habit Tracking App
 * Frontend Redesign Spec 2026-02-14
 *
 * Motion rules:
 * - Entry motion: fade + translateY, 280ms cubic ease-out (no springify)
 * - Hierarchy: 60ms stagger, max 5 items
 * - Feedback: spring-based, ≤100ms for taps
 * - Max 3 simultaneous moving elements per viewport
 * - No decorative loops, idle animations, or novelty motion
 *
 * This module is the single source of truth for motion tokens. Durations,
 * easings and spring presets all live here; nothing else may declare its own.
 *
 * Canonical entrance pattern:
 *   FadeInDown.duration(durations.enter).easing(enterEasing)
 */

import { Easing } from 'react-native-reanimated';

/**
 * Duration Scale (milliseconds)
 */
export const durations = {
  /** Sheet/modal backdrop fade — trails the sheet slide */
  backdrop: 180,

  /** Breathing animations, glow pulses */
  breathing: 1500,

  /** Confetti, particles */
  celebration: 3000,

  /** Multi-step animations, onboarding */
  complex: 600,

  /** Floating, drifting motion loops */
  drift: 2000,

  /** Draw attention, complex sequences */
  emphasis: 400,

  /** Screen/card entry */
  enter: 280,

  /** Button presses, toggles — immediate feedback */
  instant: 100,

  /** Spinner rotations, repeating pulse loops */
  loop: 1000,

  /** Medium emphasis, page transitions */
  moderate: 300,

  /** Progress bar fills, ring animations */
  progress: 800,

  /** Exit animations, small fades */
  quick: 150,

  /** Quick fades, small transitions */
  reveal: 180,

  /**
   * Bottom-sheet enter/exit. Matches the iOS sheet cadence used by
   * `NoteSheet` (300ms paired with `sheetEasing`) so every modal surface —
   * full-screen modal or bottom sheet — is paced the same.
   */
  sheet: 300,

  /** Stagger delay per item (max 5 items) */
  stagger: 60,

  /** Standard transitions */
  standard: 200,

  /** Toast auto-dismiss */
  toast: 5000,

  /** Emphasized transitions, exit animations */
  transition: 220,
} as const;

/**
 * Spring Presets — 7 canonical presets plus the `button` alias.
 * All motion encodes hierarchy, state, or spatial relation.
 *
 * Design System Standard: damping 18, stiffness 150
 * This provides a consistent, snappy feel across all micro-interactions.
 */
const standardSpring = { damping: 18, stiffness: 150 } as const;

export const springs = {
  /** Standard spring for all interactions - consistent feel */
  standard: standardSpring,

  /**
   * Button press/release — documented alias of `standard` (same object).
   * Kept for one release so semantic press call sites still read clearly.
   */
  button: standardSpring,

  /** Celebration bounce — completion badges, progress pops */
  celebration: { damping: 12, stiffness: 200 },

  /** Fast dismissal — minimal bounce */
  exit: { damping: 26, mass: 1, stiffness: 420 },

  /** Smooth reveals — minimal bounce */
  gentle: { damping: 20, stiffness: 100 },

  /** Direct manipulation snap-back */
  gesture: { damping: 20, mass: 1, stiffness: 450 },

  /** Explosive pop — confetti scale, fast expansion */
  pop: { damping: 8, stiffness: 300 },

  /** Modal/sheet presentations */
  sheet: { damping: 20, stiffness: 200 },
} as const;

/**
 * Canonical entrance easing — cubic ease-out.
 * Use with Reanimated entering animations instead of `.springify().damping(n)`.
 *
 * Example:
 *   entering={FadeInDown.duration(durations.enter).easing(enterEasing)}
 */
type EasingFn = (t: number) => number;
type EasingWrap = (easing: EasingFn) => EasingFn;
const identity: EasingFn = (t) => t;
const passthrough: EasingWrap = (easing) => easing;
const easingApi = Easing ?? {
  cubic: identity,
  in: passthrough,
  out: passthrough,
};

export const enterEasing = (easingApi.out ?? passthrough)(
  easingApi.cubic ?? identity
);

/** Canonical exit easing — cubic ease-in for collapses and dismissals. */
export const exitEasing = (easingApi.in ?? passthrough)(
  easingApi.cubic ?? identity
);

/**
 * Symmetric cubic for full-width slides (push/pop). Ease-in ends at 3× the
 * average speed, which strobes when a whole screen crosses the display.
 */
export const moveEasing = (easingApi.inOut ?? passthrough)(
  easingApi.cubic ?? identity
);

const fallbackBezier = (..._points: number[]): EasingFn => identity;
const bezier =
  (easingApi as { bezier?: typeof Easing.bezier }).bezier ?? fallbackBezier;

/** iOS sheet curve — pair with `durations.sheet` for slide in/out. */
export const sheetEasing = bezier(0.32, 0.72, 0, 1);

/** Strong ease-out for UI reveals that must settle without overshoot. */
export const uiEaseOut = bezier(0.23, 1, 0.32, 1);

export type Duration = keyof typeof durations;
export type Spring = keyof typeof springs;
