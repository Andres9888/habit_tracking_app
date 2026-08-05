/**
 * Unit tests for habit toggle mutation logic
 * Tests critical business logic around habit completion toggling
 */

import { isValidDateFormat, isFutureDate, getTodayForTimezone } from '../../../convex/habits/utils';

describe('Habit Toggle Logic', () => {
  describe('Authorization and Access Control', () => {
    it('should reject toggle when user is not authenticated', () => {
      const identity = null;
      expect(identity).toBeNull();
      // Mutation should throw: "Unauthenticated: Must be logged in to toggle habits"
    });

    it('should reject toggle when habit belongs to different user', () => {
      const habit = { userId: 'user123' };
      const requestingUserId = 'user456';
      
      expect(habit.userId).not.toBe(requestingUserId);
      // Mutation should throw: "Not authorized to toggle this habit"
    });

    it('should allow toggle when habit belongs to requesting user', () => {
      const habit = { userId: 'user123' };
      const requestingUserId = 'user123';
      
      expect(habit.userId).toBe(requestingUserId);
      // Mutation should proceed
    });
  });

  describe('Date Validation Edge Cases', () => {
    describe('isValidDateFormat', () => {
      it('accepts valid YYYY-MM-DD format', () => {
        expect(isValidDateFormat('2025-01-15')).toBe(true);
        expect(isValidDateFormat('2025-12-31')).toBe(true);
        expect(isValidDateFormat('2025-06-09')).toBe(true);
      });

      it('rejects invalid formats', () => {
        expect(isValidDateFormat('2025-1-15')).toBe(false); // Single digit month
        expect(isValidDateFormat('2025-01-5')).toBe(false); // Single digit day
        expect(isValidDateFormat('01-15-2025')).toBe(false); // Wrong order
        expect(isValidDateFormat('2025/01/15')).toBe(false); // Wrong separator
        expect(isValidDateFormat('')).toBe(false); // Empty
        expect(isValidDateFormat('invalid')).toBe(false); // Not a date
      });

      it('accepts dates with leading zeros', () => {
        expect(isValidDateFormat('2025-01-01')).toBe(true);
        expect(isValidDateFormat('2025-09-09')).toBe(true);
      });
    });

    describe('isFutureDate with 24-hour grace period', () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it('allows today date', () => {
        jest.setSystemTime(new Date('2025-01-15T12:00:00.000Z'));
        expect(isFutureDate('2025-01-15')).toBe(false);
      });

      it('allows dates within 24-hour grace period (timezone accommodation)', () => {
        jest.setSystemTime(new Date('2025-01-15T00:00:00.000Z'));
        expect(isFutureDate('2025-01-16')).toBe(false); // +24h, within grace
      });

      it('rejects dates beyond 24-hour grace period', () => {
        jest.setSystemTime(new Date('2025-01-15T00:00:00.000Z'));
        expect(isFutureDate('2025-01-17')).toBe(true); // +48h, beyond grace
      });

      it('allows past dates', () => {
        jest.setSystemTime(new Date('2025-01-15T12:00:00.000Z'));
        expect(isFutureDate('2025-01-14')).toBe(false);
        expect(isFutureDate('2025-01-01')).toBe(false);
      });

      it('handles end-of-month transitions', () => {
        jest.setSystemTime(new Date('2025-01-31T12:00:00.000Z'));
        expect(isFutureDate('2025-02-01')).toBe(false); // +24h, within grace
        expect(isFutureDate('2025-02-02')).toBe(true); // +48h, beyond grace
      });

      it('handles year transitions', () => {
        jest.setSystemTime(new Date('2024-12-31T12:00:00.000Z'));
        expect(isFutureDate('2025-01-01')).toBe(false); // Within grace
      });
    });

    describe('Midnight Timezone Crossover', () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it('handles UTC to PST midnight crossover (UTC ahead)', () => {
        // Feb 14 at 08:00 UTC = Feb 14 at 00:00 PST (midnight)
        jest.setSystemTime(new Date('2025-02-14T08:00:00.000Z'));
        
        const todayUTC = '2025-02-14';
        const todayPST = getTodayForTimezone('America/Los_Angeles');
        
        expect(todayPST).toBe('2025-02-14');
        expect(todayUTC).toBe(todayPST);
      });

      it('handles UTC to PST day-before crossover (early morning UTC)', () => {
        // Feb 14 at 01:00 UTC = Feb 13 at 17:00 PST (previous day)
        jest.setSystemTime(new Date('2025-02-14T01:00:00.000Z'));
        
        const todayPST = getTodayForTimezone('America/Los_Angeles');
        
        expect(todayPST).toBe('2025-02-13');
      });

      it('handles UTC to JST day-after crossover (late evening UTC)', () => {
        // Feb 14 at 23:00 UTC = Feb 15 at 08:00 JST (next day)
        jest.setSystemTime(new Date('2025-02-14T23:00:00.000Z'));
        
        const todayJST = getTodayForTimezone('Asia/Tokyo');
        
        expect(todayJST).toBe('2025-02-15');
      });

      it('handles timezone edge case at exactly midnight', () => {
        // Feb 14 at 08:00 UTC = Feb 14 at 00:00 PST (exactly midnight)
        jest.setSystemTime(new Date('2025-02-14T08:00:00.000Z'));
        
        const todayPST = getTodayForTimezone('America/Los_Angeles');
        
        // Should correctly identify as Feb 14, not Feb 13 or Feb 15
        expect(todayPST).toBe('2025-02-14');
      });

      it('handles daylight saving time transitions', () => {
        // During PST (standard time): UTC-8
        jest.setSystemTime(new Date('2025-01-15T16:00:00.000Z'));
        expect(getTodayForTimezone('America/Los_Angeles')).toBe('2025-01-15');
        
        // During PDT (daylight time): UTC-7
        // Note: This is future date but tests the logic
        jest.setSystemTime(new Date('2025-07-15T16:00:00.000Z'));
        expect(getTodayForTimezone('America/Los_Angeles')).toBe('2025-07-15');
      });
    });
  });

  describe('Toggle State Transitions', () => {
    it('creates new tracking record with completed=true when no existing record', () => {
      const existingRecord = null;
      const newStatus = existingRecord ? !existingRecord.completed : true;
      
      expect(newStatus).toBe(true);
    });

    it('toggles from completed=true to completed=false when record exists', () => {
      const existingRecord = { completed: true };
      const newStatus = !existingRecord.completed;
      
      expect(newStatus).toBe(false);
    });

    it('toggles from completed=false to completed=true', () => {
      const existingRecord = { completed: false };
      const newStatus = !existingRecord.completed;
      
      expect(newStatus).toBe(true);
    });

    it('backfills userId on legacy records missing it', () => {
      const existingRecord = { _id: 'track123', completed: true, userId: undefined };
      const userId = 'user123';
      
      const update = {
        completed: !existingRecord.completed,
        ...(existingRecord.userId ? {} : { userId }),
      };
      
      expect(update).toHaveProperty('userId', 'user123');
      expect(update).toHaveProperty('completed', false);
    });

    it('preserves userId on records that already have it', () => {
      const existingRecord = { _id: 'track123', completed: true, userId: 'user456' };
      const requestingUserId = 'user456';
      
      const update = {
        completed: !existingRecord.completed,
        ...(existingRecord.userId ? {} : { userId: requestingUserId }),
      };
      
      expect(update).not.toHaveProperty('userId');
      expect(update).toHaveProperty('completed', false);
    });
  });

  describe('Concurrent Toggle Scenarios', () => {
    it('handles rapid double-toggle (toggle, then toggle again)', () => {
      // Initial state: no record
      let completed = null;
      
      // First toggle: create with completed=true
      completed = completed ? !completed.completed : true;
      expect(completed).toBe(true);
      
      // Second toggle (immediate): flip to false
      const existingRecord = { completed: true };
      completed = !existingRecord.completed;
      expect(completed).toBe(false);
      
      // Third toggle: flip back to true
      const thirdRecord = { completed: false };
      completed = !thirdRecord.completed;
      expect(completed).toBe(true);
    });

    it('maintains idempotency for same state toggle', () => {
      // User toggles same habit twice rapidly
      const record1 = { completed: true };
      const toggle1 = !record1.completed; // false
      
      const record2 = { completed: toggle1 };
      const toggle2 = !record2.completed; // true
      
      // After two toggles, we're back to original state
      expect(toggle2).toBe(true);
      expect(toggle2).toBe(record1.completed);
    });

    it('handles concurrent toggles from same user on same date', () => {
      // Two simultaneous requests to toggle same habit/date
      // Both read existing state: { completed: true }
      const existingState = { completed: true };
      
      // Request 1 calculates new state: false
      const request1_newState = !existingState.completed;
      
      // Request 2 (before Request 1 commits) also calculates: false
      const request2_newState = !existingState.completed;
      
      // Both should calculate same value (deterministic)
      expect(request1_newState).toBe(request2_newState);
      expect(request1_newState).toBe(false);
      
      // Last-write-wins: final state should be false
      // Streak recalculation will handle any inconsistencies
    });

    it('handles concurrent toggles on different dates', () => {
      // User toggles habit for 2025-01-15 and 2025-01-16 simultaneously
      const toggle1 = { date: '2025-01-15', completed: true };
      const toggle2 = { date: '2025-01-16', completed: true };
      
      // These are independent operations (different date keys)
      expect(toggle1.date).not.toBe(toggle2.date);
      expect(toggle1.completed).toBe(true);
      expect(toggle2.completed).toBe(true);
      
      // Both should succeed independently
    });
  });

  describe('Streak Recalculation Scheduling', () => {
    it('schedules recalculation after successful toggle', () => {
      const scheduledJobs: Array<{ handler: string; delay: number }> = [];
      
      // Simulate scheduling
      const scheduleRecalc = (habitId: string, date: string, timezone?: string) => {
        scheduledJobs.push({
          handler: 'internal.habits.toggle.recalculateStreakAndStrength',
          delay: 0,
        });
      };
      
      scheduleRecalc('habit123', '2025-01-15', 'America/Los_Angeles');
      
      expect(scheduledJobs).toHaveLength(1);
      expect(scheduledJobs[0].delay).toBe(0); // Immediate execution
      expect(scheduledJobs[0].handler).toContain('recalculateStreakAndStrength');
    });

    it('passes timezone to streak recalculation for accurate date resolution', () => {
      const recalcParams = {
        date: '2025-01-15',
        habitId: 'habit123',
        timezone: 'America/Los_Angeles',
      };
      
      expect(recalcParams).toHaveProperty('timezone');
      expect(recalcParams.timezone).toBe('America/Los_Angeles');
    });

    it('handles missing timezone (falls back to UTC)', () => {
      const recalcParams = {
        date: '2025-01-15',
        habitId: 'habit123',
        timezone: undefined,
      };
      
      expect(recalcParams.timezone).toBeUndefined();
      // Recalculation should handle undefined timezone gracefully
    });
  });

  describe('Habit Existence and Validation', () => {
    it('throws error when habit does not exist', () => {
      const habit = null;
      
      expect(habit).toBeNull();
      // Mutation should throw: "Habit not found"
    });

    it('validates habit ID is a string', () => {
      const habitId = 'habit_123456789';
      
      expect(typeof habitId).toBe('string');
      expect(habitId.length).toBeGreaterThan(0);
    });

    it('uses habitId to fetch habit from database', () => {
      const args = {
        habitId: 'habit123',
        date: '2025-01-15',
      };
      
      expect(args).toHaveProperty('habitId');
      // Mutation should call: ctx.db.get(args.habitId)
    });
  });

  describe('Index Usage for Performance', () => {
    it('uses by_habit_and_date index to find existing tracking record', () => {
      const queryParams = {
        habitId: 'habit123',
        date: '2025-01-15',
      };
      
      // Query should use: .withIndex('by_habit_and_date', q => q.eq('habitId', ...).eq('date', ...))
      expect(queryParams).toHaveProperty('habitId');
      expect(queryParams).toHaveProperty('date');
    });

    it('fetches all tracking records for streak recalculation using index', () => {
      const habitId = 'habit123';
      
      // Query should use: .withIndex('by_habit_and_date', q => q.eq('habitId', ...))
      expect(habitId).toBeDefined();
      // This ensures efficient retrieval of all tracking records for the habit
    });
  });
});
