import { isUsableAccentHex, pickUsableAccent } from './usableAccent';

describe('isUsableAccentHex', () => {
  it('rejects near-white hexes that vanish on the card', () => {
    expect(isUsableAccentHex('#FFFFFF')).toBe(false);
    expect(isUsableAccentHex('#fff')).toBe(false);
    expect(isUsableAccentHex('#F3F4F6')).toBe(false);
    expect(isUsableAccentHex('#DBEAFE')).toBe(false);
  });

  it('accepts the picker palette and dark greys', () => {
    for (const hex of [
      '#EF4444', '#F97316', '#FBBF24', '#10B981', '#14B8A6',
      '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#78716C',
    ]) {
      expect(isUsableAccentHex(hex)).toBe(true);
    }
    expect(isUsableAccentHex('#0F172A')).toBe(true);
  });

  it('rejects empty, named and malformed values', () => {
    expect(isUsableAccentHex(undefined)).toBe(false);
    expect(isUsableAccentHex(null)).toBe(false);
    expect(isUsableAccentHex('')).toBe(false);
    expect(isUsableAccentHex('white')).toBe(false);
    expect(isUsableAccentHex('#GGGGGG')).toBe(false);
  });
});

describe('pickUsableAccent', () => {
  it('skips unusable candidates in priority order', () => {
    expect(pickUsableAccent(undefined, '#FFFFFF', '#0EA5E9')).toBe('#0EA5E9');
    expect(pickUsableAccent('#EF4444', '#FFFFFF')).toBe('#EF4444');
  });

  it('returns undefined when nothing is usable', () => {
    expect(pickUsableAccent('#FFFFFF', undefined)).toBeUndefined();
    expect(pickUsableAccent()).toBeUndefined();
  });
});
