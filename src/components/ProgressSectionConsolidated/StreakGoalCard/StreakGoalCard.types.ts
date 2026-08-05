/**
 * StreakGoalCard Type Definitions — Variation K (Dashboard)
 */

export interface StreakGoalCardProps {
  /** Current streak in days */
  currentStreak: number;
  /** User-defined streak goal in days (e.g. 66) */
  streakGoal: number;
  /** Best streak ever achieved for this habit */
  bestStreak: number;
  /** Lifetime completion rate as 0-100 percentage */
  completionRate: number;
}

export type MilestoneStatus = 'done' | 'current' | 'future';

export interface DashboardMilestone {
  days: number;
  badge: string;
  name: string;
  status: MilestoneStatus;
  /** Achieved date (past) for done; projected date (future) otherwise */
  date: Date;
  /** Days until reached; 0 once achieved */
  daysAway: number;
  /** True for the goal-day row when goal is not also a standard milestone */
  isGoalRow?: boolean;
}
