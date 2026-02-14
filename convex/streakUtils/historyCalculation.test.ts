import { calculateStreakFromHistory } from './historyCalculation';

describe('calculateStreakFromHistory', () => {
  it('returns zeroed streak data when there are no completed records', () => {
    const result = calculateStreakFromHistory(
      [
        { date: '2026-02-10', completed: false },
        { date: '2026-02-11', completed: false },
      ],
      '2026-02-12'
    );

    expect(result).toEqual({
      bestStreak: 0,
      currentStreak: 0,
      lastCompletedDate: '',
    });
  });

  it('computes current streak when completions are consecutive up to today', () => {
    const result = calculateStreakFromHistory(
      [
        { date: '2026-02-10', completed: true },
        { date: '2026-02-11', completed: true },
        { date: '2026-02-12', completed: true },
      ],
      '2026-02-12'
    );

    expect(result.currentStreak).toBe(3);
    expect(result.bestStreak).toBe(3);
    expect(result.lastCompletedDate).toBe('2026-02-12');
  });

  it('keeps streak alive when last completion was yesterday (streak freeze/grace behavior)', () => {
    const result = calculateStreakFromHistory(
      [
        { date: '2026-02-09', completed: true },
        { date: '2026-02-10', completed: true },
        { date: '2026-02-11', completed: true },
      ],
      '2026-02-12'
    );

    expect(result.currentStreak).toBe(3);
    expect(result.bestStreak).toBe(3);
    expect(result.lastCompletedDate).toBe('2026-02-11');
  });

  it('breaks current streak if last completion is older than yesterday', () => {
    const result = calculateStreakFromHistory(
      [
        { date: '2026-02-06', completed: true },
        { date: '2026-02-07', completed: true },
        { date: '2026-02-08', completed: true },
      ],
      '2026-02-12'
    );

    expect(result.currentStreak).toBe(0);
    expect(result.bestStreak).toBe(3);
    expect(result.lastCompletedDate).toBe('2026-02-08');
  });

  it('handles duplicate completion dates without inflating streaks', () => {
    const result = calculateStreakFromHistory(
      [
        { date: '2026-02-10', completed: true },
        { date: '2026-02-10', completed: true },
        { date: '2026-02-11', completed: true },
        { date: '2026-02-11', completed: true },
        { date: '2026-02-12', completed: true },
      ],
      '2026-02-12'
    );

    expect(result.currentStreak).toBe(3);
    expect(result.bestStreak).toBe(3);
  });

  it('tracks best streak even when current streak is lower', () => {
    const result = calculateStreakFromHistory(
      [
        { date: '2026-01-01', completed: true },
        { date: '2026-01-02', completed: true },
        { date: '2026-01-03', completed: true },
        { date: '2026-01-04', completed: true },
        { date: '2026-02-10', completed: true },
        { date: '2026-02-11', completed: true },
      ],
      '2026-02-12'
    );

    expect(result.currentStreak).toBe(2);
    expect(result.bestStreak).toBe(4);
  });
});
