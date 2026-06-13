import { useMemo } from 'react';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import {
  getDayAccessibility,
  getTextColor,
  getTextColorEndpoints,
  type CalendarDayColors,
} from './CalendarDay.helpers';
import type { DayData } from './types';
import { useCalendarDayAnimation } from './useCalendarDayAnimation';

interface UseCalendarDayCellStateParams {
  day: DayData;
  habitColor: string;
  isPending: boolean;
  isToggleBlocked: boolean;
  textColors: CalendarDayColors;
  useSolidCompletedFill: boolean;
}

export function useCalendarDayCellState({
  day,
  habitColor,
  isPending,
  isToggleBlocked,
  textColors,
  useSolidCompletedFill,
}: UseCalendarDayCellStateParams) {
  const reduceMotion = useReduceMotion();
  const showCompleted = Boolean(
    day?.isCompleted && day?.isCurrentMonth && !day?.isFuture
  );
  const isToday = Boolean(day?.isToday);
  const todayPending = isToday && !showCompleted;
  const textColorEndpoints = useMemo(
    () =>
      getTextColorEndpoints(
        day,
        textColors,
        habitColor,
        todayPending,
        useSolidCompletedFill
      ),
    [day, textColors, habitColor, todayPending, useSolidCompletedFill]
  );
  const animation = useCalendarDayAnimation({
    completeTextColor: textColorEndpoints.complete,
    incompleteTextColor: textColorEndpoints.incomplete,
    isPending,
    reduceMotion,
    showCompleted,
    useSolidCompletedFill,
  });

  return {
    animation,
    isDisabled: Boolean(
      day?.isFuture || !day?.isCurrentMonth || isToggleBlocked
    ),
    isToday,
    showCompleted,
    a11y: getDayAccessibility(
      day,
      showCompleted,
      Boolean(day?.isMissed && day?.isCurrentMonth && !day?.isFuture),
      isToday
    ),
    staticTextColor: getTextColor(day, textColors, {
      habitColor,
      showCompleted,
      todayPending,
      useSolid: useSolidCompletedFill,
    }),
  };
}
