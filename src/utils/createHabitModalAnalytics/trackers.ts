import type { AnalyticsTracker, CreateHabitModalEvent } from './types';

/**
 * No-op tracker for production when no analytics provider configured
 */
class NoOpAnalyticsTracker implements AnalyticsTracker {
  track(_event: CreateHabitModalEvent): void {
    // No-op
  }
}

/**
 * Global analytics tracker instance
 * Override with setAnalyticsTracker() to connect your analytics provider
 */
let analyticsTracker: AnalyticsTracker = new NoOpAnalyticsTracker();

/**
 * Set custom analytics tracker
 * Call this early in your app initialization to connect your analytics provider
 */
export function setAnalyticsTracker(tracker: AnalyticsTracker): void {
  analyticsTracker = tracker;
}

/**
 * Track analytics event
 * Type-safe wrapper around the global analytics tracker
 */
export function trackEvent(event: CreateHabitModalEvent): void {
  try {
    analyticsTracker.track(event);
  } catch (error) {
    // Silently fail - don't let analytics errors break the app
  }
}
