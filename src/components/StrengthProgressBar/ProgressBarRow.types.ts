/**
 * ProgressBarRow Types
 */

import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import type { SizeConfig } from './StrengthProgressBar.constants';

export interface ProgressBarRowProps {
  config: SizeConfig;
  currentLevel: { emoji: string; color: string };
  emojiAnimatedStyle: AnimatedStyle<ViewStyle>;
  nextLevel?: { emoji: string } | null;
  progressAnimatedStyle: AnimatedStyle<ViewStyle>;
  showDividers: boolean;
  showEmoji: boolean;
  showNextLevel: boolean;
  showPercentage: boolean;
  strength: number;
  strengthLabel: string;
}
