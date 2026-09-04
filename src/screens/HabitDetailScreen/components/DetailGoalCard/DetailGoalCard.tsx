/**
 * DetailGoalCard — the streak goal, on the detail screen rather than behind a
 * disclosure on History.
 *
 * The ladder always renders. With no stored target it runs on
 * `suggestedGoal(bestStreak)` and says so in the eyebrow; nothing is written
 * until the reader opens Change. Sending people to a picker first meant almost
 * nobody had a goal, and the ladder — the whole motivational device — never
 * rendered. The Adjust sheet stays the only place a number is chosen, changed
 * or removed.
 */
import { useState } from 'react';
import type { Habit } from '../../../../features/habits/types';
import { useThemeColors } from '../../../../theme';
import { pickUsableAccent } from '../../../../theme/iconTokens/usableAccent';
import { useInsightPalette } from '../../insightPalette';
import { GoalAdjustSheet } from '../GoalAdjustSheet';
import { GoalSetCard } from './GoalSetCard';
import { suggestedGoal } from './presets';

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
  const [sheetOpen, setSheetOpen] = useState(false);

  const storedGoal = habit.goalDuration ?? 0;
  const bestStreak = habit.bestStreak ?? 0;
  const suggested = storedGoal <= 0;
  const goal = suggested ? suggestedGoal(bestStreak) : storedGoal;

  return (
    <>
      <GoalSetCard
        bestStreak={bestStreak}
        currentStreak={currentStreak}
        goal={goal}
        loggedToday={loggedToday}
        palette={palette}
        suggested={suggested}
        onChange={() => setSheetOpen(true)}
      />
      <GoalAdjustSheet
        currentGoal={storedGoal}
        currentStreak={currentStreak}
        habitColor={
          pickUsableAccent(habit.color, habit.iconColor) ?? colors.primary[700]
        }
        habitId={habit._id}
        initialGoal={goal}
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
