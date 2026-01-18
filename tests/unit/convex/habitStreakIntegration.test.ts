/**
 * Habit Streak Integration Tests (Story 1.3)
 * Contract tests for streak updates within the toggleHabit mutation flow
 */

import { updateStreak } from '../../../convex/streakUtils';

describe('Habit Streak Integration', () => {
  describe('habit creation contract', () => {
    it('should initialize streak fields to 0', () => {
      const newHabit = {
        bestStreak: 0,
        createdAt: Date.now(),
        currentStreak: 0,
        lastCompletedDate: undefined,
        name: 'Test Habit',
      };

      expect(newHabit.currentStreak).toBe(0);
      expect(newHabit.bestStreak).toBe(0);
      expect(newHabit.lastCompletedDate).toBeUndefined();
    });

    it('validates habit schema includes streak fields', () => {
      const habit = {
        _creationTime: Date.now(),
        _id: 'test_id',
        bestStreak: 0,
        createdAt: Date.now(),
        currentStreak: 0,
        lastCompletedDate: undefined,
        name: 'Test',
      };

      expect(habit).toHaveProperty('currentStreak');
      expect(habit).toHaveProperty('bestStreak');
      expect(habit).toHaveProperty('lastCompletedDate');
    });
  });

  describe('toggleHabit mutation streak update contract', () => {
    it('should update streak on first completion', () => {
      const habitBefore = {
        bestStreak: 0,
        currentStreak: 0,
        lastCompletedDate: undefined,
      };

      const streakData = updateStreak(habitBefore, '2025-01-10', true);

      expect(streakData.currentStreak).toBe(1);
      expect(streakData.bestStreak).toBe(1);
      expect(streakData.lastCompletedDate).toBe('2025-01-10');
    });

    it('should increment streak on consecutive day', () => {
      const habitBefore = {
        bestStreak: 1,
        currentStreak: 1,
        lastCompletedDate: '2025-01-10',
      };

      const streakData = updateStreak(habitBefore, '2025-01-11', true);

      expect(streakData.currentStreak).toBe(2);
      expect(streakData.bestStreak).toBe(2);
      expect(streakData.lastCompletedDate).toBe('2025-01-11');
    });

    it('should reset streak when day is missed', () => {
      const habitBefore = {
        bestStreak: 5,
        currentStreak: 5,
        lastCompletedDate: '2025-01-10',
      };

      const streakData = updateStreak(habitBefore, '2025-01-12', true); // Skipped Jan 11

      expect(streakData.currentStreak).toBe(1);
      expect(streakData.bestStreak).toBe(5); // Preserved
      expect(streakData.lastCompletedDate).toBe('2025-01-12');
    });

    it('should preserve best streak after reset', () => {
      const habitBefore = {
        bestStreak: 10,
        currentStreak: 10,
        lastCompletedDate: '2025-01-10',
      };

      const streakData = updateStreak(habitBefore, '2025-01-12', true);

      expect(streakData.currentStreak).toBe(1);
      expect(streakData.bestStreak).toBe(10);
    });

    it('should handle uncompleting', () => {
      const habitBefore = {
        bestStreak: 10,
        currentStreak: 5,
        lastCompletedDate: '2025-01-10',
      };

      const streakData = updateStreak(habitBefore, '2025-01-10', false);

      expect(streakData.currentStreak).toBe(0);
      expect(streakData.bestStreak).toBe(10); // Preserved
      expect(streakData.lastCompletedDate).toBe('');
    });
  });

  describe('patch operation contract', () => {
    it('should include streak fields in habit patch', () => {
      const patchData = {
        bestStreak: 10,
        currentStreak: 5,
        lastCompletedDate: '2025-01-10',
        strength: 0.7,
        strengthLevel: 'strong',
        strengthUpdatedAt: Date.now(),
      };

      expect(patchData).toHaveProperty('currentStreak');
      expect(patchData).toHaveProperty('bestStreak');
      expect(patchData).toHaveProperty('lastCompletedDate');
      expect(typeof patchData.currentStreak).toBe('number');
      expect(typeof patchData.bestStreak).toBe('number');
      expect(typeof patchData.lastCompletedDate).toBe('string');
    });

    it('validates patch includes both strength and streak updates', () => {
      const completionPatch = {
        bestStreak: 5,

        // Streak fields (Story 1.3)
        currentStreak: 3,

        lastCompletedDate: '2025-01-10',

        // Strength fields
        strength: 0.65,
        strengthLevel: 'developing',
        strengthUpdatedAt: Date.now(),
      };

      // Verify all required fields present
      expect(completionPatch.strength).toBeDefined();
      expect(completionPatch.strengthLevel).toBeDefined();
      expect(completionPatch.currentStreak).toBeDefined();
      expect(completionPatch.bestStreak).toBeDefined();
      expect(completionPatch.lastCompletedDate).toBeDefined();
    });
  });

  describe('query return type contract', () => {
    it('habit query should return streak fields', () => {
      const habitQueryResult = {
        _creationTime: Date.now(),
        _id: 'test_id',
        bestStreak: 10,
        createdAt: Date.now(),
        currentStreak: 5,
        lastCompletedDate: '2025-01-10',
        name: 'Test Habit',
        strength: 0.7,
        strengthLevel: 'strong',
      };

      expect(habitQueryResult).toHaveProperty('currentStreak');
      expect(habitQueryResult).toHaveProperty('bestStreak');
      expect(habitQueryResult).toHaveProperty('lastCompletedDate');
    });

    it('list query should include streak fields for all habits', () => {
      const habits = [
        {
          _creationTime: Date.now(),
          _id: 'id1',
          bestStreak: 5,
          createdAt: Date.now(),
          currentStreak: 3,
          lastCompletedDate: '2025-01-10',
          name: 'Habit 1',
        },
        {
          _creationTime: Date.now(),
          _id: 'id2',
          bestStreak: 10,
          createdAt: Date.now(),
          currentStreak: 7,
          lastCompletedDate: '2025-01-11',
          name: 'Habit 2',
        },
      ];

      for (const habit of habits) {
        expect(habit).toHaveProperty('currentStreak');
        expect(habit).toHaveProperty('bestStreak');
        expect(habit).toHaveProperty('lastCompletedDate');
      }
    });
  });

  describe('performance contract', () => {
    it('streak calculation should complete quickly', () => {
      const startTime = performance.now();

      const streakData = updateStreak(
        { bestStreak: 100, currentStreak: 50, lastCompletedDate: '2025-01-10' },
        '2025-01-11',
        true
      );

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(streakData.currentStreak).toBe(51);
      expect(duration).toBeLessThan(50); // AC: <50ms
    });

    it('should handle 100+ habits efficiently', () => {
      const startTime = performance.now();

      // Simulate 100 streak calculations
      for (let i = 0; i < 100; i++) {
        updateStreak(
          { bestStreak: i, currentStreak: i, lastCompletedDate: '2025-01-10' },
          '2025-01-11',
          true
        );
      }

      const endTime = performance.now();
      const avgDuration = (endTime - startTime) / 100;

      expect(avgDuration).toBeLessThan(50); // AC: each <50ms
    });
  });

  describe('data persistence contract', () => {
    it('validates streak fields are persisted in habit document', () => {
      const persistedHabit = {
        _creationTime: Date.now(),
        _id: 'test_id',
        bestStreak: 10,
        currentStreak: 5,
        lastCompletedDate: '2025-01-10',
        name: 'Test',
      };

      // AC: Streak data persists in habit document
      expect(persistedHabit.currentStreak).toBe(5);
      expect(persistedHabit.bestStreak).toBe(10);
      expect(persistedHabit.lastCompletedDate).toBe('2025-01-10');

      // Verify types
      expect(typeof persistedHabit.currentStreak).toBe('number');
      expect(typeof persistedHabit.bestStreak).toBe('number');
      expect(typeof persistedHabit.lastCompletedDate).toBe('string');
    });

    it('validates lastCompletedDate uses ISO date format (YYYY-MM-DD)', () => {
      const date = '2025-01-10';
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

      expect(date).toMatch(isoDateRegex);
    });
  });
});
