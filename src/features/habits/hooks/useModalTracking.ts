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
 * Uses the already-subscribed home window until detail history is requested.
 * Once requested, retain the exact extended subscription for this screen
 * session so closing and reopening a modal never causes subscription churn.
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
