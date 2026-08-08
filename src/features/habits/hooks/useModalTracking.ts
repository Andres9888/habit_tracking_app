import { useEffect, useMemo, useState } from 'react';

import type { HabitTrackingEntry } from '../types';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { generateDateStrings, getTodayMidnight } from './modalsStateHelpers';
import { useHabitsTracking } from './useHabitsTracking';

const EXTENDED_TRACKING_DAYS = 365;

interface UseModalTrackingOptions {
  fallbackTracking: HabitTrackingEntry[];
  isExtendedViewVisible: boolean;
}

/**
 * Reuses home tracking until Calendar or Habit Detail requests longer history.
 * The extended subscription is retained after first open to avoid churn.
 */
export function useModalTracking({
  fallbackTracking,
  isExtendedViewVisible,
}: UseModalTrackingOptions) {
  const [hasRequestedExtendedTracking, setHasRequestedExtendedTracking] =
    useState(false);

  useEffect(() => {
    if (isExtendedViewVisible) setHasRequestedExtendedTracking(true);
  }, [isExtendedViewVisible]);

  const shouldLoadExtendedTracking =
    isExtendedViewVisible || hasRequestedExtendedTracking;
  const todayKey = getLocalDateString();
  const trackingDates = useMemo(
    () =>
      shouldLoadExtendedTracking
        ? generateDateStrings(EXTENDED_TRACKING_DAYS)
        : [],
    [shouldLoadExtendedTracking, todayKey]
  );
  const today = useMemo(() => getTodayMidnight(), [todayKey]);

  return useHabitsTracking(trackingDates, today, {
    enabled: shouldLoadExtendedTracking,
    fallbackToLatest: false,
    fallbackTracking,
    windowBufferDays: 0,
  });
}
