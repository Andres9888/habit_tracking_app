import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from 'date-fns';
import { useState } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';

type HabitStatus = 'done' | 'missed' | 'planned' | 'empty';

interface UseHabitCalendarViewLogicProps {
  habitId: Id<'habits'>;
  tracking: Array<{ habitId: Id<'habits'>; date: string; completed: boolean }>;
}

export const useHabitCalendarViewLogic = ({
  habitId,
  tracking,
}: UseHabitCalendarViewLogicProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getHabitStatus = (dateString: string): HabitStatus => {
    const trackingEntry = tracking.find(
      (t) => t.habitId === habitId && t.date === dateString
    );

    // Parse date in local timezone to avoid timezone shifting
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (trackingEntry?.completed) return 'done';
    if (date < today) return 'missed';
    if (date.getTime() === today.getTime()) return 'planned';
    return 'empty';
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ end: monthEnd, start: monthStart });

  // Get the day of week for the first day (0 = Sunday)
  const firstDayOfWeek = monthStart.getDay();

  // Create array of empty slots for days before the month starts
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return {
    currentMonth,
    daysInMonth,
    emptyDays,
    getHabitStatus,
    handleNextMonth,
    handlePreviousMonth,
    handleToday,
  };
};
