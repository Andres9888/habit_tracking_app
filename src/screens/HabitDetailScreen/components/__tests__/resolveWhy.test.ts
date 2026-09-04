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
      isTemplateWhy: false,
      label: 'Your why',
      source: 'why',
      value: 'Start the day with energy, not pressure.',
    });
  });

  it('labels a why that still equals the template sentence "Why it works"', () => {
    const resolved = resolveWhy({
      templateWhy: 'Sunlight early anchors the circadian clock.  ',
      why: 'Sunlight early anchors the circadian clock.',
    });
    expect(resolved?.isTemplateWhy).toBe(true);
    expect(resolved?.label).toBe('Why it works');
    expect(resolved?.source).toBe('why');
  });

  it('labels an edited why "Your why" even when a template why exists', () => {
    const resolved = resolveWhy({
      templateWhy: 'Sunlight early anchors the circadian clock.',
      why: 'I want mornings that do not feel like fog.',
    });
    expect(resolved?.isTemplateWhy).toBe(false);
    expect(resolved?.label).toBe('Your why');
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
