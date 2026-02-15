/**
 * useDraggableHabitState — Derives all non-animated visual state for DraggableHabit.
 *
 * Combines {@link useDraggableHabitLogic} (emoji, name, accentColor) with
 * memoised computed values: card colors, week-complete flag, strength percentage,
 * and whether the current streak is a new personal record.
 */

import { useMemo } from 'react';

import type { DraggableHabitProps } from './types';
import { getCardColors } from './colorUtils';
import { getStrengthPercent } from './strengthUtils';
import { useDraggableHabitLogic } from './DraggableHabit.hooks';

type HabitData = DraggableHabitProps['habit'];
type WeekStatus = DraggableHabitProps['weekStatus'];

interface DraggableHabitStateOptions {
  habit: HabitData;
  highContrastMode: boolean;
  previousStreak?: number;
  streak: number;
  weekStatus: WeekStatus;
}

export const useDraggableHabitState = ({
  habit,
  highContrastMode,
  previousStreak,
  streak,
  weekStatus,
}: DraggableHabitStateOptions) => {
  const { emoji, name, accentColor } = useDraggableHabitLogic(habit);

  const derivedState = useMemo(() => {
    const weekCompleteCount = weekStatus.filter((s) => s === 'done').length;
    const isWeekComplete = weekCompleteCount === 7;
    const bestStreak = habit.bestStreak || 0;
    const isNewPersonalRecord =
      previousStreak !== undefined &&
      streak > bestStreak &&
      streak > (previousStreak || 0);
    const strengthPercent = getStrengthPercent(habit.strength);
    const colors = getCardColors(highContrastMode);

    return {
      bestStreak,
      colors,
      isNewPersonalRecord,
      isWeekComplete,
      strengthPercent,
    };
  }, [habit, highContrastMode, previousStreak, streak, weekStatus]);

  return {
    accentColor,
    emoji,
    name,
    ...derivedState,
  };
};
