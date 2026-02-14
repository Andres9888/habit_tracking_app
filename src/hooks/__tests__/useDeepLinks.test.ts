import { parseDeepLink } from '../useDeepLinks';

describe('parseDeepLink', () => {
  it('parses custom scheme habit route', () => {
    const result = parseDeepLink('habit-tracker://habit/abc123');
    expect(result).toEqual({ path: 'habit', habitId: 'abc123', raw: 'habit-tracker://habit/abc123' });
  });

  it('parses custom scheme toggle route', () => {
    const result = parseDeepLink('habit-tracker://toggle/xyz');
    expect(result).toEqual({ path: 'toggle', habitId: 'xyz', raw: 'habit-tracker://toggle/xyz' });
  });

  it('parses custom scheme settings route', () => {
    const result = parseDeepLink('habit-tracker://settings');
    expect(result).toEqual({ path: 'settings', raw: 'habit-tracker://settings' });
  });

  it('parses custom scheme premium route', () => {
    const result = parseDeepLink('habit-tracker://premium');
    expect(result).toEqual({ path: 'premium', raw: 'habit-tracker://premium' });
  });

  it('parses universal link habit route', () => {
    const result = parseDeepLink('https://chainday.app/habit/abc123');
    expect(result).toEqual({ path: 'habit', habitId: 'abc123', raw: 'https://chainday.app/habit/abc123' });
  });

  it('parses universal link toggle route', () => {
    const result = parseDeepLink('https://chainday.app/toggle/xyz');
    expect(result).toEqual({ path: 'toggle', habitId: 'xyz', raw: 'https://chainday.app/toggle/xyz' });
  });

  it('parses universal link settings', () => {
    const result = parseDeepLink('https://chainday.app/settings');
    expect(result).toEqual({ path: 'settings', raw: 'https://chainday.app/settings' });
  });

  it('parses universal link premium', () => {
    const result = parseDeepLink('https://chainday.app/premium');
    expect(result).toEqual({ path: 'premium', raw: 'https://chainday.app/premium' });
  });

  it('handles trailing slashes', () => {
    const result = parseDeepLink('habit-tracker://settings/');
    expect(result.path).toBe('settings');
  });

  it('returns unknown for unrecognized routes', () => {
    const result = parseDeepLink('habit-tracker://foo/bar');
    expect(result.path).toBe('unknown');
  });

  it('returns unknown for malformed URLs', () => {
    const result = parseDeepLink('not a url');
    expect(result.path).toBe('unknown');
  });
});
