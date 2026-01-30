/**
 * Types for YourWhySection component
 */

export interface YourWhySectionProps {
  /** The habit's "why" statement (undefined if not set) */
  why: string | undefined;
  /** Callback when user taps to edit/add their why */
  onPress: () => void;
  /** Whether to run entrance animations (first tab visit only) */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
}
