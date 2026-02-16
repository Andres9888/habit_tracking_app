import { configureAffirmationChannel } from '../channels';
import { ensureNotificationPermissions } from '../permissions';
import { parseTimeString } from '../timeUtils';

import { cancelAffirmationDelivery } from './cancel';
import {
  scheduleDailyNotification,
  scheduleWeeklyNotification,
} from './schedulingHelpers';
import type { ScheduleAffirmationDeliveryParams } from './types';

/** Schedule affirmation delivery. Returns notification ID on success, null on failure. */
export async function scheduleAffirmationDelivery({
  affirmationId,
  habitId,
  affirmationText,
  scheduledTime,
  frequency,
  daysOfWeek,
  skipPermissionCheck = false,
}: ScheduleAffirmationDeliveryParams): Promise<string | null> {
  try {
    // Validate time format
    const timeMatch = scheduledTime.match(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/);
    if (!timeMatch) {
      if (__DEV__) console.warn(
        'scheduleAffirmationDelivery: invalid time format',
        scheduledTime
      );
      return null;
    }

    if (skipPermissionCheck) {
      await configureAffirmationChannel();
    } else {
      const hasPermission = await ensureNotificationPermissions();
      if (!hasPermission) {
        return null;
      }
      await configureAffirmationChannel();
    }

    // Cancel any existing notification for this affirmation
    await cancelAffirmationDelivery(affirmationId);

    const { hours, minutes } = parseTimeString(scheduledTime);
    const truncatedText =
      affirmationText.length > 100
        ? affirmationText.slice(0, 97) + '...'
        : affirmationText;

    let notificationId: string;

    if (frequency === 'daily') {
      notificationId = await scheduleDailyNotification(
        affirmationId,
        habitId,
        truncatedText,
        hours,
        minutes
      );
    } else {
      if (!daysOfWeek || daysOfWeek.length === 0) {
        if (__DEV__) console.warn(
          'scheduleAffirmationDelivery: weekly frequency requires daysOfWeek'
        );
        return null;
      }

      notificationId = await scheduleWeeklyNotification(
        affirmationId,
        habitId,
        truncatedText,
        hours,
        minutes,
        daysOfWeek
      );
    }

    if (__DEV__) console.info('scheduleAffirmationDelivery success', {
      affirmationId,
      frequency,
      notificationId,
      scheduledTime,
    });

    return notificationId;
  } catch (error) {
    if (__DEV__) console.error('scheduleAffirmationDelivery failed', {
      affirmationId,
      error,
    });
    return null;
  }
}
