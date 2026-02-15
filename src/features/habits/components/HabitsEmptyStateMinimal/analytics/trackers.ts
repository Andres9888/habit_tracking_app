/**
 * Analytics Trackers
 * Built-in tracker implementations
 */

import type {
  TimeBasedChipEvent,
  TimeBasedChipAnalyticsTracker,
} from './types';

/**
 * No-op tracker for production when no analytics provider configured
 */
class NoOpTimeBasedChipAnalyticsTracker implements TimeBasedChipAnalyticsTracker {
  track(_event: TimeBasedChipEvent): void {
    // No-op
  }
}

/**
 * Global analytics tracker instance
 * Override with setTimeBasedChipAnalyticsTracker() to connect your analytics provider
 */
let analyticsTracker: TimeBasedChipAnalyticsTracker = new NoOpTimeBasedChipAnalyticsTracker();

/**
 * Set custom analytics tracker
 */
export function setTimeBasedChipAnalyticsTracker(
  tracker: TimeBasedChipAnalyticsTracker
): void {
  analyticsTracker = tracker;
}

/**
 * Track analytics event (type-safe wrapper)
 */
export function trackTimeBasedChipEvent(event: TimeBasedChipEvent): void {
  try {
    analyticsTracker.track(event);
  } catch (error) {
    // Silently fail in production
  }
}
