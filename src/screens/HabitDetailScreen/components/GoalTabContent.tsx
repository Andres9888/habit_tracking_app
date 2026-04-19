/**
 * GoalTabContent — Renders StreakGoalCard if a goal is set,
 * otherwise renders the empty-state preset picker.
 */
import Animated, { FadeInDown } from 'react-native-reanimated';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { StreakGoalCard } from '../../../components/ProgressSectionConsolidated/StreakGoalCard';
import type { Habit } from '../../../features/habits/types';
import { GoalTabEmptyState } from './GoalTabEmptyState';

interface GoalTabContentProps {
  habit: Habit;
  completionRate: number;
}

export function GoalTabContent({ habit, completionRate }: GoalTabContentProps) {
  const hasGoal = (habit.goalDuration ?? 0) > 0;
  return (
    <Animated.View entering={FadeInDown.duration(300).springify().damping(20)}>
      <ErrorBoundary>
        {hasGoal ? (
          <StreakGoalCard
            bestStreak={habit.bestStreak ?? habit.currentStreak ?? 0}
            completionRate={completionRate}
            currentStreak={habit.currentStreak ?? 0}
            streakGoal={habit.goalDuration ?? 0}
          />
        ) : (
          <GoalTabEmptyState habitId={habit._id} />
        )}
      </ErrorBoundary>
    </Animated.View>
  );
}
