/**
 * WOOPSection Types
 */

export interface WOOPData {
  /** Wish - what you want to achieve */
  wish?: string;
  /** Outcome - best result from achieving the wish */
  outcome?: string;
  /** Obstacle - main inner obstacle preventing you */
  obstacle?: string;
  /** Plan - IF obstacle THEN action */
  plan?: string;
}

export interface WOOPSectionProps {
  /** The habit's WOOP data */
  woop: WOOPData | undefined;
  /** Callback when user taps to edit/add their WOOP */
  onPress: () => void;
  /** Whether to run entrance animations (first tab visit only) */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
}
