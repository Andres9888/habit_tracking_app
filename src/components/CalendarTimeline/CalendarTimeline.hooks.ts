/**
 * Custom hook for CalendarTimeline component logic
 */
export const useCalendarTimelineLogic = (): {
  isFuture: (date: Date) => boolean;
  isToday: (date: Date) => boolean;
} => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /**
   * Check if a given date is today
   */
  const isToday = (date: Date): boolean => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() === today.getTime();
  };

  /**
   * Check if a given date is in the future
   */
  const isFuture = (date: Date): boolean => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() > today.getTime();
  };

  return {
    isFuture,
    isToday,
  };
};
