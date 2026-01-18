import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

export interface DailyMomentumMeterProps {
  /** Number of habits completed today */
  completedToday: number;
  /** Total number of habits */
  totalHabits: number;
  /** Whether to reduce motion */
  reduceMotion?: boolean;
  /** Size of the progress indicator */
  size?: 'compact' | 'standard';
}

export interface ProgressColors {
  bg: string;
  fill: string;
  text: string;
  glow: string;
}

export interface MotivationalMessage {
  text: string;
  icon: ComponentType<SvgProps>;
  emoji: string;
}
