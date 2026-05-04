import type { WeekDay } from './WeeklyTimeCard.types';

export interface ProgressStats {
  avgMinutesPerDay: number;
  dailyStreak: number;
  daysHit: number;
  remainingToWeekly: number;
}

export function computeProgressStats(
  days: WeekDay[],
  totalMinutes: number,
  dailyGoal: number,
  weeklyGoal: number
): ProgressStats {
  const avgMinutesPerDay = days.length > 0 ? totalMinutes / days.length : 0;
  const remainingToWeekly = Math.max(0, weeklyGoal - totalMinutes);
  const daysHit =
    dailyGoal > 0
      ? days.filter((d) => d.minutes >= dailyGoal).length
      : 0;

  let dailyStreak = 0;
  if (dailyGoal > 0) {
    for (let i = days.length - 1; i >= 0; i--) {
      const day = days[i];
      if (day.minutes >= dailyGoal) {
        dailyStreak++;
      } else if (day.isToday) {
        continue;
      } else {
        break;
      }
    }
  }

  return { avgMinutesPerDay, dailyStreak, daysHit, remainingToWeekly };
}
