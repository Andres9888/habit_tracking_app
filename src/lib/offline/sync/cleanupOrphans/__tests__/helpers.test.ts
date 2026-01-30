/**
 * Orphan Cleanup Helpers Tests
 */

import type { Id } from '../../../../../../convex/_generated/dataModel';
import type { OfflineOperation } from '../../../queue';
import {
  buildCleanupResult,
  createCleanupEvent,
  createEmptyCleanupResult,
  createOrphanedOperation,
  extractUniqueHabitIds,
  findDeletedHabitIds,
  groupOperationsByHabit,
  identifyOrphans,
} from '../helpers';
import type { HabitExistsResult, OrphanedOperation } from '../types';

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

describe('extractUniqueHabitIds', () => {
  it('extracts unique habit IDs from operations', () => {
    const operations: OfflineOperation[] = [
      createTestOperation('op1', 'habit-a'),
      createTestOperation('op2', 'habit-b'),
      createTestOperation('op3', 'habit-a'), // duplicate
      createTestOperation('op4', 'habit-c'),
    ];

    const habitIds = extractUniqueHabitIds(operations);

    expect(habitIds).toHaveLength(3);
    expect(habitIds).toContain('habit-a');
    expect(habitIds).toContain('habit-b');
    expect(habitIds).toContain('habit-c');
  });

  it('returns empty array for empty operations', () => {
    const habitIds = extractUniqueHabitIds([]);
    expect(habitIds).toEqual([]);
  });

  it('handles single operation', () => {
    const operations = [createTestOperation('op1', 'habit-x')];
    const habitIds = extractUniqueHabitIds(operations);
    expect(habitIds).toEqual(['habit-x']);
  });
});

describe('groupOperationsByHabit', () => {
  it('groups operations by habit ID', () => {
    const operations: OfflineOperation[] = [
      createTestOperation('op1', 'habit-a', '2024-01-01'),
      createTestOperation('op2', 'habit-b', '2024-01-02'),
      createTestOperation('op3', 'habit-a', '2024-01-03'),
    ];

    const grouped = groupOperationsByHabit(operations);

    expect(grouped.size).toBe(2);
    expect(grouped.get('habit-a')).toHaveLength(2);
    expect(grouped.get('habit-b')).toHaveLength(1);
  });

  it('returns empty map for empty operations', () => {
    const grouped = groupOperationsByHabit([]);
    expect(grouped.size).toBe(0);
  });
});

describe('findDeletedHabitIds', () => {
  it('finds habits that do not exist', () => {
    const results: HabitExistsResult[] = [
      { habitId: 'habit-a' as Id<'habits'>, exists: true },
      { habitId: 'habit-b' as Id<'habits'>, exists: false },
      { habitId: 'habit-c' as Id<'habits'>, exists: true },
      { habitId: 'habit-d' as Id<'habits'>, exists: false },
    ];

    const deleted = findDeletedHabitIds(results);

    expect(deleted).toHaveLength(2);
    expect(deleted).toContain('habit-b');
    expect(deleted).toContain('habit-d');
  });

  it('returns empty array when all exist', () => {
    const results: HabitExistsResult[] = [
      { habitId: 'habit-a' as Id<'habits'>, exists: true },
      { habitId: 'habit-b' as Id<'habits'>, exists: true },
    ];

    const deleted = findDeletedHabitIds(results);
    expect(deleted).toEqual([]);
  });

  it('returns all when none exist', () => {
    const results: HabitExistsResult[] = [
      { habitId: 'habit-a' as Id<'habits'>, exists: false },
      { habitId: 'habit-b' as Id<'habits'>, exists: false },
    ];

    const deleted = findDeletedHabitIds(results);
    expect(deleted).toHaveLength(2);
  });
});

describe('createOrphanedOperation', () => {
  it('creates orphaned operation record', () => {
    const operation = createTestOperation('op1', 'habit-deleted');
    const habitId = 'habit-deleted' as Id<'habits'>;

    const orphan = createOrphanedOperation(operation, habitId);

    expect(orphan.operation).toBe(operation);
    expect(orphan.deletedHabitId).toBe('habit-deleted');
    expect(orphan.detectedAt).toBeLessThanOrEqual(Date.now());
    expect(orphan.detectedAt).toBeGreaterThan(Date.now() - 1000);
  });
});

describe('identifyOrphans', () => {
  it('identifies all orphaned operations', () => {
    const operations: OfflineOperation[] = [
      createTestOperation('op1', 'habit-a'),
      createTestOperation('op2', 'habit-b'),
      createTestOperation('op3', 'habit-a'),
      createTestOperation('op4', 'habit-c'),
    ];

    const grouped = groupOperationsByHabit(operations);
    const deletedHabitIds = ['habit-a', 'habit-c'] as Id<'habits'>[];

    const orphans = identifyOrphans(grouped, deletedHabitIds);

    expect(orphans).toHaveLength(3); // 2 from habit-a + 1 from habit-c
    expect(orphans.map((o) => o.operation.id).sort()).toEqual([
      'op1',
      'op3',
      'op4',
    ]);
  });

  it('returns empty array when no deleted habits', () => {
    const operations = [createTestOperation('op1', 'habit-a')];
    const grouped = groupOperationsByHabit(operations);

    const orphans = identifyOrphans(grouped, []);
    expect(orphans).toEqual([]);
  });

  it('handles deleted habit with no operations', () => {
    const operations = [createTestOperation('op1', 'habit-a')];
    const grouped = groupOperationsByHabit(operations);
    const deletedHabitIds = ['habit-nonexistent'] as Id<'habits'>[];

    const orphans = identifyOrphans(grouped, deletedHabitIds);
    expect(orphans).toEqual([]);
  });
});

describe('createCleanupEvent', () => {
  it('creates event with type and timestamp', () => {
    const event = createCleanupEvent('cleanup:started');

    expect(event.type).toBe('cleanup:started');
    expect(event.timestamp).toBeLessThanOrEqual(Date.now());
    expect(event.data).toBeUndefined();
  });

  it('creates event with data', () => {
    const orphan: OrphanedOperation = {
      operation: createTestOperation('op1', 'habit-x'),
      deletedHabitId: 'habit-x' as Id<'habits'>,
      detectedAt: Date.now(),
    };

    const event = createCleanupEvent('cleanup:orphan_found', { orphan });

    expect(event.type).toBe('cleanup:orphan_found');
    expect(event.data?.orphan).toBe(orphan);
  });
});

describe('createEmptyCleanupResult', () => {
  it('creates result with zero counts', () => {
    const result = createEmptyCleanupResult();

    expect(result.totalChecked).toBe(0);
    expect(result.orphansFound).toBe(0);
    expect(result.orphansRemoved).toBe(0);
    expect(result.cleanedOperations).toEqual([]);
    expect(result.deletedHabitIds).toEqual([]);
    expect(result.durationMs).toBe(0);
    expect(result.allCleaned).toBe(true);
  });
});

describe('buildCleanupResult', () => {
  it('builds result from processed data', () => {
    const orphan: OrphanedOperation = {
      operation: createTestOperation('op1', 'habit-x'),
      deletedHabitId: 'habit-x' as Id<'habits'>,
      detectedAt: Date.now(),
    };
    const deletedHabitIds = ['habit-x'] as Id<'habits'>[];
    const startTime = Date.now() - 100;

    const result = buildCleanupResult(
      10,
      [orphan],
      1,
      deletedHabitIds,
      startTime
    );

    expect(result.totalChecked).toBe(10);
    expect(result.orphansFound).toBe(1);
    expect(result.orphansRemoved).toBe(1);
    expect(result.cleanedOperations).toHaveLength(1);
    expect(result.deletedHabitIds).toEqual(['habit-x']);
    expect(result.durationMs).toBeGreaterThanOrEqual(100);
    expect(result.allCleaned).toBe(true);
  });

  it('sets allCleaned to false when not all removed', () => {
    const orphan: OrphanedOperation = {
      operation: createTestOperation('op1', 'habit-x'),
      deletedHabitId: 'habit-x' as Id<'habits'>,
      detectedAt: Date.now(),
    };

    const result = buildCleanupResult(5, [orphan], 0, [], Date.now());

    expect(result.allCleaned).toBe(false);
  });
});
