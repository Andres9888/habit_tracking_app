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

import type { TextStyle, ViewStyle } from 'react-native';
import type { AnimatedStyle, SharedValue } from 'react-native-reanimated';
import type { Id } from '../../../convex/_generated/dataModel';
import type { CardColors, Habit, HabitStatus } from './types';
import type { PartialProgressEmojiSet } from '../../utils/progressEmojis';

/** Animated style for the strength emoji (scale + rotate on level-up). */
export type StrengthEmojiAnimatedStyle = AnimatedStyle<TextStyle>;

/** Animated style for the progress bar width (percentage-based). */
export type ProgressAnimatedStyle = AnimatedStyle<ViewStyle>;

/**
 * Full prop set for the internal `<DraggableHabitCard>` renderer.
 *
 * Includes:
 * - Derived state (colors, emoji, name, streaks, strength)
 * - SharedValues from useDraggableHabitAnimations (all reanimated)
 * - Press/swipe handlers from usePressHandlers
 * - Entrance animation styles from useHabitCardEntrance
 * - Strength fill/progress styles from Reanimated hooks
 */
export interface DraggableHabitCardProps {
  accentColor: string;
  bestStreak: number;
  cardScale: SharedValue<number>;
  celebrationsEnabled: boolean;
  colors: CardColors;
  completionIcon: 'chain' | 'checkbox';
  dayShape: 'circle' | 'square';
  emoji: string;
  entranceAccentStyle: object;
  entranceCardStyle: object;
  entranceContentStyle: object;
  fade: SharedValue<number>;
  habit: Habit;
  handleLongPress: () => void;
  handlePressIn: () => void;
  handlePressOut: () => void;
  highlightGlow: SharedValue<number>;
  iconPulse: SharedValue<number>;
  isCompactMode?: boolean;
  isDark: boolean;
  isConnectedToNextWeek: boolean;
  isConnectedToPreviousWeek: boolean;
  isPaused: boolean;
  isWeekComplete: boolean;
  name: string;
  newRecordOpacity: SharedValue<number>;
  newRecordScale: SharedValue<number>;
  onArchive?: (habitId: Id<'habits'>) => void;
  onDelete?: (habitId: Id<'habits'>) => void;
  onPause?: (habitId: Id<'habits'>) => void;
  onPress?: (habit: Habit) => void;
  onResume?: (habitId: Id<'habits'>) => void;
  onWeekComplete?: (args: { habit: Habit; completedDate: string }) => void;
  reduceMotionPreference: boolean;
  showConnectors: boolean;
  showGradientFill: boolean;
  showHabitStrengthPercentage: boolean;
  showNewRecord: boolean;
  streak: number;
  strengthEmojiAnimatedStyle: StrengthEmojiAnimatedStyle;
  strengthFillStyle: AnimatedStyle<ViewStyle>;
  strengthPercent: number;
  progressAnimatedStyle: ProgressAnimatedStyle;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => void;
  translateY: SharedValue<number>;
  userProgressEmojis?: PartialProgressEmojiSet;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
  /** Selection mode: whether this card is currently selected. */
  isSelected?: boolean;
  /** Selection mode: show the selection checkbox overlay. */
  showSelectionOverlay?: boolean;
  /** Selection mode: called when the checkbox is toggled. */
  onToggleSelection?: () => void;
}
