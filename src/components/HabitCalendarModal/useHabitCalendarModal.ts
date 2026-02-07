import { useState, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { getEmojiAndName } from '../DraggableHabit/DraggableHabit.hooks';
import {
  calculateBestStreak,
  calculateCompletionPercentage,
} from '../../utils/habitCalculations';
import { buildScheduleLabel, getLatestMissedBadge } from './utils';
import type { CalendarView, Habit, TrackingEntry } from './types';
import type { Id } from '../../../convex/_generated/dataModel';

interface UseHabitCalendarModalProps {
  habit: Habit | null;
  tracking: TrackingEntry[];
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => void;
  onClose: () => void;
  onOpenMotivationTab?: () => void;
}

export function useHabitCalendarModal({
  habit,
  tracking,
  toggleHabit,
  onClose,
  onOpenMotivationTab,
}: UseHabitCalendarModalProps) {
  const [showEditScreen, setShowEditScreen] = useState(false);
  const [calendarView, setCalendarView] = useState<CalendarView>('month');

  const todayDateString = format(new Date(), 'yyyy-MM-dd');
  const habitId = habit?._id ?? null;

  const habitTrackingEntries = useMemo(
    () => (habitId ? tracking.filter((t) => t.habitId === habitId) : []),
    [tracking, habitId]
  );

  const habitTracking = useMemo(
    () => habitTrackingEntries.map((t) => ({ completed: t.completed, date: t.date })),
    [habitTrackingEntries]
  );

  const bestStreak = useMemo(
    () => calculateBestStreak(habitTracking),
    [habitTracking]
  );

  const completionPercentage = useMemo(
    () => calculateCompletionPercentage(habit?.createdAt || Date.now(), habitTracking),
    [habit?.createdAt, habitTracking]
  );

  const todayTracking = useMemo(
    () => habitTrackingEntries.find((t) => t.date === todayDateString),
    [habitTrackingEntries, todayDateString]
  );
  const isTodayCompleted = Boolean(todayTracking?.completed);

  const recentMissBadge = useMemo(
    () => getLatestMissedBadge(habitTrackingEntries, todayDateString),
    [habitTrackingEntries, todayDateString]
  );

  const handleEditPress = useCallback(() => setShowEditScreen(true), []);
  const handleCloseEdit = useCallback(() => setShowEditScreen(false), []);
  const handleQuickLogPress = useCallback(() => {
    if (!habitId || isTodayCompleted) return;
    toggleHabit({ habitId, date: todayDateString });
  }, [habitId, isTodayCompleted, toggleHabit, todayDateString]);
  const handleOpenAdvancedFeatures = useCallback(() => {
    setShowEditScreen(false);
    onClose();
    onOpenMotivationTab?.();
  }, [onClose, onOpenMotivationTab]);

  if (!habit) {
    return { isValid: false } as const;
  }

  const { emoji, name } = getEmojiAndName(habit.name);
  const scheduleLabel = buildScheduleLabel(habit);

  return {
    isValid: true,
    emoji,
    name,
    scheduleLabel,
    habitTrackingEntries,
    isTodayCompleted,
    recentMissBadge,
    bestStreak,
    completionPercentage,
    showEditScreen,
    calendarView,
    setCalendarView,
    handleEditPress,
    handleCloseEdit,
    handleQuickLogPress,
    handleOpenAdvancedFeatures,
  } as const;
}
