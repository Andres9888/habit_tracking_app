/**
 * Security regression test (P0): premium self-grant via settings mass-assignment.
 *
 * `settings.update` is a public mutation. `hasPremium` is an entitlement field
 * that must be writable ONLY by the RevenueCat webhook
 * (subscriptions.grantPremium/revokePremium). If it appears in the public
 * update args validator, any authenticated user can self-grant premium by
 * calling settings.update({ hasPremium: true }).
 *
 * These tests fail if that hole is ever reintroduced.
 */
import { updateArgsValidator } from './validators';

const ENTITLEMENT_FIELDS = [
  'hasPremium',
  'isPremium',
  'entitlement',
  'premiumUntil',
  'subscriptionStatus',
  'isAdmin',
  'role',
];

describe('SEC: settings.update must not accept entitlement fields', () => {
  const keys = Object.keys(updateArgsValidator);

  it('does not expose hasPremium in the public update args', () => {
    expect(keys).not.toContain('hasPremium');
  });

  it.each(ENTITLEMENT_FIELDS)(
    'does not expose entitlement field "%s" in the public update args',
    (field) => {
      expect(keys).not.toContain(field);
    }
  );
});
