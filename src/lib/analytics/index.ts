/**
 * Analytics Module
 * 
 * Centralized analytics, tracking, and experimentation infrastructure
 */

// Core analytics
export {
  analytics,
  trackEvent,
  trackScreen,
  setUserProperties,
  trackFunnelStep,
  startSession,
  endSession,
} from './service';

// Deep link analytics
export {
  parseDeepLink,
  storeDeepLinkAttribution,
  getDeepLinkAttribution,
  markDeepLinkConverted,
  clearDeepLinkAttribution,
  getAttributionSummary,
} from './deepLink';

// A/B testing
export {
  getExperimentVariant,
  trackExperimentExposure,
  trackExperimentGoal,
  getActiveExperiments,
  resetExperiments,
  useExperiment,
} from './experiments';

// Feature flags
export {
  isFeatureEnabled,
  getEnabledFeatures,
  refreshFeatureFlags,
  useFeatureFlag,
} from './featureFlags';

// Legacy interaction logging (backward compatible)
export { logInteraction } from './interactions';

// Types
export type {
  EventCategory,
  EventPriority,
  BaseEventProperties,
  UserProperties,
  SessionData,
  FunnelName,
  FunnelStep,
  ExperimentVariant,
  ExperimentConfig,
  DeepLinkEvent,
  FeatureFlag,
  AnalyticsProvider,
  CohortData,
} from './types';

// ============================================================================
// Convenience Helpers
// ============================================================================

/**
 * Track common engagement events
 */
export const EngagementEvents = {
  habitCreated: (habitId: string, templateId?: string) =>
    trackEvent('habit_created', {
      timestamp: Date.now(),
      sessionId: '',
      category: 'engagement',
      priority: 'high',
      habitId,
      templateId,
    }),

  habitCompleted: (habitId: string, streak: number) =>
    trackEvent('habit_completed', {
      timestamp: Date.now(),
      sessionId: '',
      category: 'engagement',
      priority: 'medium',
      habitId,
      streak,
    }),

  streakMilestone: (habitId: string, milestone: number) =>
    trackEvent('streak_milestone', {
      timestamp: Date.now(),
      sessionId: '',
      category: 'engagement',
      priority: 'high',
      habitId,
      milestone,
    }),

  appBackgrounded: () =>
    trackEvent('app_backgrounded', {
      timestamp: Date.now(),
      sessionId: '',
      category: 'engagement',
    }),

  appForegrounded: () =>
    trackEvent('app_foregrounded', {
      timestamp: Date.now(),
      sessionId: '',
      category: 'engagement',
    }),
};

/**
 * Track common conversion events
 */
export const ConversionEvents = {
  paywallViewed: (source: string, product?: string) =>
    trackEvent('paywall_viewed', {
      timestamp: Date.now(),
      sessionId: '',
      category: 'monetization',
      priority: 'critical',
      source,
      product,
    }),

  subscriptionStarted: (product: string, price: number) =>
    trackEvent('subscription_started', {
      timestamp: Date.now(),
      sessionId: '',
      category: 'monetization',
      priority: 'critical',
      product,
      price,
    }),

  subscriptionCompleted: (product: string, price: number, revenue: number) =>
    trackEvent('subscription_completed', {
      timestamp: Date.now(),
      sessionId: '',
      category: 'monetization',
      priority: 'critical',
      product,
      price,
      revenue,
    }),

  trialStarted: (product: string) =>
    trackEvent('trial_started', {
      timestamp: Date.now(),
      sessionId: '',
      category: 'monetization',
      priority: 'high',
      product,
    }),
};

/**
 * Track retention events
 */
export const RetentionEvents = {
  day1Return: () =>
    trackEvent('retention_day1', {
      timestamp: Date.now(),
      sessionId: '',
      category: 'retention',
      priority: 'critical',
    }),

  day7Return: () =>
    trackEvent('retention_day7', {
      timestamp: Date.now(),
      sessionId: '',
      category: 'retention',
      priority: 'critical',
    }),

  day30Return: () =>
    trackEvent('retention_day30', {
      timestamp: Date.now(),
      sessionId: '',
      category: 'retention',
      priority: 'critical',
    }),
};
