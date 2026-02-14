/**
 * Conversion funnel event types and tracking functions.
 */

import { Platform } from 'react-native';

export type FunnelEvent =
  | 'app_open'
  | 'habit_created'
  | 'paywall_shown'
  | 'paywall_dismissed'
  | 'purchase_started'
  | 'purchase_completed'
  | 'purchase_cancelled'
  | 'purchase_failed'
  | 'restore_completed';

export type PaywallTriggerSource =
  | 'home_hero'
  | 'home_prompt'
  | 'habit_limit'
  | 'analytics_screen'
  | 'pro_badge'
  | 'settings'
  | 'onboarding'
  | 'motivation_upsell';

export interface PaywallImpressionContext {
  source: PaywallTriggerSource;
  habitCount?: number;
  dayCount?: number;
  abVariant?: string;
  [key: string]: unknown;
}

export interface ConversionEvent {
  event: FunnelEvent;
  timestamp: string;
  sessionId: string;
  context?: Record<string, unknown>;
}

let _sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const MAX_EVENTS = 500;
const _eventLog: ConversionEvent[] = [];

export function startNewSession(): void {
  _sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  trackFunnelEvent('app_open');
}

export function getEventLog(): ReadonlyArray<ConversionEvent> {
  return _eventLog;
}
export function clearEventLog(): void {
  _eventLog.length = 0;
}

async function syncToRevenueCat(attrs: Record<string, string>): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const { default: Purchases } = await import('react-native-purchases');
    await Purchases.setAttributes(attrs);
  } catch {
    /* RC may not be initialized */
  }
}

export function trackFunnelEvent(
  event: FunnelEvent,
  context?: Record<string, unknown>
): void {
  const entry: ConversionEvent = {
    context,
    event,
    sessionId: _sessionId,
    timestamp: new Date().toISOString(),
  };
  _eventLog.push(entry);
  if (_eventLog.length > MAX_EVENTS) _eventLog.shift();
  if (__DEV__) console.log(`[ConversionTracker] ${event}`, context ?? ''); // eslint-disable-line no-console

  if (event === 'paywall_shown' || event === 'purchase_completed') {
    const source = context?.source;
    const abVariant = context?.abVariant;
    void syncToRevenueCat({
      [`$last_${event}`]: entry.timestamp,
      ...(typeof source === 'string' ? { $lastPaywallSource: source } : {}),
      ...(typeof abVariant === 'string' ? { $abVariant: abVariant } : {}),
    });
  }
}

export function trackPaywallImpression(ctx: PaywallImpressionContext): void {
  trackFunnelEvent('paywall_shown', ctx as Record<string, unknown>);
}

export function trackPaywallDismissal(source: PaywallTriggerSource): void {
  trackFunnelEvent('paywall_dismissed', { source });
}

export function trackPurchaseStarted(
  source: PaywallTriggerSource,
  packageType?: string
): void {
  trackFunnelEvent('purchase_started', { packageType, source });
}

export function trackPurchaseCompleted(
  source: PaywallTriggerSource,
  packageType?: string
): void {
  trackFunnelEvent('purchase_completed', { packageType, source });
}

export function trackPurchaseCancelled(source: PaywallTriggerSource): void {
  trackFunnelEvent('purchase_cancelled', { source });
}

export function trackPurchaseFailed(
  source: PaywallTriggerSource,
  error?: string
): void {
  trackFunnelEvent('purchase_failed', { error, source });
}
