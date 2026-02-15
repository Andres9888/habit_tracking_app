/**
 * useScheduleForm Hook
 * Manages form state for affirmation schedule configuration
 */

import { Platform } from 'react-native';
import { useCallback, useEffect, useState } from 'react';

import type { AffirmationScheduleData } from './types';
import {
  getNextAffirmationDeliveryRelativeTime,
  type AffirmationFrequency,
} from '../../../../utils/notifications';
import { DEFAULT_DAYS_OF_WEEK } from './constants';
import { parseTimeToDate, formatDateToTime } from './timeUtils';
import { useScheduleHandlers } from './useScheduleHandlers';

export interface UseScheduleFormOptions {
  initialSchedule?: AffirmationScheduleData;
  visible: boolean;
}

export function useScheduleForm({
  initialSchedule,
  visible,
}: UseScheduleFormOptions) {
  const [time, setTime] = useState<Date>(
    parseTimeToDate(initialSchedule?.scheduledTime)
  );
  const [frequency, setFrequency] = useState<AffirmationFrequency>(
    initialSchedule?.frequency ?? 'daily'
  );
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(
    initialSchedule?.daysOfWeek ?? DEFAULT_DAYS_OF_WEEK
  );
  const [isEnabled, setIsEnabled] = useState<boolean>(
    initialSchedule?.isScheduleEnabled ?? true
  );
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS === 'ios');

  const hasExistingSchedule = !!initialSchedule?.scheduledTime;

  useEffect(() => {
    if (visible) {
      setTime(parseTimeToDate(initialSchedule?.scheduledTime));
      setFrequency(initialSchedule?.frequency ?? 'daily');
      setDaysOfWeek(initialSchedule?.daysOfWeek ?? DEFAULT_DAYS_OF_WEEK);
      setIsEnabled(initialSchedule?.isScheduleEnabled ?? true);
      setShowTimePicker(Platform.OS === 'ios');
    }
  }, [visible, initialSchedule]);

  const handlers = useScheduleHandlers(
    setDaysOfWeek,
    setShowTimePicker,
    setTime,
    setIsEnabled
  );

  const timeString = formatDateToTime(time);
  const nextDelivery = isEnabled
    ? getNextAffirmationDeliveryRelativeTime(
        timeString,
        frequency,
        frequency === 'weekly' ? daysOfWeek : undefined
      )
    : null;

  const getScheduleData = useCallback(
    (): AffirmationScheduleData => ({
      daysOfWeek: frequency === 'weekly' ? daysOfWeek : undefined,
      frequency,
      isScheduleEnabled: isEnabled,
      scheduledTime: formatDateToTime(time),
    }),
    [frequency, daysOfWeek, isEnabled, time]
  );

  return {
    ...handlers,
    daysOfWeek,
    frequency,
    getScheduleData,
    hasExistingSchedule,
    isEnabled,
    nextDelivery,
    setFrequency,
    setShowTimePicker,
    showTimePicker,
    time,
  };
}
