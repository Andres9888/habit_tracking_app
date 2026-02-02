/**
 * Analytics Trackers
 * Built-in tracker implementations
 */

import type {
  TimeBasedChipEvent,
  TimeBasedChipAnalyticsTracker,
} from './types';

/**
 * Console logger for development
 * Logs all analytics events to console in development mode
 */
class ConsoleTimeBasedChipAnalyticsTracker implements TimeBasedChipAnalyticsTracker {
  private enabled: boolean;

  constructor() {
    this.enabled = __DEV__;
  }

  track(event: TimeBasedChipEvent): void {
    if (!this.enabled) return;

    const { timestamp, type, ...rest } = event;
    // eslint-disable-next-line no-console
    console.log('[Analytics] Time-Based Chips:', {
      timestamp: new Date(timestamp).toISOString(),
      type,
      ...rest,
    });
  }
}

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
let analyticsTracker: TimeBasedChipAnalyticsTracker = __DEV__
  ? new ConsoleTimeBasedChipAnalyticsTracker()
  : new NoOpTimeBasedChipAnalyticsTracker();

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
    if (__DEV__) {
      console.error('[Analytics] Error tracking time-based chip event:', error);
    }
  }
}
