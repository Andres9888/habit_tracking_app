import { parse, startOfDay } from 'date-fns';
import type { HabitStatus } from './types';

export const useHabitChainVisualizerLogic = (
  weekDateStrings: string[],
  weekStatus: HabitStatus[],
  isConnectedToPreviousWeek: boolean
) => {
  const today = startOfDay(new Date());

  const isFutureDate = (index: number): boolean => {
    const parsed = parse(weekDateStrings[index], 'yyyy-MM-dd', new Date());
    const normalized = startOfDay(parsed);
    return normalized.getTime() > today.getTime();
  };

  const isCompleted = (index: number): boolean => weekStatus[index] === 'done';

  const isStreakBreak = (index: number): boolean => {
    if (weekStatus[index] !== 'missed') return false;
    if (index === 0) return isConnectedToPreviousWeek;
    return weekStatus[index - 1] === 'done';
  };

  const isToday = (index: number): boolean => {
    const parsed = parse(weekDateStrings[index], 'yyyy-MM-dd', new Date());
    const normalized = startOfDay(parsed);
    return normalized.getTime() === today.getTime();
  };

  return {
    isCompleted,
    isFutureDate,
    isStreakBreak,
    isToday,
  };
};
