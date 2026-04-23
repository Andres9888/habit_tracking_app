/**
 * ProgressBarRow Types
 */

import type { ViewStyle } from 'react-native';
import type { SizeConfig } from './StrengthProgressBar.constants';

export interface ProgressBarRowProps {
  config: SizeConfig;
  currentLevel: { emoji: string; color: string };
  emojiAnimatedStyle: ViewStyle;
  nextLevel?: { emoji: string } | null;
  progressAnimatedStyle: ViewStyle;
  showDividers: boolean;
  showEmoji: boolean;
  showNextLevel: boolean;
  showPercentage: boolean;
  strength: number;
  strengthLabel: string;
}
