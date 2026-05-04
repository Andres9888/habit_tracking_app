import type { Id } from '../../../../../convex/_generated/dataModel';

export interface WeeklyTimeCardProps {
  habitId: Id<'habits'>;
  habitColor?: string;
  dailyMinutesGoal?: number;
  weeklyMinutesGoal?: number;
}

export interface WeekDay {
  date: string;
  label: string;
  minutes: number;
  isToday: boolean;
}
