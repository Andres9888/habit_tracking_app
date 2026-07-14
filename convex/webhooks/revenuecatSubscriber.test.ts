import { parseCanonicalRevenueCatSubscriberState } from './revenuecatSubscriber';

describe('parseCanonicalRevenueCatSubscriberState', () => {
  const now = Date.parse('2026-07-14T12:00:00.000Z');

  it('marks premium active from the canonical entitlement snapshot', () => {
    const result = parseCanonicalRevenueCatSubscriberState(
      {
        subscriber: {
          entitlements: {
            premium: {
              expires_date: '2026-08-14T12:00:00Z',
              product_identifier: 'chain_day_annual',
            },
          },
          original_app_user_id: 'user_123',
          subscriptions: {
            chain_day_annual: {
              expires_date: '2026-08-14T12:00:00Z',
              period_type: 'normal',
            },
          },
        },
      },
      now
    );

    expect(result).toMatchObject({
      expiresAt: Date.parse('2026-08-14T12:00:00Z'),
      hasBillingIssue: false,
      isActive: true,
      isTrialing: false,
      planType: 'yearly',
      productId: 'chain_day_annual',
      revenueCatId: 'user_123',
    });
  });

  it('keeps access during billing grace when the entitlement remains active', () => {
    const result = parseCanonicalRevenueCatSubscriberState(
      {
        subscriber: {
          entitlements: {
            premium: {
              expires_date: '2026-07-20T12:00:00Z',
              product_identifier: 'chain_day_monthly',
            },
          },
          subscriptions: {
            chain_day_monthly: {
              billing_issues_detected_at: '2026-07-13T12:00:00Z',
              grace_period_expires_date: '2026-07-21T12:00:00Z',
              period_type: 'trial',
            },
          },
        },
      },
      now
    );

    expect(result).toMatchObject({
      hasBillingIssue: true,
      isActive: true,
      isTrialing: true,
      planType: 'monthly',
      trialEndsAt: Date.parse('2026-07-20T12:00:00Z'),
    });
  });

  it('expires premium when the canonical entitlement is expired', () => {
    const result = parseCanonicalRevenueCatSubscriberState(
      {
        subscriber: {
          entitlements: {
            premium: {
              expires_date: '2026-07-01T12:00:00Z',
              product_identifier: 'chain_day_monthly',
            },
          },
        },
      },
      now
    );

    expect(result.isActive).toBe(false);
  });
});
