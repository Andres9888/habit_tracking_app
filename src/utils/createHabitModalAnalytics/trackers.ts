import type { AnalyticsTracker, CreateHabitModalEvent } from './types';

/**
 * Console logger for development
 * Logs all analytics events to console in development mode
 */
class ConsoleAnalyticsTracker implements AnalyticsTracker {
  private enabled: boolean;

  constructor() {
    this.enabled = __DEV__;
  }

  track(event: CreateHabitModalEvent): void {
    if (!this.enabled) return;

    if (__DEV__) console.log('[Analytics] Create Habit Modal V11:', {
      timestamp: new Date().toISOString(),
      type: event.type,
      ...event,
    });
  }
}

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
let analyticsTracker: AnalyticsTracker = __DEV__
  ? new ConsoleAnalyticsTracker()
  : new NoOpAnalyticsTracker();

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
    if (__DEV__) {
      if (__DEV__) console.error('[Analytics] Error tracking event:', error);
    }
  }
}
