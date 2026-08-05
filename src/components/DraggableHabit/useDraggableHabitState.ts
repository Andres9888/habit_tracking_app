/**
 * useDraggableHabitState — Derives all non-animated visual state for DraggableHabit.
 *
 * Combines {@link useDraggableHabitLogic} (emoji, name, accentColor) with
 * memoised computed values: card colors, week-complete flag, strength percentage,
 * and whether the current streak is a new personal record.
 */

import { useMemo } from 'react';
import { useDraggableHabitLogic } from './DraggableHabit.hooks';
import { getCardColors } from './colorUtils';
import { getStrengthPercent } from './strengthUtils';
import type { DraggableHabitProps } from './types';

type HabitData = DraggableHabitProps['habit'];
type WeekStatus = DraggableHabitProps['weekStatus'];

interface DraggableHabitStateOptions {
  habit: HabitData;
  previousStreak?: number;
  streak: number;
  weekStatus: WeekStatus;
}

export const useDraggableHabitState = ({
  habit,
  previousStreak,
  streak,
  weekStatus,
}: DraggableHabitStateOptions) => {
  const { emoji, name, accentColor } = useDraggableHabitLogic(habit);

  // Week-independent state. Kept OFF the weekStatus dependency so that
  // navigating the calendar week does not give `colors`/`strengthPercent` new
  // identities — otherwise the memoized CardHeader/StrengthProgressBar would
  // re-render on every week change even though nothing they show has changed.
  const derivedState = useMemo(() => {
    const bestStreak = habit.bestStreak || 0;
    const isNewPersonalRecord =
      previousStreak !== undefined &&
      streak > bestStreak &&
      streak > (previousStreak || 0);
    const strengthPercent = getStrengthPercent(habit.strength);
    const colors = getCardColors();

    return {
      bestStreak,
      colors,
      isNewPersonalRecord,
      strengthPercent,
    };
  }, [habit, previousStreak, streak]);

  // Only the perfect-week badge depends on the visible week.
  const isWeekComplete = useMemo(
    () => weekStatus.filter((s) => s === 'done').length === 7,
    [weekStatus]
  );

  return {
    accentColor,
    emoji,
    name,
    isWeekComplete,
    ...derivedState,
  };
};
