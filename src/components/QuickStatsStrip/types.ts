/**
 * QuickStatsStrip Types
 */

export interface QuickStatsStripProps {
  /** Key to trigger animation replay (e.g., increment when modal opens) */
  animationKey?: number;
  currentStreak: number;
  habitStrength: number;
  onStatPress?: (statType: 'streak' | 'strength' | 'success') => void;
  successRate: number;
}

export interface StatCardProps {
  accessibilityHint?: string;
  animationKey?: number;
  color: string;
  colorStyle?: string;
  delay: number;
  emoji: string;
  label: string;
  onPress?: () => void;
  reduceMotion: boolean;
  suffix?: string;
  targetValue: number;
}
