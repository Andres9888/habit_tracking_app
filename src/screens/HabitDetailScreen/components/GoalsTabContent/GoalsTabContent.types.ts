import type { Habit } from '../../../../features/habits/types';

export interface GoalsTabContentProps {
  habit: Habit;
  completionRate: number;
}

export interface StreakGoalSectionProps {
  habit: Habit;
  completionRate: number;
}
