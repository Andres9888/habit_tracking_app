import { renderHook } from '@testing-library/react-native';
import { useMonthInsights } from '../useMonthInsights';

describe('useMonthInsights', () => {
  const june2026 = new Date(2026, 5, 15);

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 5, 15, 12, 0, 0));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns weekRate and monthRate instead of strongestDay', () => {
    const completedDates = new Set([
      '2026-06-09',
      '2026-06-10',
      '2026-06-11',
      '2026-06-12',
      '2026-06-13',
      '2026-06-14',
      '2026-06-15',
    ]);

    const { result } = renderHook(() =>
      useMonthInsights(completedDates, june2026)
    );

    expect(result.current).toMatchObject({
      weekRate: expect.any(Number),
      monthRate: expect.any(Number),
      bestRun: expect.any(Number),
      currentStreak: expect.any(Number),
    });
    expect(result.current).not.toHaveProperty('strongestDay');
    expect(result.current.weekRate).toBeGreaterThan(0);
    expect(result.current.monthRate).toBeGreaterThan(0);
  });

  it('returns 0 weekRate when no days completed this week', () => {
    const { result } = renderHook(() => useMonthInsights(new Set(), june2026));

    expect(result.current.weekRate).toBe(0);
  });

  it('starts monthRate at the habit creation date', () => {
    const completedDates = new Set([
      '2026-06-10',
      '2026-06-11',
      '2026-06-12',
      '2026-06-13',
      '2026-06-14',
      '2026-06-15',
    ]);

    const { result } = renderHook(() =>
      useMonthInsights(
        completedDates,
        june2026,
        new Date(2026, 5, 10).getTime()
      )
    );

    expect(result.current.monthRate).toBe(100);
  });
});
