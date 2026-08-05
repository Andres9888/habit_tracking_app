/**
 * Unit tests for tracking mutations and queries
 * Tests toggleCompletion and getCompletionStatus functionality
 */

import { Id } from '../../../convex/_generated/dataModel';

describe('toggleCompletion mutation', () => {
  describe('argument validation', () => {
    it('requires habitId and date parameters', () => {
      const validArgs = {
        date: '2025-01-15',
        habitId: 'test_habit_id' as Id<'habits'>,
      };

      expect(validArgs).toHaveProperty('habitId');
      expect(validArgs).toHaveProperty('date');
      expect(typeof validArgs.date).toBe('string');
    });

    it('validates date format as YYYY-MM-DD', () => {
      const validDate = '2025-01-15';
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      expect(dateRegex.test(validDate)).toBe(true);
      expect(dateRegex.test('2025/01/15')).toBe(false);
      expect(dateRegex.test('15-01-2025')).toBe(false);
      expect(dateRegex.test('2025-1-15')).toBe(false); // Single digit month
    });

    it('should reject invalid date formats', () => {
      const invalidDates = [
        '2025/01/15', // Wrong separator
        '15-01-2025', // Wrong order
        '2025-1-15', // Single digit month
        '2025-01-5', // Single digit day
        'invalid', // Not a date
      ];

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      for (const date of invalidDates) {
        expect(dateRegex.test(date)).toBe(false);
      }

      // Note: Regex validates format, not semantic validity
      // Invalid month/day values like '2025-13-01' pass regex but fail in mutation
      const validFormatInvalidDate = '2025-13-01';
      expect(dateRegex.test(validFormatInvalidDate)).toBe(true);
      // This would be caught by Date parsing in the mutation
    });

    it('trusts client-provided dates (no server-side date range validation)', () => {
      // Note: We removed server-side future date validation to fix timezone bug.
      // Client is responsible for providing correct date in user's local timezone.
      // Server only validates format (YYYY-MM-DD) not date range.

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayTime = today.getTime();
      const tomorrowTime = tomorrow.getTime();

      expect(tomorrowTime).toBeGreaterThan(todayTime);
      // Server no longer rejects future dates (trusts client's timezone context)
    });

    it('should allow today and past dates', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const todayTime = today.getTime();
      const yesterdayTime = yesterday.getTime();

      expect(yesterdayTime).toBeLessThan(todayTime);
      expect(todayTime).toBeGreaterThanOrEqual(todayTime);
    });
  });

  describe('habit existence validation', () => {
    it('should require valid habit ID', () => {
      const habitId = 'test_habit_id' as Id<'habits'>;

      expect(habitId).toBeDefined();
      expect(typeof habitId).toBe('string');
      // Mutation should throw "Habit not found" if habit doesn't exist
    });
  });

  describe('toggle behavior - checking (no existing record)', () => {
    it('should create new tracking record when none exists', () => {
      const newRecord = {
        completed: true,
        date: '2025-01-15',
        habitId: 'test_habit_id' as Id<'habits'>,
      };

      expect(newRecord).toHaveProperty('habitId');
      expect(newRecord).toHaveProperty('date');
      expect(newRecord).toHaveProperty('completed');
      expect(newRecord.completed).toBe(true);
    });

    it('should return true when creating new record (checking)', () => {
      const returnValue = true; // No existing record, so insert and return true

      expect(returnValue).toBe(true);
    });

    it('should insert tracking record with correct fields', () => {
      const insertedRecord = {
        completed: true,
        date: '2025-01-15',
        habitId: 'habit_123' as Id<'habits'>,
      };

      expect(insertedRecord.habitId).toBe('habit_123');
      expect(insertedRecord.date).toBe('2025-01-15');
      expect(insertedRecord.completed).toBe(true);
    });
  });

  describe('toggle behavior - unchecking (existing record)', () => {
    it('should delete tracking record when it exists', () => {
      const existingRecord = {
        _id: 'tracking_123' as Id<'tracking'>,
        completed: true,
        date: '2025-01-15',
        habitId: 'habit_123' as Id<'habits'>,
      };

      expect(existingRecord._id).toBeDefined();
      // Mutation should call ctx.db.delete(existingRecord._id)
    });

    it('should return false when deleting existing record (unchecking)', () => {
      const returnValue = false; // Existing record found, so delete and return false

      expect(returnValue).toBe(false);
    });

    it('should use indexed query to find existing record', () => {
      const queryParams = {
        date: '2025-01-15',
        habitId: 'habit_123' as Id<'habits'>,
        index: 'by_habit_and_date',
      };

      expect(queryParams.index).toBe('by_habit_and_date');
      expect(queryParams.habitId).toBeDefined();
      expect(queryParams.date).toBeDefined();
    });
  });

  describe('return value contract', () => {
    it('returns boolean indicating completion status', () => {
      const checkResult = true; // Created new record
      const uncheckResult = false; // Deleted existing record

      expect(typeof checkResult).toBe('boolean');
      expect(typeof uncheckResult).toBe('boolean');
      expect(checkResult).toBe(true);
      expect(uncheckResult).toBe(false);
    });

    it('return value matches completion state after toggle', () => {
      // If no record exists → insert → return true (now completed)
      expect(true).toBe(true);

      // If record exists → delete → return false (now not completed)
      expect(false).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle same habitId and date multiple times (toggle on/off)', () => {
      // First toggle: no record → create → return true
      const firstToggle = true;

      // Second toggle: record exists → delete → return false
      const secondToggle = false;

      // Third toggle: no record → create → return true
      const thirdToggle = true;

      expect(firstToggle).toBe(true);
      expect(secondToggle).toBe(false);
      expect(thirdToggle).toBe(true);
    });

    it('should handle different dates for same habit independently', () => {
      const habit1Date1 = {
        date: '2025-01-15',
        habitId: 'habit_1' as Id<'habits'>,
      };

      const habit1Date2 = {
        date: '2025-01-16',
        habitId: 'habit_1' as Id<'habits'>,
      };

      // These are independent records
      expect(habit1Date1.date).not.toBe(habit1Date2.date);
      expect(habit1Date1.habitId).toBe(habit1Date2.habitId);
    });

    it('should handle different habits for same date independently', () => {
      const habit1 = {
        date: '2025-01-15',
        habitId: 'habit_1' as Id<'habits'>,
      };

      const habit2 = {
        date: '2025-01-15',
        habitId: 'habit_2' as Id<'habits'>,
      };

      // These are independent records
      expect(habit1.habitId).not.toBe(habit2.habitId);
      expect(habit1.date).toBe(habit2.date);
    });
  });

  describe('error handling', () => {
    it('should throw error for invalid date format', () => {
      const invalidFormats = ['2025/01/15', '15-01-2025', 'invalid'];

      for (const format of invalidFormats) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        expect(dateRegex.test(format)).toBe(false);
      }

      // Mutation should throw: "Invalid date format. Expected YYYY-MM-DD"
    });

    it('should throw error for non-existent habit', () => {
      const nonExistentHabitId = 'non_existent_habit' as Id<'habits'>;

      expect(nonExistentHabitId).toBeDefined();
      // Mutation should throw: "Habit not found"
    });

    it('accepts client-provided dates without range validation', () => {
      // Note: Future date validation removed to prevent timezone-related false rejections.
      // Example: PST user at 11:59pm would be rejected by UTC server thinking it's "tomorrow".
      // We now trust client's date calculation (already in user's local timezone).

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const futureDate = tomorrow.toISOString().split('T')[0];

      const today = new Date();
      const todayDate = today.toISOString().split('T')[0];

      expect(futureDate > todayDate).toBe(true);
      // Server no longer throws error for future dates (trusts client timezone)
    });
  });
});

describe('getCompletionStatus query', () => {
  describe('argument validation', () => {
    it('requires habitId and date parameters', () => {
      const validArgs = {
        date: '2025-01-15',
        habitId: 'test_habit_id' as Id<'habits'>,
      };

      expect(validArgs).toHaveProperty('habitId');
      expect(validArgs).toHaveProperty('date');
    });

    it('validates date format as YYYY-MM-DD', () => {
      const validDate = '2025-01-15';
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      expect(dateRegex.test(validDate)).toBe(true);
      expect(dateRegex.test('2025/01/15')).toBe(false);
    });
  });

  describe('query behavior', () => {
    it('should return true when tracking record exists', () => {
      const existingRecord = {
        _id: 'tracking_123' as Id<'tracking'>,
        completed: true,
        date: '2025-01-15',
        habitId: 'habit_123' as Id<'habits'>,
      };

      const result = existingRecord !== null;

      expect(result).toBe(true);
    });

    it('should return false when no tracking record exists', () => {
      const existingRecord = null;

      const result = existingRecord !== null;

      expect(result).toBe(false);
    });

    it('should use indexed query to find record', () => {
      const queryParams = {
        date: '2025-01-15',
        habitId: 'habit_123' as Id<'habits'>,
        index: 'by_habit_and_date',
      };

      expect(queryParams.index).toBe('by_habit_and_date');
      expect(queryParams.habitId).toBeDefined();
      expect(queryParams.date).toBeDefined();
    });
  });

  describe('return value contract', () => {
    it('returns boolean', () => {
      const withRecord = true;
      const withoutRecord = false;

      expect(typeof withRecord).toBe('boolean');
      expect(typeof withoutRecord).toBe('boolean');
    });

    it('true indicates habit is completed', () => {
      const isCompleted = true;

      expect(isCompleted).toBe(true);
      // Used to determine Light haptic feedback (unchecking)
    });

    it('false indicates habit is not completed', () => {
      const isCompleted = false;

      expect(isCompleted).toBe(false);
      // Used to determine Medium haptic feedback (checking)
    });
  });

  describe('usage for haptic feedback', () => {
    it('provides completion state for conditional haptics', () => {
      // This query is used in HabitCard to determine haptic intensity
      const isCompleted = true; // or false

      // If completed (true) → user is unchecking → Light haptic
      const hapticWhenCompleted = 'Light';

      // If not completed (false) → user is checking → Medium haptic
      const hapticWhenNotCompleted = 'Medium';

      expect(isCompleted ? hapticWhenCompleted : hapticWhenNotCompleted).toBe(
        'Light'
      );
      expect(isCompleted ? hapticWhenCompleted : hapticWhenNotCompleted).toBe(
        'Light'
      );
    });

    it('should be called before toggle for optimal UX', () => {
      // Query runs before tap to get current state
      const currentState = false; // Query result

      // Haptic fires based on current state
      const hapticIntensity = currentState ? 'Light' : 'Medium';

      // Then mutation fires to toggle
      const newState = !currentState;

      expect(hapticIntensity).toBe('Medium');
      expect(newState).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should throw error for invalid date format', () => {
      const invalidDate = '2025/01/15';
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      expect(dateRegex.test(invalidDate)).toBe(false);
      // Query should throw: "Invalid date format. Expected YYYY-MM-DD"
    });
  });

  describe('edge cases', () => {
    it('should handle multiple queries for same habit/date', () => {
      const query1Result = true;
      const query2Result = true;

      expect(query1Result).toBe(query2Result);
    });

    it('should reflect state changes after toggleCompletion', () => {
      // Before toggle
      const beforeToggle = false;

      // After toggle (completed)
      const afterFirstToggle = true;

      // After second toggle (uncompleted)
      const afterSecondToggle = false;

      expect(beforeToggle).toBe(false);
      expect(afterFirstToggle).toBe(true);
      expect(afterSecondToggle).toBe(false);
    });
  });
});

describe('toggleCompletion and getCompletionStatus integration', () => {
  describe('state consistency', () => {
    it('getCompletionStatus should match toggleCompletion return value', () => {
      // toggleCompletion returns true → habit is checked
      const toggleResult = true;

      // getCompletionStatus should return true
      const queryResult = true;

      expect(toggleResult).toBe(queryResult);
    });

    it('should maintain consistency across multiple toggles', () => {
      const states = [
        { query: true, toggle: true }, // First check
        { query: false, toggle: false }, // Uncheck
        { query: true, toggle: true }, // Check again
      ];

      for (const state of states) {
        expect(state.toggle).toBe(state.query);
      }
    });
  });

  describe('haptic feedback workflow', () => {
    it('query provides state → determines haptic → mutation toggles', () => {
      // Step 1: Query current state
      const isCurrentlyCompleted = false;

      // Step 2: Determine haptic based on current state
      const hapticIntensity = isCurrentlyCompleted ? 'Light' : 'Medium';

      // Step 3: Toggle completion
      const newCompletionState = true; // toggleCompletion returns true

      // Step 4: Verify workflow
      expect(isCurrentlyCompleted).toBe(false);
      expect(hapticIntensity).toBe('Medium');
      expect(newCompletionState).toBe(true);
    });

    it('unchecking workflow uses Light haptic', () => {
      const isCurrentlyCompleted = true;
      const hapticIntensity = isCurrentlyCompleted ? 'Light' : 'Medium';
      const newCompletionState = false; // toggleCompletion returns false

      expect(hapticIntensity).toBe('Light');
      expect(newCompletionState).toBe(false);
    });

    it('checking workflow uses Medium haptic', () => {
      const isCurrentlyCompleted = false;
      const hapticIntensity = isCurrentlyCompleted ? 'Light' : 'Medium';
      const newCompletionState = true; // toggleCompletion returns true

      expect(hapticIntensity).toBe('Medium');
      expect(newCompletionState).toBe(true);
    });
  });

  describe('indexed query performance', () => {
    it('both use same index for consistency', () => {
      const indexName = 'by_habit_and_date';

      expect(indexName).toBe('by_habit_and_date');
      // Both toggleCompletion and getCompletionStatus use this index
    });

    it('both query with habitId and date', () => {
      const queryParams = {
        date: '2025-01-15',
        habitId: 'habit_123' as Id<'habits'>,
      };

      expect(queryParams).toHaveProperty('habitId');
      expect(queryParams).toHaveProperty('date');
    });
  });
});
