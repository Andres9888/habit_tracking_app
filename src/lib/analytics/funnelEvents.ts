/**
 * Acquisition Funnel Analytics
 *
 * Tracks the user journey from first open → first habit created.
 * Steps: app_open → welcome_viewed → auth_started → auth_completed →
 *        empty_state_viewed → first_habit_created
 */

import logInteraction from './interactions';

/** Funnel step identifiers */
export type FunnelStep =
  | 'app_open'
  | 'welcome_viewed'
  | 'auth_started'
  | 'auth_completed'
  | 'onboarding_skipped'
  | 'empty_state_viewed'
  | 'quick_start_tapped'
  | 'quick_start_completed'
  | 'chip_tapped'
  | 'first_habit_created';

/** Auth method used */
export type AuthMethod = 'apple' | 'google' | 'email_signup' | 'email_signin';

/**
 * Log a funnel step event.
 */
export function trackFunnelStep(
  step: FunnelStep,
  metadata?: Record<string, unknown>,
) {
  logInteraction(`funnel:${step}`, {
    ...metadata,
    timestamp: Date.now(),
  });
}

/**
 * Track when the welcome/landing screen is viewed.
 */
export function trackWelcomeViewed() {
  trackFunnelStep('welcome_viewed');
}

/**
 * Track when auth flow is initiated.
 */
export function trackAuthStarted(method: AuthMethod) {
  trackFunnelStep('auth_started', { method });
}

/**
 * Track when auth completes successfully.
 */
export function trackAuthCompleted(method: AuthMethod) {
  trackFunnelStep('auth_completed', { method });
}

/**
 * Track when onboarding is auto-skipped.
 */
export function trackOnboardingSkipped() {
  trackFunnelStep('onboarding_skipped');
}

/**
 * Track when user sees the empty state (habit creation prompt).
 */
export function trackEmptyStateViewed() {
  trackFunnelStep('empty_state_viewed');
}

/**
 * Track when Quick Start is tapped.
 */
export function trackQuickStartTapped() {
  trackFunnelStep('quick_start_tapped');
}

/**
 * Track when Quick Start completes (3 habits created).
 */
export function trackQuickStartCompleted(habitCount: number) {
  trackFunnelStep('quick_start_completed', { habitCount });
}

/**
 * Track when the first habit is created (funnel complete).
 */
export function trackFirstHabitCreated(source: 'chip' | 'typed' | 'quick_start' | 'template') {
  trackFunnelStep('first_habit_created', { source });
}
