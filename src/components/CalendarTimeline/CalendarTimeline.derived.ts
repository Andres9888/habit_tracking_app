import { useState, useCallback, useMemo } from 'react';
import { format } from 'date-fns';

import {
  useCalendarTimelineLogic,
  useCompletionStatus,
  useTimelineColors,
  useWeekTransition,
} from './CalendarTimeline.hooks';
import { STREAK_CONNECTOR } from './CalendarTimeline.styles';
import type { DayCompletionStatus } from './CalendarTimeline.types';
import { useTimelineSwipe } from './useTimelineSwipe';
import { useThemeColors } from '../../theme/ThemeContext';

export function useDerivedState(
  dates: Date[],
  completionByDay: Record<string, DayCompletionStatus>,
  isFuture: (d: Date) => boolean,
  isToday: (d: Date) => boolean,
  isDark: boolean
) {
  const getStatus = useCompletionStatus(completionByDay, isFuture);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const openCalendar = useCallback(() => setCalendarOpen(true), []);
  const closeCalendar = useCallback(() => setCalendarOpen(false), []);

  const completionStatuses = useMemo(
    () => dates.map((d) => getStatus(d)),
    [dates, getStatus]
  );

  const completionCounts = useMemo(
    () =>
      dates.map((d) => {
        const key = format(d, 'yyyy-MM-dd');
        return completionByDay[key] ?? { completed: 0, total: 0 };
      }),
    [dates, completionByDay]
  );

  const firstDate = dates[0];
  const lastDate = dates.at(-1);
  const dateRangeText =
    firstDate && lastDate
      ? `${format(firstDate, 'MMM d')} – ${format(lastDate, 'MMM d')}`
      : '';
  const currentDate = dates.find((d) => isToday(d)) ?? lastDate;
  const connectorColor = isDark
    ? STREAK_CONNECTOR.dark
    : STREAK_CONNECTOR.light;
  const ghostConnectorColor = isDark
    ? STREAK_CONNECTOR.ghostDark
    : STREAK_CONNECTOR.ghostLight;

  return {
    calendarOpen,
    closeCalendar,
    completionCounts,
    completionStatuses,
    connectorColor,
    ghostConnectorColor,
    currentDate,
    dateRangeText,
    firstDate,
    lastDate,
    openCalendar,
  };
}

/** Combines all hook calls for CalendarTimeline into a single setup */
export function useCalendarTimelineSetup(
  dates: Date[],
  completionByDay: Record<string, DayCompletionStatus>,
  reduceMotion: boolean,
  canNavigateForward: boolean,
  onPreviousWeek?: () => void,
  onNextWeek?: () => void
) {
  const { isToday, isFuture } = useCalendarTimelineLogic();
  const { isDark } = useThemeColors();
  const { augmentedColors } = useTimelineColors(isDark);
  const swipeOpts = { canNavigateForward, onNextWeek, onPreviousWeek };
  const panGesture = useTimelineSwipe(swipeOpts);
  const headerPanGesture = useTimelineSwipe(swipeOpts);
  const weekTransitionStyle = useWeekTransition(dates, reduceMotion);
  const derived = useDerivedState(
    dates,
    completionByDay,
    isFuture,
    isToday,
    isDark
  );

  return {
    ...derived,
    augmentedColors,
    headerPanGesture,
    isDark,
    isFuture,
    isToday,
    panGesture,
    weekTransitionStyle,
  };
}
