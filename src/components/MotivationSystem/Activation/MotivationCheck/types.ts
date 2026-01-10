/**
 * MotivationCheck Types
 *
 * Type definitions for the motivation check component
 */

/** Motivation level enum */
export type MotivationLevel = 'not_motivated' | 'meh' | 'ready';

export interface MotivationCheckProps {
  /** Currently selected motivation level */
  selectedLevel?: MotivationLevel;
  /** Callback when user selects a motivation level */
  onSelectLevel: (level: MotivationLevel) => void;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Whether to show the science explainer link */
  showExplainer?: boolean;
  /** Callback when user taps the explainer link */
  onExplainerPress?: () => void;
  /** Optional className for container styling */
  className?: string;
  /** Compact mode for inline display */
  compact?: boolean;
}

export interface MotivationButtonProps {
  emoji: string;
  label: string;
  isSelected: boolean;
  onPress: () => void;
  reduceMotion?: boolean;
  accentColor: 'rose' | 'amber' | 'emerald';
}

export interface MotivationOption {
  level: MotivationLevel;
  emoji: string;
  label: string;
  showsFailure: boolean;
}
