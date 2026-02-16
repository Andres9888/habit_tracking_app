/**
 * @module DraggableHabit/DraggableHabitCard.types
 *
 * Props for the internal `<DraggableHabitCard>` component.
 *
 * These are the *resolved* props — all hooks have already run in the parent
 * `<DraggableHabit>`, producing animated values, derived state, and press
 * handlers that are passed down here for pure rendering.
 *
 * Relationship:
 *   DraggableHabitProps (types.ts)          — public API, minimal
 *   → DraggableHabit computes state/animations
 *   → DraggableHabitCardProps (this file)   — fully resolved, internal
 */

import type { Animated } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { Id } from '../../../convex/_generated/dataModel';
import type { CardColors, Habit, HabitStatus } from './types';

/** Animated style for the strength emoji (scale + rotate on level-up). */
export type StrengthEmojiAnimatedStyle = AnimatedStyle;

/** Animated style for the progress bar width (percentage-based). */
export type ProgressAnimatedStyle = AnimatedStyle;

/**
 * Full prop set for the internal `<DraggableHabitCard>` renderer.
 *
 * Includes:
 * - Derived state (colors, emoji, name, streaks, strength)
 * - Animated values from useDraggableHabitAnimations
 * - Press/swipe handlers from usePressHandlers
 * - Entrance animation styles from useHabitCardEntrance
 * - Strength fill/progress styles from Reanimated hooks
 */
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
  onLongPress?: () => void;
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
