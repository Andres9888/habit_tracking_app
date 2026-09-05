import { format } from 'date-fns';
import { useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { getColors } from './CalendarTimeline.styles';
import { durations } from '@/theme/animations';
import type {
  CompletionStatus,
  DayCompletionStatus,
} from './CalendarTimeline.types';

/**
 * Custom hook for CalendarTimeline component logic
 */
export const useCalendarTimelineLogic = () => {
  // Stable for the session: a fresh Date()/closures every render would bust the
  // completionStatuses/completionCounts memos in useDerivedState on every render.
  const todayTime = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  }, []);

  const isToday = useCallback(
    (date: Date): boolean => {
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate.getTime() === todayTime;
    },
    [todayTime]
  );

  const isFuture = useCallback(
    (date: Date): boolean => {
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate.getTime() > todayTime;
    },
    [todayTime]
  );

  return { isFuture, isToday };
};

/** Derives themed colors for the timeline */
export function useTimelineColors(isDark: boolean) {
  const colors = getColors(isDark);
  return useMemo(() => ({ augmentedColors: colors, colors }), [colors]);
}

const SLIDE_OFFSET = 12;
const TRANSITION_EASING = {
  duration: durations.quick,
  easing: Easing.out(Easing.cubic),
};

/**
 * Slides the day strip in when the displayed week changes. The new week is
 * painted at full opacity immediately and only the slide animates — fading the
 * strip from opacity 0 (the old behavior) made every navigation read as a slow
 * "vanish then fade back in".
 */
export function useWeekTransition(dates: Date[], reduceMotion: boolean) {
  const translateX = useSharedValue(0);
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
      translateX.value = withTiming(0, TRANSITION_EASING);
    }
    prevFirstIso.current = firstIso;
  }, [dates, reduceMotion, translateX]);

  return useAnimatedStyle(() => ({
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
