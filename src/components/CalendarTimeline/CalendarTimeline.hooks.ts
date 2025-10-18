import { useCallback } from 'react';

/**
 * Custom hook for CalendarTimeline component logic
 * @param selectedDate - Currently selected date (optional)
 */
export const useCalendarTimelineLogic = (selectedDate?: Date) => {
  /**
   * Check if a given date matches the selected date
   */
  const isDateSelected = useCallback(
    (date: Date): boolean => {
      if (!selectedDate) return false;

      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);

      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);

      return checkDate.getTime() === selected.getTime();
    },
    [selectedDate],
  );

  return {
    isDateSelected,
  };
};
