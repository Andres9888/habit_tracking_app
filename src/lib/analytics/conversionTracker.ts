/**
 * Conversion Funnel Tracker
 *
 * Tracks the full paywall conversion funnel and syncs to RevenueCat attributes.
 * @see ./conversionEvents.ts for event types and helpers
 */

export type {
  FunnelEvent,
  PaywallTriggerSource,
  PaywallImpressionContext,
  ConversionEvent,
} from './conversionEvents';
export {
  trackFunnelEvent,
  trackPaywallImpression,
  trackPaywallDismissal,
  trackPurchaseStarted,
  trackPurchaseCompleted,
  trackPurchaseCancelled,
  trackPurchaseFailed,
  startNewSession,
  getEventLog,
  clearEventLog,
} from './conversionEvents';
