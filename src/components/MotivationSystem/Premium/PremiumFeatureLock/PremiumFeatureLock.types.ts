/**
 * PremiumFeatureLock Types
 */

/** Premium feature tiers for the Motivation System */
export type MotivationPremiumFeature =
  | 'voiceNotes'
  | 'letters'
  | 'visionBoard'
  | 'affirmations'
  | 'rescueMode'
  | 'advancedViz';

export interface PremiumFeatureLockProps {
  /** Which premium feature this lock represents */
  feature: MotivationPremiumFeature;
  /** Callback when user taps the upgrade CTA */
  onUpgrade: () => void;
  /** Optional callback for analytics tracking */
  onLockViewed?: (feature: MotivationPremiumFeature) => void;
  /** Display variant: 'inline' | 'overlay' | 'card' */
  variant?: 'inline' | 'overlay' | 'card';
  /** Whether to show the science-based explanation */
  showScience?: boolean;
  /** Whether to reduce motion for accessibility */
  reduceMotion?: boolean;
  /** Custom className for additional styling */
  className?: string;
  /** Test ID for testing */
  testID?: string;
}

export interface FeatureMeta {
  title: string;
  description: string;
  freeLimit?: string;
  scienceBasis: string;
}
