/**
 * Onboarding Analytics
 * Tracks user progression through onboarding for conversion optimization
 */

export interface OnboardingAnalyticsEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp: number;
}

export type OnboardingEventName =
  | 'onboarding_started'
  | 'onboarding_screen_viewed'
  | 'onboarding_screen_completed'
  | 'onboarding_skipped'
  | 'onboarding_completed'
  | 'onboarding_recovered';

interface OnboardingEventProperties {
  screen_index?: number;
  screen_name?: string;
  time_spent_ms?: number;
  total_time_ms?: number;
  skip_reason?: 'user_action' | 'timeout';
  recovery_screen?: number;
}

/**
 * Analytics tracker interface
 */
export interface OnboardingAnalyticsTracker {
  track(event: OnboardingEventName, properties?: OnboardingEventProperties): void;
}

/**
 * Console logger for development
 */
class ConsoleOnboardingAnalyticsTracker implements OnboardingAnalyticsTracker {
  private enabled: boolean;

  constructor() {
    this.enabled = __DEV__;
  }

  track(event: OnboardingEventName, properties?: OnboardingEventProperties): void {
    if (!this.enabled) return;

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[Onboarding Analytics]', {
        event,
        ...properties,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

/**
 * No-op tracker for production when no analytics provider configured
 */
class NoOpOnboardingAnalyticsTracker implements OnboardingAnalyticsTracker {
  track(_event: OnboardingEventName, _properties?: OnboardingEventProperties): void {
    // No-op
  }
}

/**
 * Global onboarding analytics tracker instance
 */
let analyticsTracker: OnboardingAnalyticsTracker = __DEV__
  ? new ConsoleOnboardingAnalyticsTracker()
  : new NoOpOnboardingAnalyticsTracker();

/**
 * Set custom analytics tracker
 */
export function setOnboardingAnalyticsTracker(
  tracker: OnboardingAnalyticsTracker
): void {
  analyticsTracker = tracker;
}

/**
 * Track onboarding event
 */
export function trackOnboardingEvent(
  event: OnboardingEventName,
  properties?: OnboardingEventProperties
): void {
  try {
    analyticsTracker.track(event, properties);
  } catch (error) {
    if (__DEV__) {
      console.error('[Onboarding Analytics] Error tracking event:', error);
    }
  }
}
