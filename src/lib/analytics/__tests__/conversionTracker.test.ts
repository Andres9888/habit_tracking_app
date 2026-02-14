import {
  trackFunnelEvent,
  trackPaywallImpression,
  trackPaywallDismissal,
  trackPurchaseStarted,
  trackPurchaseCompleted,
  startNewSession,
  getEventLog,
  clearEventLog,
} from '../conversionTracker';

describe('conversionTracker', () => {
  beforeEach(() => {
    clearEventLog();
  });

  it('tracks funnel events with timestamps', () => {
    trackFunnelEvent('app_open');
    const log = getEventLog();
    expect(log).toHaveLength(1);
    expect(log[0].event).toBe('app_open');
    expect(log[0].timestamp).toBeTruthy();
    expect(log[0].sessionId).toBeTruthy();
  });

  it('tracks paywall impressions with context', () => {
    trackPaywallImpression({
      source: 'home_hero',
      habitCount: 3,
      dayCount: 7,
      abVariant: 'urgency',
    });
    const log = getEventLog();
    expect(log).toHaveLength(1);
    expect(log[0].event).toBe('paywall_shown');
    expect(log[0].context).toMatchObject({
      source: 'home_hero',
      habitCount: 3,
      dayCount: 7,
      abVariant: 'urgency',
    });
  });

  it('tracks paywall dismissals', () => {
    trackPaywallDismissal('habit_limit');
    const log = getEventLog();
    expect(log[0].event).toBe('paywall_dismissed');
    expect(log[0].context).toMatchObject({ source: 'habit_limit' });
  });

  it('tracks purchase flow events', () => {
    trackPurchaseStarted('home_hero', 'MONTHLY');
    trackPurchaseCompleted('home_hero', 'MONTHLY');
    const log = getEventLog();
    expect(log).toHaveLength(2);
    expect(log[0].event).toBe('purchase_started');
    expect(log[1].event).toBe('purchase_completed');
  });

  it('starts new session with app_open event', () => {
    clearEventLog();
    startNewSession();
    const log = getEventLog();
    expect(log).toHaveLength(1);
    expect(log[0].event).toBe('app_open');
  });

  it('maintains ring buffer of MAX_EVENTS', () => {
    for (let i = 0; i < 600; i++) {
      trackFunnelEvent('app_open');
    }
    expect(getEventLog().length).toBeLessThanOrEqual(500);
  });

  it('tracks full conversion funnel in order', () => {
    clearEventLog();
    startNewSession();
    trackFunnelEvent('habit_created', { name: 'Exercise' });
    trackPaywallImpression({ source: 'habit_limit', habitCount: 3 });
    trackPurchaseStarted('habit_limit', 'ANNUAL');
    trackPurchaseCompleted('habit_limit', 'ANNUAL');

    const events = getEventLog().map((e) => e.event);
    expect(events).toEqual([
      'app_open',
      'habit_created',
      'paywall_shown',
      'purchase_started',
      'purchase_completed',
    ]);
  });
});
