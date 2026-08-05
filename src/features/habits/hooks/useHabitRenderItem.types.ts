/**
 * Type definitions for useHabitRenderItem hook
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitStatus } from '../types';
import type { HabitCardEntranceVariant } from '../../../components/HabitCard/useHabitCardEntrance';

import type { PartialProgressEmojiSet } from '../../../utils/progressEmojis';

export interface UseHabitRenderItemArgs {
  celebrationsEnabled: boolean;
  compactView?: boolean;
  completionIcon: 'chain' | 'checkbox';
  dayShape?: 'circle' | 'square';
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  getStreak: (habitId: string) => number;
  handleArchive: (habitId: Id<'habits'>) => Promise<void> | void;
  handleDelete: (habitId: Id<'habits'>) => void;
  handleHabitPress: (habit: Habit) => void;
  highlightHabitId?: Id<'habits'> | null;
  isReorderingEnabled: boolean;
  notifyWeekCompletion: (args: { habit: Habit; completedDate: string }) => void;
  reduceMotionPreference: boolean;
  showConnectors?: boolean;
  showGradientFill?: boolean;
  showHabitStrengthPercentage?: boolean;
  toggleHabit: (args: {
    habitId: Id<'habits'>;
    date: string;
  }) => Promise<unknown> | void;
  userProgressEmojis?: PartialProgressEmojiSet;
  weekDateStrings: string[];
  /**
   * Animation variant for habit card entrance.
   * @default 'accentSlideDown'
   */
  entranceVariant?: HabitCardEntranceVariant;
  /**
   * Base stagger delay per card (multiplied by index).
   * @default 50
   */
  entranceStaggerDelay?: number;
  /**
   * Whether entrance animation should trigger.
   * @default false
   */
  shouldTriggerEntrance?: boolean;
  /** Set of habit IDs that have already appeared. */
  seenHabitIds?: Set<string>;
  /** Callback to mark a habit as "seen" after its entrance animation. */
  onHabitEntranceComplete?: (habitId: Id<'habits'>) => void;
  /** Selection mode: whether selection mode is active. */
  isSelectionMode?: boolean;
  /** Selection mode: set of currently selected habit IDs. */
  selectedIds?: Set<Id<'habits'>>;
  /** Selection mode: callback to toggle selection of a habit. */
  onToggleSelection?: (id: Id<'habits'>) => void;
}
