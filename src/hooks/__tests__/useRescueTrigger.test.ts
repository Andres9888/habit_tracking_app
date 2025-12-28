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
  isInQuietHoursWindow,
  useRescueTrigger,
  type QuietHoursConfig,
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

  describe('quiet hours / Do Not Disturb', () => {
    it('returns isInQuietHours = false when quiet hours disabled', () => {
      jest.setSystemTime(new Date('2025-12-28T23:00:00')); // 11 PM

      const config: RescueTriggerConfig = {
        quietHours: { enabled: false, startTime: '22:00', endTime: '07:00' },
      };
      const { result } = renderHook(() => useRescueTrigger([], config));

      expect(result.current.isInQuietHours).toBe(false);
    });

    it('returns isInQuietHours = true during overnight quiet hours', () => {
      // 11 PM is within 22:00 - 07:00 range
      jest.setSystemTime(new Date('2025-12-28T23:00:00'));

      const config: RescueTriggerConfig = {
        quietHours: { enabled: true, startTime: '22:00', endTime: '07:00' },
      };
      const { result } = renderHook(() => useRescueTrigger([], config));

      expect(result.current.isInQuietHours).toBe(true);
    });

    it('returns isInQuietHours = true early morning during overnight quiet hours', () => {
      // 5 AM is within 22:00 - 07:00 range
      jest.setSystemTime(new Date('2025-12-28T05:00:00'));

      const config: RescueTriggerConfig = {
        quietHours: { enabled: true, startTime: '22:00', endTime: '07:00' },
      };
      const { result } = renderHook(() => useRescueTrigger([], config));

      expect(result.current.isInQuietHours).toBe(true);
    });

    it('returns isInQuietHours = false outside quiet hours', () => {
      // 3 PM is outside 22:00 - 07:00 range
      jest.setSystemTime(new Date('2025-12-28T15:00:00'));

      const config: RescueTriggerConfig = {
        quietHours: { enabled: true, startTime: '22:00', endTime: '07:00' },
      };
      const { result } = renderHook(() => useRescueTrigger([], config));

      expect(result.current.isInQuietHours).toBe(false);
    });

    it('returns isInQuietHours = true during same-day quiet hours', () => {
      // 2 PM is within 13:00 - 15:00 range
      jest.setSystemTime(new Date('2025-12-28T14:00:00'));

      const config: RescueTriggerConfig = {
        quietHours: { enabled: true, startTime: '13:00', endTime: '15:00' },
      };
      const { result } = renderHook(() => useRescueTrigger([], config));

      expect(result.current.isInQuietHours).toBe(true);
    });

    it('returns isInQuietHours = false just after quiet hours end', () => {
      // 7:01 AM is just after 22:00 - 07:00 range
      jest.setSystemTime(new Date('2025-12-28T07:01:00'));

      const config: RescueTriggerConfig = {
        quietHours: { enabled: true, startTime: '22:00', endTime: '07:00' },
      };
      const { result } = renderHook(() => useRescueTrigger([], config));

      expect(result.current.isInQuietHours).toBe(false);
    });

    it('returns isInQuietHours = true exactly at quiet hours start', () => {
      // 10 PM is exactly at 22:00 start
      jest.setSystemTime(new Date('2025-12-28T22:00:00'));

      const config: RescueTriggerConfig = {
        quietHours: { enabled: true, startTime: '22:00', endTime: '07:00' },
      };
      const { result } = renderHook(() => useRescueTrigger([], config));

      expect(result.current.isInQuietHours).toBe(true);
    });

    it('blocks scheduled trigger during quiet hours', () => {
      // 11 PM - within trigger window but also quiet hours
      jest.setSystemTime(new Date('2025-12-28T23:00:00'));

      const habit = createHabit({
        scheduledTime: '07:00', // Already past scheduled time
      });
      const config: RescueTriggerConfig = {
        enableScheduledTrigger: true,
        hoursBeforeEnd: 3,
        quietHours: { enabled: true, startTime: '22:00', endTime: '07:00' },
      };
      const { result } = renderHook(() => useRescueTrigger([habit], config));

      // Should NOT trigger even though conditions are met
      expect(result.current.habitNeedingRescue).toBeNull();
      expect(result.current.isInQuietHours).toBe(true);
    });

    it('allows scheduled trigger outside quiet hours', () => {
      // 9 PM - within trigger window, outside quiet hours
      jest.setSystemTime(new Date('2025-12-28T21:00:00'));

      const habit = createHabit({
        scheduledTime: '07:00', // Already past scheduled time
      });
      const config: RescueTriggerConfig = {
        enableScheduledTrigger: true,
        hoursBeforeEnd: 5,
        quietHours: { enabled: true, startTime: '22:00', endTime: '07:00' },
      };
      const { result } = renderHook(() => useRescueTrigger([habit], config));

      // Should trigger since we're outside quiet hours
      expect(result.current.habitNeedingRescue).toBe('habit-1');
      expect(result.current.isInQuietHours).toBe(false);
    });
  });
});

describe('isInQuietHoursWindow', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const createConfig = (
    overrides: Partial<QuietHoursConfig> = {}
  ): QuietHoursConfig => ({
    enabled: true,
    endTime: '07:00',
    startTime: '22:00',
    ...overrides,
  });

  it('returns false when disabled', () => {
    jest.setSystemTime(new Date('2025-12-28T23:00:00'));
    expect(isInQuietHoursWindow(createConfig({ enabled: false }))).toBe(false);
  });

  it('handles overnight range: late night', () => {
    jest.setSystemTime(new Date('2025-12-28T23:30:00')); // 11:30 PM
    expect(isInQuietHoursWindow(createConfig())).toBe(true);
  });

  it('handles overnight range: midnight', () => {
    jest.setSystemTime(new Date('2025-12-29T00:00:00')); // midnight
    expect(isInQuietHoursWindow(createConfig())).toBe(true);
  });

  it('handles overnight range: early morning', () => {
    jest.setSystemTime(new Date('2025-12-29T06:00:00')); // 6 AM
    expect(isInQuietHoursWindow(createConfig())).toBe(true);
  });

  it('handles overnight range: just before end', () => {
    jest.setSystemTime(new Date('2025-12-29T06:59:00')); // 6:59 AM
    expect(isInQuietHoursWindow(createConfig())).toBe(true);
  });

  it('handles overnight range: exactly at end', () => {
    jest.setSystemTime(new Date('2025-12-29T07:00:00')); // 7:00 AM
    expect(isInQuietHoursWindow(createConfig())).toBe(false);
  });

  it('handles overnight range: daytime', () => {
    jest.setSystemTime(new Date('2025-12-28T15:00:00')); // 3 PM
    expect(isInQuietHoursWindow(createConfig())).toBe(false);
  });

  it('handles overnight range: just before start', () => {
    jest.setSystemTime(new Date('2025-12-28T21:59:00')); // 9:59 PM
    expect(isInQuietHoursWindow(createConfig())).toBe(false);
  });

  it('handles same-day range: inside', () => {
    jest.setSystemTime(new Date('2025-12-28T14:00:00')); // 2 PM
    expect(
      isInQuietHoursWindow(
        createConfig({ startTime: '13:00', endTime: '15:00' })
      )
    ).toBe(true);
  });

  it('handles same-day range: outside before', () => {
    jest.setSystemTime(new Date('2025-12-28T12:00:00')); // 12 PM
    expect(
      isInQuietHoursWindow(
        createConfig({ startTime: '13:00', endTime: '15:00' })
      )
    ).toBe(false);
  });

  it('handles same-day range: outside after', () => {
    jest.setSystemTime(new Date('2025-12-28T16:00:00')); // 4 PM
    expect(
      isInQuietHoursWindow(
        createConfig({ startTime: '13:00', endTime: '15:00' })
      )
    ).toBe(false);
  });

  it('handles edge case: exactly at same-day start', () => {
    jest.setSystemTime(new Date('2025-12-28T13:00:00'));
    expect(
      isInQuietHoursWindow(
        createConfig({ startTime: '13:00', endTime: '15:00' })
      )
    ).toBe(true);
  });

  it('handles edge case: exactly at same-day end', () => {
    jest.setSystemTime(new Date('2025-12-28T15:00:00'));
    expect(
      isInQuietHoursWindow(
        createConfig({ startTime: '13:00', endTime: '15:00' })
      )
    ).toBe(false);
  });
});
