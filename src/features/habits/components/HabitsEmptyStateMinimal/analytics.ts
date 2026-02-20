/**
 * Analytics tracking utilities for Time-Based Suggestion Chips
 *
 * This file re-exports the decomposed analytics module for backwards compatibility.
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
} from './analytics/index';
