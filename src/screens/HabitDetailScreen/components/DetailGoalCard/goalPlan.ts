/**
 * The goal card states progress in dates, not days remaining: "Pass your
 * record on Friday" is a plan, "3 to go" is a fact. Same data, and the plan is
 * the one people act on.
 *
 * Today's own check-in counts as the next day when nothing is logged yet, so
 * every offset shifts back one once today is banked.
 */
import { addDays, format } from 'date-fns';

interface GoalPlanArgs {
  bestStreak: number;
  currentStreak: number;
  goal: number;
  loggedToday: boolean;
  today?: Date;
}

/** Weekday alone is only unambiguous inside the coming week. */
function stamp(from: Date, offset: number): string {
  const target = addDays(from, offset);
  return offset <= 6 ? format(target, 'EEEE') : format(target, 'MMM d');
}

export function goalPlanSentence({
  bestStreak,
  currentStreak,
  goal,
  loggedToday,
  today = new Date(),
}: GoalPlanArgs): string {
  if (goal <= 0) return '';
  const toGoal = goal - currentStreak;
  if (toGoal <= 0) return `Goal reached — ${goal} days, and still going.`;

  const shift = loggedToday ? 0 : -1;
  const toRecord = bestStreak + 1 - currentStreak;
  const parts: string[] = [];
  if (toRecord > 0 && toRecord < toGoal) {
    parts.push(`Pass your record on ${stamp(today, toRecord + shift)}`);
  }
  const reach = parts.length > 0 ? 'then reach' : 'Reach';
  parts.push(
    `${reach} ${goal} days on ${format(addDays(today, toGoal + shift), 'MMM d')}`
  );
  return `${parts.join(', ')}.`;
}
