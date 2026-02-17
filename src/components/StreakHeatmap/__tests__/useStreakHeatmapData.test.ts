/**
 * useStreakHeatmapData Tests
 */

import { renderHook } from '@testing-library/react-native';
import { useStreakHeatmapData } from '../useStreakHeatmapData';

describe('useStreakHeatmapData', () => {
  it('returns correct grid dimensions', () => {
    const dates = new Set<string>();
    const { result } = renderHook(() => useStreakHeatmapData(dates, 16));

    expect(result.current).toHaveLength(16); // 16 weeks
    result.current.forEach((week) => {
      expect(week).toHaveLength(7); // 7 days per week
    });
  });

  it('marks completed dates with intensity > 0', () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const dates = new Set([dateStr]);

    const { result } = renderHook(() => useStreakHeatmapData(dates, 4));

    const allDays = result.current.flat();
    const todayCell = allDays.find((d) => d.date === dateStr);

    expect(todayCell).toBeDefined();
    expect(todayCell!.completed).toBe(true);
    expect(todayCell!.intensity).toBeGreaterThan(0);
    expect(todayCell!.isToday).toBe(true);
  });

  it('gives higher intensity for consecutive days', () => {
    // Create 7 consecutive days ending today
    const today = new Date();
    const dates = new Set<string>();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.add(d.toISOString().split('T')[0]);
    }

    const { result } = renderHook(() => useStreakHeatmapData(dates, 4));
    const allDays = result.current.flat();
    const todayCell = allDays.find((d) => d.date === today.toISOString().split('T')[0]);

    // Today should have high intensity (surrounded by completions)
    expect(todayCell!.intensity).toBeGreaterThanOrEqual(3);
  });

  it('marks future dates correctly', () => {
    const dates = new Set<string>();
    const { result } = renderHook(() => useStreakHeatmapData(dates, 4));

    const allDays = result.current.flat();
    const futureDays = allDays.filter((d) => d.isFuture);

    futureDays.forEach((day) => {
      expect(day.intensity).toBe(0);
      expect(day.completed).toBe(false);
    });
  });

  it('returns intensity 0 for uncompleted days', () => {
    const dates = new Set<string>();
    const { result } = renderHook(() => useStreakHeatmapData(dates, 4));

    const allDays = result.current.flat().filter((d) => !d.isFuture);
    allDays.forEach((day) => {
      expect(day.intensity).toBe(0);
    });
  });
});
