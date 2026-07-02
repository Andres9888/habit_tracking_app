import { getHeroContext } from '../DetailHeroContext.utils';

describe('getHeroContext', () => {
  it('returns null when there is nothing notable', () => {
    expect(getHeroContext({})).toBeNull();
    expect(getHeroContext({ currentStreak: 2, bestStreak: 9 })).toBeNull();
  });

  it('celebrates a reached goal first', () => {
    const ctx = getHeroContext({
      currentStreak: 30,
      bestStreak: 30,
      goalDuration: 30,
    });
    expect(ctx).toEqual({
      emoji: '🏆',
      text: 'Goal reached',
      tone: 'goal',
      milestone: true,
    });
  });

  it('flags a personal-best streak over goal progress', () => {
    const ctx = getHeroContext({
      currentStreak: 12,
      bestStreak: 12,
      goalDuration: 30,
    });
    expect(ctx).toEqual({
      emoji: '🔥',
      text: 'Longest streak yet',
      tone: 'streak',
    });
  });

  it('counts down remaining days to a goal', () => {
    const ctx = getHeroContext({
      currentStreak: 17,
      bestStreak: 40,
      goalDuration: 30,
    });
    expect(ctx).toEqual({
      emoji: '🎯',
      text: '13 days to your 30-day goal',
      tone: 'goal',
    });
  });

  it('singularizes the final day', () => {
    expect(
      getHeroContext({ currentStreak: 29, bestStreak: 40, goalDuration: 30 })
        ?.text
    ).toBe('1 day to your 30-day goal');
  });

  it('shows an ongoing streak when no goal is set', () => {
    const ctx = getHeroContext({ currentStreak: 6, bestStreak: 21 });
    expect(ctx).toEqual({ emoji: '🔥', text: '6-day streak', tone: 'streak' });
  });

  it('stays quiet below the minimum streak with no goal', () => {
    expect(getHeroContext({ currentStreak: 2, bestStreak: 2 })).toBeNull();
  });
});
