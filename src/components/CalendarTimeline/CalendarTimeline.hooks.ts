import { format } from 'date-fns';
import { useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { getColors } from './CalendarTimeline.styles';
import type {
  CompletionStatus,
  DayCompletionStatus,
} from './CalendarTimeline.types';

/**
 * Custom hook for CalendarTimeline component logic
 */
export const useCalendarTimelineLogic = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date: Date): boolean => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() === today.getTime();
  };

  const isFuture = (date: Date): boolean => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() > today.getTime();
  };

  return { isFuture, isToday };
};

/** Derives themed colors and augmented colors for the timeline (borderless) */
export function useTimelineColors(highContrastMode: boolean, isDark: boolean) {
  const colors = getColors(highContrastMode, isDark);
  return useMemo(() => {
    const hc = highContrastMode;
    const augmentedColors = {
      ...colors,
      borderWidth: hc ? 2 : 0,
      highContrastBorder: hc ? colors.dayBorder : undefined,
    };
    return { augmentedColors, colors };
  }, [colors, highContrastMode]);
}

const SLIDE_OFFSET = 24;
const TRANSITION_EASING = { duration: 300, easing: Easing.out(Easing.cubic) };

/** Animates day cells entrance when the displayed week changes */
export function useWeekTransition(dates: Date[], reduceMotion: boolean) {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const prevFirstIso = useRef<string | null>(null);

  useEffect(() => {
    const firstIso = dates[0]?.toISOString() ?? '';
    if (
      prevFirstIso.current &&
      prevFirstIso.current !== firstIso &&
      !reduceMotion
    ) {
      const forward = firstIso > prevFirstIso.current;
      translateX.value = forward ? SLIDE_OFFSET : -SLIDE_OFFSET;
      opacity.value = 0.3;
      translateX.value = withTiming(0, TRANSITION_EASING);
      opacity.value = withTiming(1, { duration: 200 });
    }
    prevFirstIso.current = firstIso;
  }, [dates, reduceMotion, translateX, opacity]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));
}

/** Returns a function that resolves a Date to its CompletionStatus */
export function useCompletionStatus(
  completionByDay: Record<string, DayCompletionStatus>,
  isFuture: (date: Date) => boolean
) {
  return useCallback(
    (date: Date): CompletionStatus => {
      if (isFuture(date)) return 'future';
      const dateString = format(date, 'yyyy-MM-dd');
      const dayStatus = completionByDay[dateString];
      if (!dayStatus || dayStatus.total === 0) return 'none';
      if (dayStatus.completed === dayStatus.total) return 'complete';
      if (dayStatus.completed > 0) return 'partial';
      return 'none';
    },
    [completionByDay, isFuture]
  );
}
