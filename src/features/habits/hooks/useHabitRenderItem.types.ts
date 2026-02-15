/**
 * Type definitions for useHabitRenderItem hook
 */

import type { Habit, HabitStatus } from '../types';
import type { HabitCardEntranceVariant } from '../../../components/HabitCard/useHabitCardEntrance';
import type { Id } from '../../../../convex/_generated/dataModel';

export interface UseHabitRenderItemArgs {
  celebrationsEnabled: boolean;
  completionIcon: 'chain' | 'checkbox';
  dayShape?: 'circle' | 'square';
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  getStreak: (habitId: string) => number;
  handleArchive: (habitId: Id<'habits'>) => Promise<void> | void;
  handleHabitPress: (habit: Habit) => void;
  highlightHabitId?: Id<'habits'> | null;
  isReorderingEnabled: boolean;
  notifyWeekCompletion: (args: { habit: Habit; completedDate: string }) => void;
  reduceMotionPreference: boolean;
  showConnectors?: boolean;
  showHabitStrengthPercentage?: boolean;
  toggleHabit: (args: {
    habitId: Id<'habits'>;
    date: string;
  }) => Promise<unknown> | void;
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
}
