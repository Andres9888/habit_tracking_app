/**
 * Types for IdentitySection component
 */

export interface IdentitySectionProps {
  /** The habit's identity statement (undefined if not set) */
  identity: string | undefined;
  /** Callback when user taps to edit/add their identity */
  onPress: () => void;
  /** Whether to run entrance animations (first tab visit only) */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
}
