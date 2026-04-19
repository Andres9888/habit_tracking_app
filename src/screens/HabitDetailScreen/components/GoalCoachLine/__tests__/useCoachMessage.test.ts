/**
 * useCoachMessage — Bracket coverage for all six coach states.
 */
import { useCoachMessage } from '../GoalCoachLine.hooks';

describe('useCoachMessage', () => {
  it('returns done when at/above 100%', () => {
    expect(
      useCoachMessage({ bestStreak: 66, currentStreak: 66, streakGoal: 66 }).tone
    ).toBe('done');
    expect(
      useCoachMessage({ bestStreak: 70, currentStreak: 70, streakGoal: 66 }).tone
    ).toBe('done');
  });

  it('returns reset when current is 0 but best > 0', () => {
    const result = useCoachMessage({
      bestStreak: 23,
      currentStreak: 0,
      streakGoal: 66,
    });
    expect(result.tone).toBe('reset');
    expect(result.emoji).toBe('🔁');
  });

  it('returns start when progress < 10%', () => {
    expect(
      useCoachMessage({ bestStreak: 3, currentStreak: 3, streakGoal: 66 }).tone
    ).toBe('start');
  });

  it('returns build between 10% and 40%', () => {
    expect(
      useCoachMessage({ bestStreak: 15, currentStreak: 15, streakGoal: 66 }).tone
    ).toBe('build');
  });

  it('returns mid between 40% and 70%', () => {
    expect(
      useCoachMessage({ bestStreak: 35, currentStreak: 35, streakGoal: 66 }).tone
    ).toBe('mid');
  });

  it('returns home between 70% and 100%', () => {
    expect(
      useCoachMessage({ bestStreak: 56, currentStreak: 56, streakGoal: 66 }).tone
    ).toBe('home');
  });

  it('falls back safely when streakGoal is 0', () => {
    const result = useCoachMessage({
      bestStreak: 0,
      currentStreak: 0,
      streakGoal: 0,
    });
    expect(result.tone).toBe('start');
  });

  it('returns start (not reset) when never completed and best is 0', () => {
    const result = useCoachMessage({
      bestStreak: 0,
      currentStreak: 0,
      streakGoal: 66,
    });
    expect(result.tone).toBe('start');
  });
});
