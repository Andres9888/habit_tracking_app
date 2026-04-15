export type GoalDisplayState = 'no-goal' | 'in-progress' | 'achieved' | 'exceeded';

export interface StreakGoalProgress {
  progressPercentage: number;
  daysRemaining: number;
  isAchieved: boolean;
  displayState: GoalDisplayState;
}

export function calculateStreakGoalProgress(
  currentStreak: number,
  goalDuration: number | undefined,
  goalAchievedAt: number | undefined,
): StreakGoalProgress {
  if (!goalDuration) {
    return { progressPercentage: 0, daysRemaining: 0, isAchieved: false, displayState: 'no-goal' };
  }

  const isAchieved = !!goalAchievedAt || currentStreak >= goalDuration;
  const daysRemaining = Math.max(0, goalDuration - currentStreak);
  const progressPercentage = Math.min(100, Math.round((currentStreak / goalDuration) * 100));

  let displayState: GoalDisplayState = 'in-progress';
  if (isAchieved && currentStreak > goalDuration) displayState = 'exceeded';
  else if (isAchieved) displayState = 'achieved';

  return { progressPercentage, daysRemaining, isAchieved, displayState };
}

export function getGoalMotivation(currentStreak: number, goalDuration: number): string {
  const pct = currentStreak / goalDuration;
  const remaining = goalDuration - currentStreak;

  if (pct >= 1) return 'Goal achieved!';
  if (remaining === 1) return 'Just 1 more day!';
  if (remaining <= 3) return `Almost there — ${remaining} days left!`;
  if (pct >= 0.75) return 'The finish line is in sight!';
  if (pct >= 0.5) return 'Over halfway there!';
  if (pct >= 0.25) return 'Building momentum!';
  return 'Every day counts — keep going!';
}
