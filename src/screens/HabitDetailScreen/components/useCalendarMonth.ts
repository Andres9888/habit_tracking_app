import { useCallback, useState } from 'react';
import { parseISO, startOfMonth } from 'date-fns';

export function useCalendarMonth(
  month?: Date,
  onMonthChange?: (month: Date) => void
) {
  const [localMonth, setLocalMonth] = useState(() =>
    startOfMonth(month ?? new Date())
  );
  const currentMonth = month ? startOfMonth(month) : localMonth;

  const setCurrentMonth = useCallback(
    (next: Date) => {
      const value = startOfMonth(next);
      if (!month) setLocalMonth(value);
      onMonthChange?.(value);
    },
    [month, onMonthChange]
  );

  const navigateToMonth = useCallback(
    (dateString: string) => {
      const parsed = parseISO(dateString);
      if (!Number.isNaN(parsed.getTime()))
        setCurrentMonth(startOfMonth(parsed));
    },
    [setCurrentMonth]
  );

  return { currentMonth, navigateToMonth, setCurrentMonth };
}
