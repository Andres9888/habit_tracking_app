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
 * Canonical entrance pattern:
 *   FadeInDown.duration(durations.enter).easing(enterEasing)
 */

import { Easing } from 'react-native-reanimated';

/**
 * Duration Scale (milliseconds)
 */
export const durations = {
  /** Confetti, particles */
  celebration: 3000,

  /** Multi-step animations, onboarding */
  complex: 600,

  /** Draw attention, complex sequences */
  emphasis: 400,

  /** Floating, drifting motion loops */
  drift: 2000,

  /** Screen/card entry */
  enter: 280,

  /**
   * Bottom-sheet enter/exit. Matches native iOS Modal animationType='slide'
   * cadence (~360ms) used by Settings and Templates so all modal surfaces
   * feel paced the same, even though Create/Edit are bottom sheets rather
   * than full-screen modals.
   */
  sheet: 360,

  /** Button presses, toggles — immediate feedback */
  instant: 100,

  /** Spinner rotations, repeating pulse loops */
  loop: 1000,

  /** Medium emphasis, page transitions */
  moderate: 300,

  /** Breathing animations, glow pulses */
  breathing: 1500,

  /** Progress bar fills, ring animations */
  progress: 800,

  /** Exit animations, small fades */
  quick: 150,

  /** Quick fades, small transitions */
  reveal: 180,

  /** Standard transitions */
  standard: 200,

  /** Emphasized transitions, exit animations */
  transition: 220,

  /** Stagger delay per item (max 5 items) */
  stagger: 60,

  /** Toast auto-dismiss */
  toast: 5000,
} as const;

/**
 * Easing Presets
 */
export const easings = {
  buttonPress: { duration: durations.instant },
  emphasis: { duration: durations.emphasis },
  quick: { duration: durations.quick },
  standard: { duration: durations.standard },
} as const;

/**
 * Spring Presets
 * All motion encodes hierarchy, state, or spatial relation.
 *
 * Design System Standard: damping 18, stiffness 150
 * This provides a consistent, snappy feel across all micro-interactions.
 */
export const springs = {
  /** Standard spring for all interactions - consistent feel */
  standard: { damping: 18, stiffness: 150 },

  /** Bottom sheet enter/exit — higher damping for stable slide */
  bottomSheet: { damping: 26, stiffness: 300 },

  /** Bouncy — celebrations only */
  bouncy: { damping: 10, stiffness: 180 },

  /** Button press/release — alias of standard for semantic clarity */
  button: { damping: 18, stiffness: 150 },

  /** Fast dismissal — minimal bounce */
  exit: { damping: 26, mass: 1, stiffness: 420 },

  /** Smooth reveals — minimal bounce */
  gentle: { damping: 20, stiffness: 100 },

  /** Direct manipulation snap-back */
  gesture: { damping: 20, mass: 1, stiffness: 450 },

  /** Subtle micro-interactions — alias of standard for semantic clarity */
  micro: { damping: 18, stiffness: 150 },

  /** Attention pulse / glow */
  pulse: { damping: 12, stiffness: 250 },

  /** Modal/sheet presentations */
  sheet: { damping: 20, stiffness: 200 },

  /** Quick response — alias of standard for semantic clarity */
  snappy: { damping: 18, stiffness: 150 },

  /** Celebration bounce — completion badges, progress pops */
  celebration: { damping: 12, stiffness: 200 },

  /** Explosive pop — confetti scale, fast expansion */
  pop: { damping: 8, stiffness: 300 },

  /** Responsive button — snappy interactive feedback */
  responsive: { damping: 15, stiffness: 300 },

  /** Heavy settling — high damping for stable modal/sheet transitions */
  settle: { damping: 28, mass: 1, stiffness: 180 },
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

export type Duration = keyof typeof durations;
export type Spring = keyof typeof springs;
