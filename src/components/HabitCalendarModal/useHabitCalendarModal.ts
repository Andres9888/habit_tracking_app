import { useState } from 'react';
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

  if (!habit) {
    return { isValid: false } as const;
  }

  const { emoji, name } = getEmojiAndName(habit.name);
  const scheduleLabel = buildScheduleLabel(habit);
  const habitTrackingEntries = tracking.filter((t) => t.habitId === habit._id);
  const habitTracking = habitTrackingEntries.map((t) => ({
    completed: t.completed,
    date: t.date,
  }));
  const todayTracking = habitTrackingEntries.find((t) => t.date === todayDateString);
  const isTodayCompleted = Boolean(todayTracking?.completed);
  const recentMissBadge = getLatestMissedBadge(habitTrackingEntries, todayDateString);
  const bestStreak = calculateBestStreak(habitTracking);
  const completionPercentage = calculateCompletionPercentage(
    habit.createdAt || Date.now(),
    habitTracking
  );

  const handleEditPress = () => setShowEditScreen(true);
  const handleCloseEdit = () => setShowEditScreen(false);
  const handleQuickLogPress = () => {
    if (isTodayCompleted) return;
    toggleHabit({ date: todayDateString, habitId: habit._id });
  };
  const handleOpenAdvancedFeatures = () => {
    setShowEditScreen(false);
    onClose();
    onOpenMotivationTab?.();
  };

  return {
    bestStreak,
    completionPercentage,
    calendarView,
    emoji,
    habitTrackingEntries,
    handleEditPress,
    handleCloseEdit,
    isTodayCompleted,
    handleOpenAdvancedFeatures,
    isValid: true,
    handleQuickLogPress,
    name,
    recentMissBadge,
    scheduleLabel,
    setCalendarView,
    showEditScreen,
  } as const;
}
