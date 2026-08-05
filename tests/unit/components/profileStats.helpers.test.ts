import { buildProfileStats } from '@/components/SettingsModal/profileStats.helpers';

describe('buildProfileStats', () => {
  it('returns zeros when there are no active habits', () => {
    expect(buildProfileStats([], [])).toEqual({
      activeHabits: 0,
      flawlessDays: 0,
      lifetimeCompletions: 0,
    });
  });

  it('counts active habits, flawless days, and lifetime completions', () => {
    const habits = [{ _id: 'h1' }, { _id: 'h2' }];
    const tracking = [
      { habitId: 'h1', date: '2026-06-01', completed: true },
      { habitId: 'h2', date: '2026-06-01', completed: true },
      { habitId: 'h1', date: '2026-06-02', completed: true },
      { habitId: 'h2', date: '2026-06-02', completed: false },
      { habitId: 'h1', date: '2026-06-03', completed: true },
    ];

    expect(buildProfileStats(habits, tracking)).toEqual({
      activeHabits: 2,
      flawlessDays: 1,
      lifetimeCompletions: 4,
    });
  });
});
