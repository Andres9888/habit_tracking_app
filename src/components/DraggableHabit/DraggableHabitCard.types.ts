
import type { AnimatedStyle } from 'react-native-reanimated';
import type { Animated } from 'react-native';

import type { CardColors, Habit, HabitStatus } from './types';
import type { Id } from '../../../convex/_generated/dataModel';

/** Animated style type for strength emoji */
export type StrengthEmojiAnimatedStyle = AnimatedStyle;

/** Animated style type for progress bar width */
export type ProgressAnimatedStyle = AnimatedStyle;

export interface DraggableHabitCardProps {
  accentColor: string;
  archiveFlash: Animated.Value;
  bestStreak: number;
  cardScale: Animated.Value;
  celebrationsEnabled: boolean;
  colors: CardColors;
  completionIcon: 'chain' | 'checkbox';
  dayShape: 'circle' | 'square';
  emoji: string;
  entranceAccentStyle: object;
  entranceCardStyle: object;
  entranceContentStyle: object;
  fade: Animated.Value;
  habit: Habit;
  handleLongPress: () => void;
  handlePressIn: () => void;
  handlePressOut: () => void;
  handleSwipeableOpen: () => void;
  highContrastMode: boolean;
  highlightGlow: Animated.Value;
  iconPulse: Animated.Value;
  isDark: boolean;
  isConnectedToNextWeek: boolean;
  isConnectedToPreviousWeek: boolean;
  isWeekComplete: boolean;
  name: string;
  newRecordOpacity: Animated.Value;
  newRecordScale: Animated.Value;
  onArchive?: (habitId: Id<'habits'>) => void;
  onPress?: (habit: Habit) => void;
  onWeekComplete?: (args: { habit: Habit; completedDate: string }) => void;
  reduceMotionPreference: boolean;
  showConnectors: boolean;
  showGradientFill: boolean;
  showHabitStrengthPercentage: boolean;
  showNewRecord: boolean;
  streak: number;
  strengthEmojiAnimatedStyle: StrengthEmojiAnimatedStyle;
  strengthFillStyle: AnimatedStyle;
  strengthPercent: number;
  progressAnimatedStyle: ProgressAnimatedStyle;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => void;
  translateY: Animated.Value;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
}
