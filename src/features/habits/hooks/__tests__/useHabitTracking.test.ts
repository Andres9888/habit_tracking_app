/**
 * Tests for useHabitTracking hook
 *
 * Critical hook for habit completion tracking logic.
 * Tests cover:
 * - Completed dates tracking
 * - Streak calculation
 * - Habit status determination (done/missed/planned)
 * - Edge cases (empty data, past dates, future dates)
 */

import { renderHook } from '@testing-library/react-native';
import { useHabitTracking } from '../useHabitTracking';

describe('useHabitTracking', () => {
  const today = new Date('2024-02-10T12:00:00Z');
  today.setHours(0, 0, 0, 0);

  describe('completedDatesByHabit', () => {
    it('should return empty map when no tracking data exists', () => {
      const { result } = renderHook(() => useHabitTracking([], today));

      expect(result.current.completedDatesByHabit.size).toBe(0);
    });

    it('should build map of completed dates by habit', () => {
      const tracking = [
        { habitId: 'habit1', date: '2024-02-10', completed: true },
        { habitId: 'habit1', date: '2024-02-09', completed: true },
        { habitId: 'habit2', date: '2024-02-10', completed: true },
        { habitId: 'habit1', date: '2024-02-08', completed: false },
      ];

      const { result } = renderHook(() => useHabitTracking(tracking, today));

      const map = result.current.completedDatesByHabit;
      expect(map.size).toBe(2);
      expect(map.get('habit1')?.size).toBe(2);
      expect(map.get('habit1')?.has('2024-02-10')).toBe(true);
      expect(map.get('habit1')?.has('2024-02-09')).toBe(true);
      expect(map.get('habit2')?.size).toBe(1);
      expect(map.get('habit2')?.has('2024-02-10')).toBe(true);
    });

    it('should ignore entries without completed flag', () => {
      const tracking = [
        { habitId: 'habit1', date: '2024-02-10', completed: true },
        { habitId: 'habit1', date: '2024-02-09', completed: false },
        { habitId: 'habit1', date: '2024-02-08' }, // no completed field
      ];

      const { result } = renderHook(() => useHabitTracking(tracking, today));

      const completedDates = result.current.completedDatesByHabit.get('habit1');
      expect(completedDates?.size).toBe(1);
      expect(completedDates?.has('2024-02-10')).toBe(true);
    });

    it('should update when tracking data changes', () => {
      const tracking1 = [
        { habitId: 'habit1', date: '2024-02-10', completed: true },
      ];

      const { result, rerender } = renderHook(
        ({ tracking, today }) => useHabitTracking(tracking, today),
        { initialProps: { tracking: tracking1, today } }
      );

      expect(result.current.completedDatesByHabit.get('habit1')?.size).toBe(1);

      const tracking2 = [
        { habitId: 'habit1', date: '2024-02-10', completed: true },
        { habitId: 'habit1', date: '2024-02-09', completed: true },
      ];

      rerender({ tracking: tracking2, today });

      expect(result.current.completedDatesByHabit.get('habit1')?.size).toBe(2);
    });
  });

  describe('getStreak', () => {
    it('should return 0 for habit with no completions', () => {
      const { result } = renderHook(() => useHabitTracking([], today));

      expect(result.current.getStreak('habit1')).toBe(0);
    });

    it('should calculate current streak correctly for consecutive days', () => {
      const tracking = [
        { habitId: 'habit1', date: '2024-02-10', completed: true }, // today
        { habitId: 'habit1', date: '2024-02-09', completed: true },
        { habitId: 'habit1', date: '2024-02-08', completed: true },
        { habitId: 'habit1', date: '2024-02-06', completed: true }, // gap here
      ];

      const { result } = renderHook(() => useHabitTracking(tracking, today));

      // Should have 3-day streak (10, 09, 08)
      expect(result.current.getStreak('habit1')).toBe(3);
    });

    it('should return 1 for single day completion today', () => {
      const tracking = [
        { habitId: 'habit1', date: '2024-02-10', completed: true },
      ];

      const { result } = renderHook(() => useHabitTracking(tracking, today));

      expect(result.current.getStreak('habit1')).toBe(1);
    });

    it('should return 0 if streak was broken yesterday', () => {
      const tracking = [
        { habitId: 'habit1', date: '2024-02-10', completed: true }, // today
        // missing 2024-02-09 (yesterday) - breaks streak
        { habitId: 'habit1', date: '2024-02-08', completed: true },
      ];

      const { result } = renderHook(() => useHabitTracking(tracking, today));

      // Streak broken, should start fresh from today
      expect(result.current.getStreak('habit1')).toBe(1);
    });

    it('should handle different habits independently', () => {
      const tracking = [
        { habitId: 'habit1', date: '2024-02-10', completed: true },
        { habitId: 'habit1', date: '2024-02-09', completed: true },
        { habitId: 'habit2', date: '2024-02-10', completed: true },
      ];

      const { result } = renderHook(() => useHabitTracking(tracking, today));

      expect(result.current.getStreak('habit1')).toBe(2);
      expect(result.current.getStreak('habit2')).toBe(1);
    });
  });

  describe('getHabitStatus', () => {
    it('should return "done" for completed habit on specific date', () => {
      const tracking = [
        { habitId: 'habit1', date: '2024-02-10', completed: true },
      ];

      const { result } = renderHook(() => useHabitTracking(tracking, today));

      expect(result.current.getHabitStatus('habit1', '2024-02-10')).toBe(
        'done'
      );
    });

    it('should return "missed" for uncompleted habit on past date', () => {
      const tracking = [
        { habitId: 'habit1', date: '2024-02-09', completed: false },
      ];

      const { result } = renderHook(() => useHabitTracking(tracking, today));

      expect(result.current.getHabitStatus('habit1', '2024-02-09')).toBe(
        'missed'
      );
    });

    it('should return "missed" for habit with no tracking entry on past date', () => {
      const { result } = renderHook(() => useHabitTracking([], today));

      expect(result.current.getHabitStatus('habit1', '2024-02-09')).toBe(
        'missed'
      );
    });

    it('should return "planned" for future dates', () => {
      const { result } = renderHook(() => useHabitTracking([], today));

      expect(result.current.getHabitStatus('habit1', '2024-02-11')).toBe(
        'planned'
      );
      expect(result.current.getHabitStatus('habit1', '2024-02-15')).toBe(
        'planned'
      );
    });

    it('should return "planned" for today if not completed', () => {
      const { result } = renderHook(() => useHabitTracking([], today));

      expect(result.current.getHabitStatus('habit1', '2024-02-10')).toBe(
        'planned'
      );
    });

    it('should handle edge case of today completed', () => {
      const tracking = [
        { habitId: 'habit1', date: '2024-02-10', completed: true },
      ];

      const { result } = renderHook(() => useHabitTracking(tracking, today));

      expect(result.current.getHabitStatus('habit1', '2024-02-10')).toBe(
        'done'
      );
    });

    it('should correctly handle dates at midnight boundary', () => {
      const tracking = [
        { habitId: 'habit1', date: '2024-02-09', completed: true },
      ];

      const { result } = renderHook(() => useHabitTracking(tracking, today));

      // Yesterday should be marked as done
      expect(result.current.getHabitStatus('habit1', '2024-02-09')).toBe(
        'done'
      );

      // Day before yesterday, not completed, should be missed
      expect(result.current.getHabitStatus('habit1', '2024-02-08')).toBe(
        'missed'
      );
    });

    it('should update status when tracking changes', () => {
      const tracking1 = [];

      const { result, rerender } = renderHook(
        ({ tracking, today }) => useHabitTracking(tracking, today),
        { initialProps: { tracking: tracking1, today } }
      );

      expect(result.current.getHabitStatus('habit1', '2024-02-10')).toBe(
        'planned'
      );

      const tracking2 = [
        { habitId: 'habit1', date: '2024-02-10', completed: true },
      ];

      rerender({ tracking: tracking2, today });

      expect(result.current.getHabitStatus('habit1', '2024-02-10')).toBe(
        'done'
      );
    });
  });

  describe('edge cases', () => {
    it('should handle null/undefined tracking entries gracefully', () => {
      const tracking = [
        { habitId: 'habit1', date: '2024-02-10', completed: true },
        null as any,
        undefined as any,
        { habitId: 'habit2', date: '2024-02-10', completed: true },
      ];

      const { result } = renderHook(() => useHabitTracking(tracking, today));

      expect(result.current.completedDatesByHabit.size).toBe(2);
    });

    it('should handle very long streaks correctly', () => {
      const tracking = [];
      for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        tracking.push({
          habitId: 'habit1',
          date: date.toISOString().split('T')[0],
          completed: true,
        });
      }

      const { result } = renderHook(() => useHabitTracking(tracking, today));

      expect(result.current.getStreak('habit1')).toBe(365);
    });

    it('should handle multiple habits with overlapping dates', () => {
      const tracking = [
        { habitId: 'habit1', date: '2024-02-10', completed: true },
        { habitId: 'habit2', date: '2024-02-10', completed: true },
        { habitId: 'habit3', date: '2024-02-10', completed: true },
        { habitId: 'habit1', date: '2024-02-09', completed: true },
        { habitId: 'habit2', date: '2024-02-09', completed: false },
      ];

      const { result } = renderHook(() => useHabitTracking(tracking, today));

      expect(result.current.getHabitStatus('habit1', '2024-02-10')).toBe(
        'done'
      );
      expect(result.current.getHabitStatus('habit2', '2024-02-10')).toBe(
        'done'
      );
      expect(result.current.getHabitStatus('habit3', '2024-02-10')).toBe(
        'done'
      );
      expect(result.current.getHabitStatus('habit1', '2024-02-09')).toBe(
        'done'
      );
      expect(result.current.getHabitStatus('habit2', '2024-02-09')).toBe(
        'missed'
      );
    });

    it('should handle timezone-aware date comparisons', () => {
      // Create today with specific timezone consideration
      const todayWithTime = new Date('2024-02-10T23:59:59Z');
      todayWithTime.setHours(0, 0, 0, 0);

      const tracking = [
        { habitId: 'habit1', date: '2024-02-10', completed: true },
      ];

      const { result } = renderHook(() =>
        useHabitTracking(tracking, todayWithTime)
      );

      expect(result.current.getHabitStatus('habit1', '2024-02-10')).toBe(
        'done'
      );
      expect(result.current.getHabitStatus('habit1', '2024-02-09')).toBe(
        'missed'
      );
      expect(result.current.getHabitStatus('habit1', '2024-02-11')).toBe(
        'planned'
      );
    });
  });
});
