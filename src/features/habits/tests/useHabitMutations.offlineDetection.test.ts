/**
 * useHabitMutations - Offline Detection Integration Tests (Task T011)
 *
 * These tests verify the integration of offline detection in habit mutations.
 * Ensures that:
 * - useHabitMutations returns isOnline status
 * - useHabitsListState passes isOnline to useOptimisticToggleMutation
 * - useHabitsModalsState uses optimistic toggle with offline support
 *
 * @see docs/offline-habit-sync.md T011
 */

import * as fs from 'fs';
import * as path from 'path';

describe('useHabitMutations - Offline Detection (Code Verification)', () => {
  const useHabitMutationsPath = path.resolve(
    __dirname,
    '../hooks/useHabitMutations.ts'
  );

  let useHabitMutationsSource: string;

  beforeAll(() => {
    useHabitMutationsSource = fs.readFileSync(useHabitMutationsPath, 'utf-8');
  });

  describe('Import Integration', () => {
    it('should import useIsOnline from NetworkStatusContext', () => {
      expect(useHabitMutationsSource).toContain(
        "import { useIsOnline } from '../../../contexts/NetworkStatusContext'"
      );
    });
  });

  describe('Return Type', () => {
    it('should define UseHabitMutationsResult interface with isOnline', () => {
      expect(useHabitMutationsSource).toContain(
        'export interface UseHabitMutationsResult'
      );
      expect(useHabitMutationsSource).toContain('isOnline: boolean');
    });
  });

  describe('Hook Implementation', () => {
    it('should call useIsOnline hook', () => {
      expect(useHabitMutationsSource).toContain(
        'const isOnline = useIsOnline()'
      );
    });

    it('should return isOnline in result object', () => {
      expect(useHabitMutationsSource).toMatch(
        /return\s*\{[\s\S]*isOnline[\s\S]*\}/
      );
    });
  });

  describe('Documentation', () => {
    it('should have JSDoc referencing T011', () => {
      expect(useHabitMutationsSource).toContain(
        '@see docs/offline-habit-sync.md T011'
      );
    });

    it('should have example showing offline integration', () => {
      expect(useHabitMutationsSource).toContain('{ isOnline }');
      expect(useHabitMutationsSource).toContain('useOptimisticToggleMutation');
    });
  });
});

describe('useHabitsListState - Offline Detection (Code Verification)', () => {
  const useHabitsListStatePath = path.resolve(
    __dirname,
    '../hooks/useHabitsListState.ts'
  );

  let useHabitsListStateSource: string;

  beforeAll(() => {
    useHabitsListStateSource = fs.readFileSync(useHabitsListStatePath, 'utf-8');
  });

  describe('Import Integration', () => {
    it('should import useIsOnline from NetworkStatusContext', () => {
      expect(useHabitsListStateSource).toContain(
        "import { useIsOnline } from '../../../contexts/NetworkStatusContext'"
      );
    });

    it('should import useOptimisticToggleMutation', () => {
      expect(useHabitsListStateSource).toContain(
        "import { useOptimisticToggleMutation } from '../../../lib/optimistic'"
      );
    });
  });

  describe('Hook Implementation', () => {
    it('should call useIsOnline hook', () => {
      expect(useHabitsListStateSource).toContain(
        'const isOnline = useIsOnline()'
      );
    });

    it('should pass isOnline option to useOptimisticToggleMutation', () => {
      expect(useHabitsListStateSource).toContain('{ isOnline }');
      // Verify the options object is passed as third argument
      expect(useHabitsListStateSource).toMatch(
        /useOptimisticToggleMutation\(\s*\n?\s*toggleHabitMutation,\s*\n?\s*isCompleted,\s*\n?\s*\{\s*isOnline\s*\}/
      );
    });
  });

  describe('Documentation', () => {
    it('should have comment referencing T011', () => {
      expect(useHabitsListStateSource).toContain('T011');
    });
  });
});

describe('useHabitsModalsState - Offline Detection (Code Verification)', () => {
  const useHabitsModalsStatePath = path.resolve(
    __dirname,
    '../hooks/useHabitsModalsState.ts'
  );

  let useHabitsModalsStateSource: string;

  beforeAll(() => {
    useHabitsModalsStateSource = fs.readFileSync(
      useHabitsModalsStatePath,
      'utf-8'
    );
  });

  describe('Import Integration', () => {
    it('should import useOptimisticToggleMutation', () => {
      expect(useHabitsModalsStateSource).toContain(
        "import { useOptimisticToggleMutation } from '../../../lib/optimistic'"
      );
    });
  });

  describe('Hook Implementation', () => {
    it('should destructure isOnline from useHabitMutations', () => {
      expect(useHabitsModalsStateSource).toMatch(
        /const\s*\{[\s\S]*isOnline[\s\S]*\}\s*=\s*useHabitMutations/
      );
    });

    it('should destructure isCompleted from modal tracking', () => {
      expect(useHabitsModalsStateSource).toMatch(
        /const\s*\{[\s\S]*isCompleted[\s\S]*\}\s*=\s*useModalTracking/
      );
      expect(useHabitsModalsStateSource).toContain(
        'fallbackTracking: homeTracking'
      );
    });

    it('should create optimisticToggleHabit with offline support', () => {
      expect(useHabitsModalsStateSource).toContain('optimisticToggleHabit');
      expect(useHabitsModalsStateSource).toContain('{ isOnline }');
    });

    it('should use optimisticToggleHabit in handleToggleHabit', () => {
      expect(useHabitsModalsStateSource).toContain(
        'await optimisticToggleHabit(args)'
      );
    });
  });

  describe('Documentation', () => {
    it('should have comment referencing T011', () => {
      expect(useHabitsModalsStateSource).toContain('T011');
    });
  });
});

describe('Integration Contract Verification', () => {
  describe('NetworkStatusContext useIsOnline contract', () => {
    it('should export useIsOnline hook', () => {
      const networkStatusPath = path.resolve(
        __dirname,
        '../../../contexts/NetworkStatusContext/index.ts'
      );
      const source = fs.readFileSync(networkStatusPath, 'utf-8');

      expect(source).toContain('useIsOnline');
      expect(source).toMatch(/export\s*\{[\s\S]*useIsOnline[\s\S]*\}/);
    });

    it('should have useIsOnline return boolean', () => {
      const hooksPath = path.resolve(
        __dirname,
        '../../../contexts/NetworkStatusContext/hooks.ts'
      );
      const source = fs.readFileSync(hooksPath, 'utf-8');

      expect(source).toContain('export function useIsOnline(): boolean');
    });
  });

  describe('useOptimisticToggleMutation options contract', () => {
    it('should accept OptimisticToggleOptions with isOnline', () => {
      const toggleMutationPath = path.resolve(
        __dirname,
        '../../../lib/optimistic/hooks/useOptimisticToggleMutation.ts'
      );
      const source = fs.readFileSync(toggleMutationPath, 'utf-8');

      expect(source).toContain('OptimisticToggleOptions');
      expect(source).toContain('isOnline: boolean');
    });
  });
});
