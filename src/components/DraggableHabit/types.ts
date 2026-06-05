/**
 * @module DraggableHabit/types
 *
 * Core type definitions for the DraggableHabit component family.
 *
 * This file defines the domain types (Habit, HabitStatus) and the top-level
 * component props (DraggableHabitProps). For the internal card-level props
 * used after state/animation computation, see {@link DraggableHabitCard.types.ts}.
 */

import type { Doc, Id } from '../../../convex/_generated/dataModel';
import type { HabitCardEntranceVariant } from '../HabitCard/useHabitCardEntrance';
import type { PartialProgressEmojiSet } from '../../utils/progressEmojis';

/** Completion status for a single day in the week view. */
export type HabitStatus = 'done' | 'missed' | 'planned';

export type Habit = Doc<'habits'>;

/**
 * Props for the top-level `<DraggableHabit>` component.
 *
 * This is the public API consumed by the habits list. Internally,
 * DraggableHabit derives additional state (colors, animations, press handlers)
 * and passes a flattened {@link DraggableHabitCardProps} to the card renderer.
 */
export interface DraggableHabitProps {
  celebrationsEnabled: boolean;
  completionIcon?: 'chain' | 'checkbox';
  dayShape?: 'circle' | 'square';
  /** Stagger delay (ms) for entrance animation in a list. */
  entranceDelay?: number;
  entranceVariant?: HabitCardEntranceVariant;
  enableTodayPulse?: boolean;
  habit: Habit;
  highContrastMode?: boolean;
  isCompactMode?: boolean;
  isConnectedToNextWeek?: boolean;
  isConnectedToPreviousWeek?: boolean;
  /** True on the render immediately after the user creates this habit. */
  isJustCreated?: boolean;
  isPaused?: boolean;
  onArchive?: (habitId: Id<'habits'>) => void;
  onDelete?: (habitId: Id<'habits'>) => void;
  onEntranceComplete?: () => void;
  onLongPress?: ((habit?: Habit) => void) | (() => void);
  onPause?: (habitId: Id<'habits'>) => void;
  onPress?: (habit: Habit) => void;
  onResume?: (habitId: Id<'habits'>) => void;
  onWeekComplete?: (args: { habit: Habit; completedDate: string }) => void;
  /** Previous streak value — used to detect new personal records. */
  previousStreak?: number;
  reduceMotionPreference: boolean;
  showConnectors?: boolean;
  showGradientFill?: boolean;
  showHabitStrengthPercentage?: boolean;
  streak: number;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => void;
  triggerEntrance?: boolean;
  userProgressEmojis?: PartialProgressEmojiSet;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
  /** Selection mode: whether this card is currently selected. */
  isSelected?: boolean;
  /** Selection mode: show the selection checkbox overlay. */
  showSelectionOverlay?: boolean;
  /** Selection mode: called when the checkbox is toggled. */
  onToggleSelection?: () => void;
  /** Nudge the Details pill on first card while the coach hint is visible. */
  enableChevronNudge?: boolean;
}

/**
 * Resolved color tokens for rendering a habit card.
 * Computed once by {@link getCardColors} and threaded through sub-components.
 */
export interface CardColors {
  border: string;
  cardBackground: string;
  iconContainer: string | undefined;
  primaryText: string;
  streakText: string;
  strengthBackground: string;
}
