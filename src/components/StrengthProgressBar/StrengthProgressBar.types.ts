/**
 * StrengthProgressBar Types
 */

export interface StrengthProgressBarProps {
  /** Strength value (0-100) */
  strength: number;
  /** Previous strength value for delta display (optional) */
  previousStrength?: number;
  /** Size variant */
  size?: 'compact' | 'default' | 'large';
  /** Show dividers at level thresholds */
  showDividers?: boolean;
  /** Show level emoji */
  showEmoji?: boolean;
  /** Show info tooltip button */
  showInfo?: boolean;
  /** Show level label text */
  showLabel?: boolean;
  /** Show next level hint */
  showNextLevel?: boolean;
  /** Show percentage text */
  showPercentage?: boolean;
}

export interface LevelConfig {
  color: string;
  colorBg: string;
  emoji: string;
  label: string;
  threshold: number;
}

export interface SizeConfig {
  barHeight: number;
  emojiContainerSize: number;
  emojiSize: number;
  fontSize: number;
  gap: number;
}
