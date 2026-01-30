/**
 * Type definitions for GenerateAffirmationsButton
 */

export interface GeneratedAffirmation {
  text: string;
  type: 'identity' | 'motivational' | 'instructional';
}

export interface GenerateAffirmationsButtonProps {
  /** Whether user has premium access (AI generation is premium-only) */
  isPremium: boolean;
  /** Whether generation is currently in progress */
  isGenerating: boolean;
  /** Callback when generate is pressed */
  onGenerate: () => Promise<void>;
  /** Callback when user needs to upgrade to premium */
  onPremiumRequired: () => void;
  /** Whether to reduce motion for accessibility */
  reduceMotion?: boolean;
  /** Current number of affirmations (to show remaining slots) */
  currentCount?: number;
  /** Maximum allowed affirmations per habit */
  maxCount?: number;
  /** Variant: 'compact' for inline display, 'full' for standalone */
  variant?: 'compact' | 'full';
  /** Whether there's habit context available for better generation */
  hasHabitContext?: boolean;
}
