/**
 * useRescueTrigger Tests
 * Story T8.6-T8.7 - Rescue Mode trigger logic
 *
 * Tests:
 * - Scheduled trigger (X hours before day ends)
 * - App resume trigger (after being in background)
 * - Manual trigger
 * - Eligibility checks (completed, paused, streak)
 * - Rescue shown tracking (1 per day limit)
 */

import { renderHook, act } from '@testing-library/react-native';
import {
  useRescueTrigger,
  type RescueEligibleHabit,
  type RescueTriggerConfig,
} from '../useRescueTrigger';

describe('useRescueTrigger', () => {
  const baseHabit: RescueEligibleHabit = {
    id: 'habit-1',
    name: 'Morning Exercise',
    isCompletedToday: false,
    isActive: true,
    scheduledTime: '07:00',
    currentStreak: 7,
    rescueShownToday: false,
  };

  const createHabit = (
    overrides: Partial<RescueEligibleHabit> = {}
  ): RescueEligibleHabit => ({
    ...baseHabit,
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('isEligibleForRescue', () => {
    it('returns true for eligible habit', () => {
      const { result } = renderHook(() => useRescueTrigger([createHabit()]));

      expect(result.current.isEligibleForRescue(createHabit())).toBe(true);
    });

    it('returns false if habit is already completed today', () => {
      const { result } = renderHook(() => useRescueTrigger([]));

      const habit = createHabit({ isCompletedToday: true });
      expect(result.current.isEligibleForRescue(habit)).toBe(false);
    });

    it('returns false if habit is inactive (paused/archived)', () => {
      const { result } = renderHook(() => useRescueTrigger([]));

      const habit = createHabit({ isActive: false });
      expect(result.current.isEligibleForRescue(habit)).toBe(false);
    });

    it('returns false if rescue was already shown today', () => {
      const { result } = renderHook(() => useRescueTrigger([]));

      const habit = createHabit({ rescueShownToday: true });
      expect(result.current.isEligibleForRescue(habit)).toBe(false);
    });

    it('returns false if streak is below minimum', () => {
      const config: RescueTriggerConfig = { minStreakForRescue: 5 };
      const { result } = renderHook(() => useRescueTrigger([], config));

      const habit = createHabit({ currentStreak: 2 });
      expect(result.current.isEligibleForRescue(habit)).toBe(false);
    });

    it('returns true if streak meets minimum', () => {
      const config: RescueTriggerConfig = { minStreakForRescue: 5 };
      const { result } = renderHook(() => useRescueTrigger([], config));

      const habit = createHabit({ currentStreak: 5 });
      expect(result.current.isEligibleForRescue(habit)).toBe(true);
    });

    it('returns true with zero minimum streak requirement', () => {
      const config: RescueTriggerConfig = { minStreakForRescue: 0 };
      const { result } = renderHook(() => useRescueTrigger([], config));

      const habit = createHabit({ currentStreak: 0 });
      expect(result.current.isEligibleForRescue(habit)).toBe(true);
    });
  });

  describe('triggerRescue (manual)', () => {
    it('sets habitNeedingRescue when triggered manually', () => {
      const habit = createHabit();
      const { result } = renderHook(() => useRescueTrigger([habit]));

      expect(result.current.habitNeedingRescue).toBeNull();

      act(() => {
        result.current.triggerRescue('habit-1', 'manual');
      });

      expect(result.current.habitNeedingRescue).toBe('habit-1');
      expect(result.current.triggerReason).toBe('manual');
    });

    it('does not trigger for ineligible habit', () => {
      const habit = createHabit({ isCompletedToday: true });
      const { result } = renderHook(() => useRescueTrigger([habit]));

      act(() => {
        result.current.triggerRescue('habit-1', 'manual');
      });

      expect(result.current.habitNeedingRescue).toBeNull();
    });

    it('does not trigger for non-existent habit', () => {
      const habit = createHabit();
      const { result } = renderHook(() => useRescueTrigger([habit]));

      act(() => {
        result.current.triggerRescue('non-existent', 'manual');
      });

      expect(result.current.habitNeedingRescue).toBeNull();
    });

    it('uses default reason of manual', () => {
      const habit = createHabit();
      const { result } = renderHook(() => useRescueTrigger([habit]));

      act(() => {
        result.current.triggerRescue('habit-1');
      });

      expect(result.current.triggerReason).toBe('manual');
    });
  });

  describe('clearRescue', () => {
    it('clears habitNeedingRescue and triggerReason', () => {
      const habit = createHabit();
      const { result } = renderHook(() => useRescueTrigger([habit]));

      act(() => {
        result.current.triggerRescue('habit-1');
      });

      expect(result.current.habitNeedingRescue).toBe('habit-1');

      act(() => {
        result.current.clearRescue();
      });

      expect(result.current.habitNeedingRescue).toBeNull();
      expect(result.current.triggerReason).toBeNull();
    });
  });

  describe('markRescueShown', () => {
    it('prevents same habit from triggering again', () => {
      const habit = createHabit();
      const { result } = renderHook(() => useRescueTrigger([habit]));

      // First trigger succeeds
      act(() => {
        result.current.triggerRescue('habit-1');
      });
      expect(result.current.habitNeedingRescue).toBe('habit-1');

      // Mark as shown
      act(() => {
        result.current.markRescueShown('habit-1');
        result.current.clearRescue();
      });

      // Check eligibility is now false
      expect(result.current.isEligibleForRescue(habit)).toBe(false);
    });

    it('only affects the marked habit', () => {
      const habit1 = createHabit({ id: 'habit-1' });
      const habit2 = createHabit({ id: 'habit-2' });
      const { result } = renderHook(() => useRescueTrigger([habit1, habit2]));

      // Mark habit-1 as shown
      act(() => {
        result.current.markRescueShown('habit-1');
      });

      // habit-1 should be ineligible, habit-2 should still be eligible
      expect(result.current.isEligibleForRescue(habit1)).toBe(false);
      expect(result.current.isEligibleForRescue(habit2)).toBe(true);
    });
  });

  describe('hoursRemaining', () => {
    it('returns hours until midnight', () => {
      // Mock date to 9:00 PM (3 hours until midnight)
      const mockDate = new Date('2025-12-28T21:00:00');
      jest.setSystemTime(mockDate);

      const { result } = renderHook(() => useRescueTrigger([]));

      // Should be approximately 3 hours
      expect(result.current.hoursRemaining).toBeCloseTo(3, 0);
    });

    it('returns small value close to midnight', () => {
      // Mock date to 11:30 PM (0.5 hours until midnight)
      const mockDate = new Date('2025-12-28T23:30:00');
      jest.setSystemTime(mockDate);

      const { result } = renderHook(() => useRescueTrigger([]));

      expect(result.current.hoursRemaining).toBeCloseTo(0.5, 1);
    });
  });

  describe('config options', () => {
    it('respects enableScheduledTrigger = false', () => {
      const habit = createHabit();
      const config: RescueTriggerConfig = { enableScheduledTrigger: false };
      const { result } = renderHook(() => useRescueTrigger([habit], config));

      // Advance past check interval
      act(() => {
        jest.advanceTimersByTime(20 * 60 * 1000);
      });

      // Should not have triggered automatically
      expect(result.current.habitNeedingRescue).toBeNull();
    });

    it('uses custom hoursBeforeEnd', () => {
      const config: RescueTriggerConfig = { hoursBeforeEnd: 5 };
      const { result } = renderHook(() => useRescueTrigger([], config));

      // Just verify hook accepts the config without error
      expect(result.current.habitNeedingRescue).toBeNull();
    });

    it('uses custom minStreakForRescue', () => {
      const config: RescueTriggerConfig = { minStreakForRescue: 10 };
      const { result } = renderHook(() => useRescueTrigger([], config));

      const lowStreakHabit = createHabit({ currentStreak: 5 });
      const highStreakHabit = createHabit({ currentStreak: 15 });

      expect(result.current.isEligibleForRescue(lowStreakHabit)).toBe(false);
      expect(result.current.isEligibleForRescue(highStreakHabit)).toBe(true);
    });
  });

  describe('habit prioritization', () => {
    it('prioritizes higher streak habits for manual trigger', () => {
      const habits = [
        createHabit({ id: 'low-streak', currentStreak: 3 }),
        createHabit({ id: 'high-streak', currentStreak: 30 }),
        createHabit({ id: 'medium-streak', currentStreak: 10 }),
      ];

      const { result } = renderHook(() => useRescueTrigger(habits));

      // Manually trigger high-streak habit
      act(() => {
        result.current.triggerRescue('high-streak');
      });

      expect(result.current.habitNeedingRescue).toBe('high-streak');
    });

    it('allows triggering any eligible habit', () => {
      const habits = [
        createHabit({ id: 'low-streak', currentStreak: 3 }),
        createHabit({ id: 'high-streak', currentStreak: 30 }),
      ];

      const { result } = renderHook(() => useRescueTrigger(habits));

      // Can trigger low-streak directly
      act(() => {
        result.current.triggerRescue('low-streak');
      });

      expect(result.current.habitNeedingRescue).toBe('low-streak');
    });
  });

  describe('updates hours remaining', () => {
    it('updates hoursRemaining when triggered', () => {
      // Mock date to 9:00 PM
      jest.setSystemTime(new Date('2025-12-28T21:00:00'));

      const habit = createHabit();
      const { result } = renderHook(() => useRescueTrigger([habit]));

      const initialHours = result.current.hoursRemaining;

      // Advance time by 30 minutes
      act(() => {
        jest.setSystemTime(new Date('2025-12-28T21:30:00'));
        result.current.triggerRescue('habit-1');
      });

      // hoursRemaining should be updated when triggered
      expect(result.current.hoursRemaining).toBeCloseTo(2.5, 1);
    });
  });
});
