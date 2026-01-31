/**
 * Orphan Cleanup Main Function Tests
 */

import type { Id } from '../../../../../../convex/_generated/dataModel';
import type { OfflineOperation } from '../../../queue';
import {
  cleanupOrphans,
  createOrphanCleaner,
  DEFAULT_CLEANUP_BATCH_SIZE,
} from '../cleanupOrphans';
import type {
  CleanupOrphansConfig,
  CleanupOrphansDeps,
  CleanupOrphansEvent,
  HabitExistsResult,
  OrphanedOperation,
} from '../types';

// Helper to create test operations
function createTestOperation(
  id: string,
  habitId: string,
  date: string = '2024-01-15'
): OfflineOperation {
  return {
    id,
    type: 'toggleCompletion',
    payload: {
      habitId: habitId as Id<'habits'>,
      date,
      toCompleted: true,
    },
    status: 'pending',
    createdAt: Date.now(),
    retryCount: 0,
  };
}

// Mock dependencies factory
function createMockDeps(
  operations: OfflineOperation[] = [],
  existingHabits: Set<string> = new Set()
): CleanupOrphansDeps & {
  removedIds: string[];
  checkedHabits: string[];
} {
  const removedIds: string[] = [];
  const checkedHabits: string[] = [];

  return {
    getOperations: () => operations,
    removeOperation: (id: string) => {
      removedIds.push(id);
      return true;
    },
    checkHabitExists: async (
      habitId: Id<'habits'>
    ): Promise<HabitExistsResult> => {
      checkedHabits.push(habitId);
      return {
        habitId,
        exists: existingHabits.has(habitId),
      };
    },
    removedIds,
    checkedHabits,
  };
}

describe('cleanupOrphans', () => {
  describe('with no operations', () => {
    it('returns empty result', async () => {
      const deps = createMockDeps([]);

      const result = await cleanupOrphans(deps);

      expect(result.totalChecked).toBe(0);
      expect(result.orphansFound).toBe(0);
      expect(result.orphansRemoved).toBe(0);
      expect(result.allCleaned).toBe(true);
    });
  });

  describe('with no orphans', () => {
    it('returns result with zero orphans found', async () => {
      const operations = [
        createTestOperation('op1', 'habit-a'),
        createTestOperation('op2', 'habit-b'),
      ];
      const existingHabits = new Set(['habit-a', 'habit-b']);
      const deps = createMockDeps(operations, existingHabits);

      const result = await cleanupOrphans(deps);

      expect(result.totalChecked).toBe(2);
      expect(result.orphansFound).toBe(0);
      expect(result.orphansRemoved).toBe(0);
      expect(deps.removedIds).toEqual([]);
    });
  });

  describe('with orphaned operations', () => {
    it('removes orphaned operations', async () => {
      const operations = [
        createTestOperation('op1', 'habit-exists'),
        createTestOperation('op2', 'habit-deleted'),
        createTestOperation('op3', 'habit-deleted'),
      ];
      const existingHabits = new Set(['habit-exists']);
      const deps = createMockDeps(operations, existingHabits);

      const result = await cleanupOrphans(deps);

      expect(result.orphansFound).toBe(2);
      expect(result.orphansRemoved).toBe(2);
      expect(deps.removedIds).toContain('op2');
      expect(deps.removedIds).toContain('op3');
      expect(deps.removedIds).not.toContain('op1');
    });

    it('tracks deleted habit IDs', async () => {
      const operations = [
        createTestOperation('op1', 'habit-deleted-1'),
        createTestOperation('op2', 'habit-deleted-2'),
      ];
      const deps = createMockDeps(operations, new Set());

      const result = await cleanupOrphans(deps);

      expect(result.deletedHabitIds).toContain('habit-deleted-1');
      expect(result.deletedHabitIds).toContain('habit-deleted-2');
    });

    it('records cleaned operations', async () => {
      const operations = [createTestOperation('op1', 'habit-deleted')];
      const deps = createMockDeps(operations, new Set());

      const result = await cleanupOrphans(deps);

      expect(result.cleanedOperations).toHaveLength(1);
      expect(result.cleanedOperations[0].operation.id).toBe('op1');
      expect(result.cleanedOperations[0].deletedHabitId).toBe('habit-deleted');
    });
  });

  describe('batch size limiting', () => {
    it('respects default batch size', () => {
      expect(DEFAULT_CLEANUP_BATCH_SIZE).toBe(100);
    });

    it('limits operations to batch size', async () => {
      const operations = Array.from({ length: 150 }, (_, i) =>
        createTestOperation(`op${i}`, `habit-${i}`)
      );
      const deps = createMockDeps(operations, new Set());

      const result = await cleanupOrphans(deps, { batchSize: 50 });

      expect(result.totalChecked).toBe(50);
    });

    it('checks only unique habits in batch', async () => {
      const operations = [
        createTestOperation('op1', 'habit-a'),
        createTestOperation('op2', 'habit-a'),
        createTestOperation('op3', 'habit-b'),
      ];
      const existingHabits = new Set(['habit-a', 'habit-b']);
      const deps = createMockDeps(operations, existingHabits);

      await cleanupOrphans(deps);

      // Should only check each habit once
      expect(deps.checkedHabits).toHaveLength(2);
    });
  });

  describe('callbacks', () => {
    it('calls onOrphanFound for each orphan', async () => {
      const operations = [
        createTestOperation('op1', 'habit-deleted'),
        createTestOperation('op2', 'habit-deleted'),
      ];
      const deps = createMockDeps(operations, new Set());
      const foundOrphans: OrphanedOperation[] = [];

      await cleanupOrphans(deps, {
        onOrphanFound: (orphan) => foundOrphans.push(orphan),
      });

      expect(foundOrphans).toHaveLength(2);
    });

    it('calls onOrphanRemoved for each removed orphan', async () => {
      const operations = [createTestOperation('op1', 'habit-deleted')];
      const deps = createMockDeps(operations, new Set());
      const removedOrphans: OrphanedOperation[] = [];

      await cleanupOrphans(deps, {
        onOrphanRemoved: (orphan) => removedOrphans.push(orphan),
      });

      expect(removedOrphans).toHaveLength(1);
    });
  });

  describe('event emission', () => {
    it('emits cleanup:started event', async () => {
      const deps = createMockDeps([]);
      const events: CleanupOrphansEvent[] = [];

      await cleanupOrphans(deps, undefined, (e) => events.push(e));

      expect(events[0].type).toBe('cleanup:started');
    });

    it('emits cleanup:completed event', async () => {
      const deps = createMockDeps([]);
      const events: CleanupOrphansEvent[] = [];

      await cleanupOrphans(deps, undefined, (e) => events.push(e));

      const completed = events.find((e) => e.type === 'cleanup:completed');
      expect(completed).toBeDefined();
      expect(completed?.data?.result).toBeDefined();
    });

    it('emits cleanup:orphan_found events', async () => {
      const operations = [createTestOperation('op1', 'habit-deleted')];
      const deps = createMockDeps(operations, new Set());
      const events: CleanupOrphansEvent[] = [];

      await cleanupOrphans(deps, undefined, (e) => events.push(e));

      const foundEvents = events.filter(
        (e) => e.type === 'cleanup:orphan_found'
      );
      expect(foundEvents).toHaveLength(1);
      expect(foundEvents[0].data?.habitId).toBe('habit-deleted');
    });

    it('emits cleanup:orphan_removed events', async () => {
      const operations = [createTestOperation('op1', 'habit-deleted')];
      const deps = createMockDeps(operations, new Set());
      const events: CleanupOrphansEvent[] = [];

      await cleanupOrphans(deps, undefined, (e) => events.push(e));

      const removedEvents = events.filter(
        (e) => e.type === 'cleanup:orphan_removed'
      );
      expect(removedEvents).toHaveLength(1);
    });
  });

  describe('error handling', () => {
    it('emits error event on failure', async () => {
      const deps: CleanupOrphansDeps = {
        getOperations: () => {
          throw new Error('Test error');
        },
        removeOperation: () => true,
        checkHabitExists: async () => ({
          habitId: '' as Id<'habits'>,
          exists: true,
        }),
      };
      const events: CleanupOrphansEvent[] = [];

      await expect(
        cleanupOrphans(deps, undefined, (e) => events.push(e))
      ).rejects.toThrow('Test error');

      const errorEvent = events.find((e) => e.type === 'cleanup:error');
      expect(errorEvent).toBeDefined();
      expect(errorEvent?.data?.error?.message).toBe('Test error');
    });

    it('assumes habit exists on check failure (fail-safe)', async () => {
      const operations = [createTestOperation('op1', 'habit-error')];
      let checkCount = 0;
      const deps: CleanupOrphansDeps = {
        getOperations: () => operations,
        removeOperation: () => true,
        checkHabitExists: async () => {
          checkCount++;
          throw new Error('Network error');
        },
      };

      const result = await cleanupOrphans(deps);

      expect(checkCount).toBe(1);
      // Should NOT remove because we assume exists on error
      expect(result.orphansFound).toBe(0);
    });
  });

  describe('duration tracking', () => {
    it('tracks cleanup duration', async () => {
      const operations = [createTestOperation('op1', 'habit-a')];
      const deps = createMockDeps(operations, new Set(['habit-a']));

      const result = await cleanupOrphans(deps);

      expect(result.durationMs).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('createOrphanCleaner', () => {
  it('creates a reusable cleanup function', async () => {
    const operations = [createTestOperation('op1', 'habit-deleted')];
    const deps = createMockDeps(operations, new Set());

    const cleaner = createOrphanCleaner(deps);
    const result = await cleaner();

    expect(result.orphansFound).toBe(1);
    expect(result.orphansRemoved).toBe(1);
  });

  it('accepts config and event listener', async () => {
    const operations = [createTestOperation('op1', 'habit-deleted')];
    const deps = createMockDeps(operations, new Set());
    const events: CleanupOrphansEvent[] = [];

    const cleaner = createOrphanCleaner(deps);
    await cleaner({ batchSize: 10 }, (e) => events.push(e));

    expect(events.length).toBeGreaterThan(0);
  });
});
