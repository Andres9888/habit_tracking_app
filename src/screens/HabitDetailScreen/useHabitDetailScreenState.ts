import { useMemo, useState } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';
import type { HabitTrackingEntry } from '../../features/habits/types';
import { useOptimisticToggle, usePendingToggles } from '../../lib/optimistic';
import { getLocalDateString } from '@/utils/getLocalDateString';
import { mergeCompletedDates } from './mergeCompletedDates';
import { applyOptimisticToday } from './optimisticToday';

interface UseHabitDetailScreenStateProps {
  bestStreak: number;
  currentStreak: number;
  habitId: Id<'habits'> | undefined;
  tracking: HabitTrackingEntry[];
  visible?: boolean;
}

export const useHabitDetailScreenState = ({
  bestStreak,
  currentStreak,
  habitId,
  tracking,
  visible: _visible,
}: UseHabitDetailScreenStateProps) => {
  const [pendingDelete, setPendingDelete] = useState(false);
  const [pendingArchive, setPendingArchive] = useState(false);
  const [pendingToggleDate, setPendingToggleDate] = useState<string | null>(
    null
  );

  const today = getLocalDateString();
  const pendingToggles = usePendingToggles();

  const completedDatesKey = useMemo(() => {
    if (!habitId || !tracking || !Array.isArray(tracking)) return '';
    const dates = tracking
      .filter((entry) => entry && entry.habitId === habitId && entry.completed)
      .map((entry) => entry.date)
      .filter((date): date is string => typeof date === 'string');
    if (dates.length === 0) return '';
    return dates.sort().join(',');
  }, [habitId, tracking]);

  const completedDates = useMemo(() => {
    const fromTracking = completedDatesKey
      ? new Set(completedDatesKey.split(','))
      : new Set<string>();
    return mergeCompletedDates(fromTracking, habitId, pendingToggles);
  }, [completedDatesKey, habitId, pendingToggles]);

  const optimisticToggle = useOptimisticToggle(
    (habitId ?? '') as Id<'habits'>,
    today
  );
  const optimistic = applyOptimisticToday(
    {
      bestStreak,
      completedToday: completedDates.has(today),
      currentStreak,
      totalCompletions: completedDates.size,
    },
    optimisticToggle
  );

  return {
    bestStreak: optimistic.bestStreak,
    completedDates,
    currentStreak: optimistic.currentStreak,
    isCompletedToday: optimistic.isCompletedToday,
    pendingArchive,
    pendingDelete,
    pendingToggleDate,
    setPendingToggleDate,
    setPendingArchive,
    setPendingDelete,
    totalCompletions: optimistic.totalCompletions,
  };
};
