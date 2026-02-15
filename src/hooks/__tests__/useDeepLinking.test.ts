jest.mock('@sentry/react-native', () => ({
  addBreadcrumb: jest.fn(),
  captureException: jest.fn(),
}));

jest.mock('expo-linking', () => ({
  parse: jest.requireActual('expo-linking').parse,
  getInitialURL: jest.fn().mockResolvedValue(null),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
}));

import { parseDeepLink } from '../useDeepLinking';

describe('parseDeepLink', () => {
  it('parses universal link for habit', () => {
    const result = parseDeepLink('https://chainday.app/habit/abc123');
    expect(result).toEqual({ type: 'habit', habitId: 'abc123' });
  });

  it('parses universal link for share', () => {
    const result = parseDeepLink('https://chainday.app/share/share-id-1');
    expect(result).toEqual({ type: 'share', shareId: 'share-id-1' });
  });

  it('parses universal link for referral', () => {
    const result = parseDeepLink('https://chainday.app/referral/REF_CODE');
    expect(result).toEqual({ type: 'referral', code: 'REF_CODE' });
  });

  it('returns null for root URL (no path)', () => {
    expect(parseDeepLink('https://chainday.app')).toBeNull();
    expect(parseDeepLink('https://chainday.app/')).toBeNull();
  });

  it('returns unknown for unrecognised route', () => {
    const url = 'https://chainday.app/settings/foo';
    const result = parseDeepLink(url);
    expect(result).toEqual({ type: 'unknown', url });
  });

  it('returns unknown for habit route with missing ID', () => {
    const url = 'https://chainday.app/habit';
    const result = parseDeepLink(url);
    expect(result).toEqual({ type: 'unknown', url });
  });

  it('rejects IDs with special characters', () => {
    const url = 'https://chainday.app/habit/<script>alert(1)</script>';
    const result = parseDeepLink(url);
    expect(result).toEqual({ type: 'unknown', url });
  });

  it('rejects excessively long IDs', () => {
    const longId = 'a'.repeat(200);
    const url = `https://chainday.app/habit/${longId}`;
    const result = parseDeepLink(url);
    expect(result).toEqual({ type: 'unknown', url });
  });

  it('handles empty string without crashing', () => {
    expect(parseDeepLink('')).toBeNull();
  });

  it('handles completely malformed URL without crashing', () => {
    expect(() => parseDeepLink('not a url at all ::: ???')).not.toThrow();
  });
});
