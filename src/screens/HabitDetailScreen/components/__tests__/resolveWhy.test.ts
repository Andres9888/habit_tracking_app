import { resolveWhy } from '../resolveWhy';

describe('resolveWhy', () => {
  it('prefers why over identity and wish', () => {
    const resolved = resolveWhy({
      identity: 'I start moving first.',
      why: 'Start the day with energy, not pressure.',
      woopWish: 'Move before the phone.',
    });
    expect(resolved).toEqual({
      icon: '💭',
      label: 'Your why',
      source: 'why',
      value: 'Start the day with energy, not pressure.',
    });
  });

  it('falls back to identity when why is empty', () => {
    const resolved = resolveWhy({
      identity: 'I start moving first.',
      why: '   ',
      woopWish: 'Move before the phone.',
    });
    expect(resolved?.source).toBe('identity');
    expect(resolved?.label).toBe("Who you're becoming");
  });

  it('falls back to wish when why and identity are empty', () => {
    const resolved = resolveWhy({
      identity: '',
      why: undefined,
      woopWish: 'Move before the phone.',
    });
    expect(resolved?.source).toBe('woopWish');
    expect(resolved?.label).toBe('Your wish');
    expect(resolved?.value).toBe('Move before the phone.');
  });

  it('returns null when nothing is written', () => {
    expect(
      resolveWhy({ identity: ' ', why: '', woopWish: undefined })
    ).toBeNull();
  });
});
