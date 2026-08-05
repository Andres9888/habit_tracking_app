import { settingsReturnValidator, updateArgsValidator } from './validators';

/**
 * Security regression guard for the premium self-grant vulnerability.
 *
 * `hasPremium` is a server-owned entitlement flag. It must NOT be accepted by
 * the client-facing `api.settings.update` mutation (whose args come from
 * `updateArgsValidator`), otherwise any authenticated user could call
 * `api.settings.update({ hasPremium: true })` and unlock premium for free.
 * It is still legitimately RETURNED by `api.settings.get`
 * (`settingsReturnValidator`) so the client can read entitlement state.
 */
describe('settings updateArgsValidator', () => {
  it('does NOT accept the server-owned hasPremium field', () => {
    expect(Object.keys(updateArgsValidator)).not.toContain('hasPremium');
  });

  it('still accepts normal user preference fields', () => {
    expect(Object.keys(updateArgsValidator)).toEqual(
      expect.arrayContaining(['appIcon', 'darkMode', 'showStreaks'])
    );
  });
});

describe('settings settingsReturnValidator', () => {
  it('still exposes hasPremium so the client can read entitlement', () => {
    expect(Object.keys(settingsReturnValidator.fields)).toContain('hasPremium');
  });
});
