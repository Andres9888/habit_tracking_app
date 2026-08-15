import { calculateStreakFromHistory } from './historyCalculation';

const completed = (date: string) => ({ completed: true, date });

describe('calculateStreakFromHistory pause handling', () => {
  it('holds the streak across a multi-day pause until resume', () => {
    const result = calculateStreakFromHistory(
      [
        completed('2026-01-01'),
        completed('2026-01-02'),
        completed('2026-01-03'),
      ],
      '2026-01-10',
      {
        pausedAt: Date.parse('2026-01-04T12:00:00Z'),
        resumedAt: Date.parse('2026-01-10T12:00:00Z'),
        timezone: 'UTC',
      }
    );

    expect(result.currentStreak).toBe(3);
    expect(result.bestStreak).toBe(3);
    expect(result.lastCompletedDate).toBe('2026-01-03');
  });

  it('continues the streak when the user completes on the resume day', () => {
    const result = calculateStreakFromHistory(
      [
        completed('2026-01-01'),
        completed('2026-01-02'),
        completed('2026-01-03'),
        completed('2026-01-10'),
      ],
      '2026-01-10',
      {
        pausedAt: Date.parse('2026-01-04T12:00:00Z'),
        resumedAt: Date.parse('2026-01-10T12:00:00Z'),
        timezone: 'UTC',
      }
    );

    expect(result.currentStreak).toBe(4);
    expect(result.bestStreak).toBe(4);
    expect(result.lastCompletedDate).toBe('2026-01-10');
  });

  it('keeps a same-day completion when pausing later that calendar day', () => {
    const result = calculateStreakFromHistory(
      [completed('2026-01-15')],
      '2026-01-16',
      {
        pausedAt: Date.parse('2026-01-16T04:00:00Z'),
        timezone: 'America/Los_Angeles',
      }
    );

    expect(result.currentStreak).toBe(1);
    expect(result.lastCompletedDate).toBe('2026-01-15');
  });

  it('treats a re-pause as currently paused when resumedAt is stale', () => {
    const result = calculateStreakFromHistory(
      [completed('2026-01-16'), completed('2026-01-17')],
      '2026-01-20',
      {
        pausedAt: Date.parse('2026-01-18T12:00:00Z'),
        resumedAt: Date.parse('2026-01-10T12:00:00Z'),
        timezone: 'UTC',
      }
    );

    expect(result.currentStreak).toBe(2);
    expect(result.lastCompletedDate).toBe('2026-01-17');
  });
});
