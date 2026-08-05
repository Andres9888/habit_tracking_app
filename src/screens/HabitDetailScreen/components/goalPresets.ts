/**
 * Streak-goal preset data + milestone helper, shared by the empty-state grid
 * and its milestone teaser. Roles mirror the Open Design "Habit Details" mock.
 */
export interface GoalPreset {
  days: number;
  role: string;
}

export const GOAL_PRESETS: GoalPreset[] = [
  { days: 7, role: 'Starter' },
  { days: 21, role: 'Rhythm' },
  { days: 30, role: 'Month' },
  { days: 66, role: 'Habit' },
  { days: 100, role: 'Century' },
  { days: 365, role: 'Year' },
];

export const RECOMMENDED_GOAL = 66;

/** Chip width in the 3-col empty-state grid — leaves room for the row gap. */
export const GRID_CHIP_WIDTH = '31%';

/** Presets we'll celebrate on the way to `goalDays` — up to four marks. */
export function milestonesForGoal(goalDays: number): number[] {
  const marks = GOAL_PRESETS.map((p) => p.days).filter((d) => d <= goalDays);
  if (goalDays > 0 && !marks.includes(goalDays)) marks.push(goalDays);
  return marks.slice(0, 4);
}

export function formatGoalMark(days: number): string {
  return days === 365 ? '1yr' : `${days}d`;
}
