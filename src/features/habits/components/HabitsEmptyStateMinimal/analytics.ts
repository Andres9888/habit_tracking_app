/**
 * Analytics tracking utilities for Time-Based Suggestion Chips
 *
 * This file re-exports the decomposed analytics module for backwards compatibility.
 * For new code, prefer importing directly from './analytics/index'.
 *
 * @see ./analytics/index.ts
 */

export {
  // Types
  type TimeWindow,
  type TimeBasedChipEvent,
  type TimeBasedChipAnalyticsTracker,
  // Trackers
  setTimeBasedChipAnalyticsTracker,
  trackTimeBasedChipEvent,
  // Helpers
  getTimeWindowFromHour,
  getChipLabels,
  // Hook
  useTimeBasedChipAnalytics,
} from './analytics';
