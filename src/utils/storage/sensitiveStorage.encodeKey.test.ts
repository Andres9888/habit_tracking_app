import { encodeSecureKey } from './sensitiveStorage';

describe('encodeSecureKey is injective', () => {
  it('does not collide a space-containing key with its literal escape form', () => {
    // Pre-fix bug: "a b" -> "a_20_b" and the literal "a_20_b" -> "a_20_b".
    expect(encodeSecureKey('a b')).not.toBe(encodeSecureKey('a_20_b'));
  });

  it('escapes underscores so escape sequences are unambiguous', () => {
    expect(encodeSecureKey('a_b')).toBe('a_5f_b');
    expect(encodeSecureKey('a b')).toBe('a_20_b');
  });

  it('leaves the safe alphabet untouched', () => {
    expect(encodeSecureKey('abc.DEF-123')).toBe('abc.DEF-123');
  });

  it('maps distinct inputs to distinct outputs across tricky pairs', () => {
    const inputs = [
      'a b',
      'a_20_b',
      'a_b',
      'a:b',
      'a/b',
      'clerk.token',
      'x_5f_y',
    ];
    const encoded = inputs.map(encodeSecureKey);
    expect(new Set(encoded).size).toBe(inputs.length);
  });
});
