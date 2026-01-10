/**
 * Analytics Module - Public API
 *
 * This module provides type-safe analytics event tracking for monitoring
 * time-based chip feature usage and measuring impact on user behavior.
 *
 * Tracks key metrics:
 * - Chip selection rate by time window
 * - Time to first habit creation
 * - Chip-to-habit conversion rate
 * - Time window engagement distribution
 */

// Types
export type {
  TimeWindow,
  TimeBasedChipEvent,
  TimeBasedChipAnalyticsTracker,
} from './types';

// Trackers
export {
  setTimeBasedChipAnalyticsTracker,
  trackTimeBasedChipEvent,
} from './trackers';

// Helpers
export { getTimeWindowFromHour, getChipLabels } from './helpers';

// Hook
export { useTimeBasedChipAnalytics } from './useTimeBasedChipAnalytics';
