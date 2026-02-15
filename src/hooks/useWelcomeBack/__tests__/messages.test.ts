import {
  getWelcomeBackMessage,
  getRecoverySuggestion,
  getWelcomeEmoji,
} from '../messages';

describe('Welcome Back Messages', () => {
  it('returns short message for 2-3 days away', () => {
    expect(getWelcomeBackMessage(2)).toContain('missed you');
    expect(getWelcomeEmoji(2)).toBe('👋');
  });

  it('returns medium message for 4-7 days away', () => {
    expect(getWelcomeBackMessage(5)).toContain('back');
    expect(getWelcomeEmoji(5)).toBe('🌟');
  });

  it('returns long message for 8-14 days away', () => {
    expect(getWelcomeBackMessage(10)).toContain('fresh start');
    expect(getWelcomeEmoji(10)).toBe('🌱');
  });

  it('returns very long message for 15+ days away', () => {
    expect(getWelcomeBackMessage(20)).toContain('rebuild');
    expect(getWelcomeEmoji(20)).toBe('💪');
  });

  it('returns recovery suggestion for each tier', () => {
    expect(getRecoverySuggestion(2)).toContain('restart');
    expect(getRecoverySuggestion(5)).toContain('Start small');
    expect(getRecoverySuggestion(10)).toContain('No pressure');
    expect(getRecoverySuggestion(20)).toContain('right now');
  });
});
