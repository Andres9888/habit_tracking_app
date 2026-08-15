import { isPausedMissDay, type PauseInfo } from '../streakUtils/pausePeriod';

export function skipPausedDays(
  habit: { pausedAt?: number; resumedAt?: number },
  timezone?: string
): (dateKey: string) => boolean {
  const pauseInfo: PauseInfo = {
    pausedAt: habit.pausedAt,
    resumedAt: habit.resumedAt,
    timezone,
  };
  return (dateKey: string) => isPausedMissDay(dateKey, pauseInfo);
}
