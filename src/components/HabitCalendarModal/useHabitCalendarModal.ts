import { useCallback, useMemo, useState } from 'react';
import { deriveHabitCalendarData } from './deriveHabitCalendarData';
import type { CalendarView, Habit, TrackingEntry } from './types';
import type { Id } from '../../../convex/_generated/dataModel';

interface UseHabitCalendarModalProps {
  habit: Habit | null;
  tracking: TrackingEntry[];
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => void;
  onClose: () => void;
  onOpenMotivationTab?: () => void;
  visible: boolean;
}

export function useHabitCalendarModal({
  habit,
  tracking,
  toggleHabit,
  onClose,
  onOpenMotivationTab,
  visible,
}: UseHabitCalendarModalProps) {
  const [showEditScreen, setShowEditScreen] = useState(false);
  const [calendarView, setCalendarView] = useState<CalendarView>('month');

  // This modal stays mounted while closed so RN's <Modal> keeps its slide-out
  // animation, which means it re-renders on every HabitsApp render — i.e. on
  // every habit toggle and every week change. Deriving here (a tracking filter,
  // a map, a best-streak scan and a completion-percentage scan) was therefore
  // running constantly for a screen nobody was looking at. Gate on `visible`
  // and memoize so a closed modal costs nothing.
  const derived = useMemo(
    () => (visible && habit ? deriveHabitCalendarData(habit, tracking) : null),
    [habit, tracking, visible]
  );

  const handleEditPress = useCallback(() => setShowEditScreen(true), []);
  const handleCloseEdit = useCallback(() => setShowEditScreen(false), []);
  const handleHabitRemoved = useCallback(() => {
    setShowEditScreen(false);
    onClose();
  }, [onClose]);
  const handleQuickLogPress = useCallback(() => {
    if (!habit || !derived || derived.isTodayCompleted) return;
    toggleHabit({ date: derived.todayDateString, habitId: habit._id });
  }, [derived, habit, toggleHabit]);
  const handleOpenAdvancedFeatures = useCallback(() => {
    setShowEditScreen(false);
    onClose();
    onOpenMotivationTab?.();
  }, [onClose, onOpenMotivationTab]);

  if (!derived) {
    return { isValid: false } as const;
  }

  return {
    bestStreak: derived.bestStreak,
    calendarView,
    completionPercentage: derived.completionPercentage,
    emoji: derived.emoji,
    habitTrackingEntries: derived.habitTrackingEntries,
    handleCloseEdit,
    handleEditPress,
    handleHabitRemoved,
    handleOpenAdvancedFeatures,
    handleQuickLogPress,
    isTodayCompleted: derived.isTodayCompleted,
    isValid: true,
    name: derived.name,
    recentMissBadge: derived.recentMissBadge,
    scheduleLabel: derived.scheduleLabel,
    setCalendarView,
    showEditScreen,
  } as const;
}
