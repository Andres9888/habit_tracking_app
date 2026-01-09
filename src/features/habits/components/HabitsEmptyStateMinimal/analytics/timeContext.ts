/**
 * Time Context Helper
 * Provides time-related context for analytics events
 */

import { getTimeWindowFromHour } from './helpers';

/** Get current time context for analytics events */
export function getTimeContext() {
  const now = new Date();
  const hour = now.getHours();
  return { hour, now, timeWindow: getTimeWindowFromHour(hour) };
}
