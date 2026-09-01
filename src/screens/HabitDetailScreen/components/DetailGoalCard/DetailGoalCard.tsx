/**
 * DetailGoalCard — the streak goal, on the detail screen rather than behind a
 * disclosure on History.
 *
 * Two states from the Habit Detail Prototype: an inline picker while no target
 * exists, and the ladder once one does. Both own the same Adjust sheet, which
 * is the only place a non-preset number can be chosen or a goal removed.
 */
import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Habit } from '../../../../features/habits/types';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { useThemeColors } from '../../../../theme';
import { useInsightPalette } from '../../insightPalette';
import { GoalAdjustSheet } from '../GoalAdjustSheet';
import { GoalSetCard } from './GoalSetCard';
import { GoalUnsetCard } from './GoalUnsetCard';

interface DetailGoalCardProps {
  /** Log-derived. Never `habit.currentStreak`; that field is not recomputed on a miss. */
  currentStreak: number;
  habit: Habit;
  loggedToday: boolean;
}

export function DetailGoalCard({
  currentStreak,
  habit,
  loggedToday,
}: DetailGoalCardProps) {
  const palette = useInsightPalette();
  const { colors } = useThemeColors();
  const { triggerSuccess } = useHapticFeedback();
  const updateHabit = useMutation(api.habits.update);
  const [sheetOpen, setSheetOpen] = useState(false);

  const goal = habit.goalDuration ?? 0;
  const bestStreak = habit.bestStreak ?? 0;

  const pick = (days: number) => {
    triggerSuccess();
    void updateHabit({ goalDuration: days, habitId: habit._id });
  };

  return (
    <>
      {goal > 0 ? (
        <GoalSetCard
          bestStreak={bestStreak}
          currentStreak={currentStreak}
          goal={goal}
          loggedToday={loggedToday}
          palette={palette}
          onChange={() => setSheetOpen(true)}
        />
      ) : (
        <GoalUnsetCard
          bestStreak={bestStreak}
          currentStreak={currentStreak}
          palette={palette}
          onCustom={() => setSheetOpen(true)}
          onPick={pick}
        />
      )}
      <GoalAdjustSheet
        currentGoal={goal}
        currentStreak={currentStreak}
        habitColor={habit.color ?? habit.iconColor ?? colors.primary[700]}
        habitId={habit._id}
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
