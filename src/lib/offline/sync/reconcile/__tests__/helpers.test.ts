/**
 * Reconciliation Helpers Tests
 */

import type { Id } from '../../../../../../convex/_generated/dataModel';
import type { ProcessedOperation, SyncedHabit } from '../types';
import {
  buildReconciliationResult,
  buildSyncedHabits,
  createEmptyReconciliationResult,
  extractSyncedDates,
  extractSyncedHabits,
  groupOperationsByHabit,
  updateHabitSyncTimestamps,
  wasHabitSyncedAfter,
} from '../helpers';

// Helper to create test operations
function createOperation(
  id: string,
  habitId: string,
  date: string,
  success: boolean
): ProcessedOperation {
  return {
    date,
    habitId: habitId as Id<'habits'>,
    id,
    success,
  };
}

describe('groupOperationsByHabit', () => {
  it('groups successful operations by habit ID', () => {
    const operations: ProcessedOperation[] = [
      createOperation('op1', 'habit1', '2026-01-15', true),
      createOperation('op2', 'habit1', '2026-01-16', true),
      createOperation('op3', 'habit2', '2026-01-15', true),
    ];

    const grouped = groupOperationsByHabit(operations);

    expect(grouped.size).toBe(2);
    expect(grouped.get('habit1')?.length).toBe(2);
    expect(grouped.get('habit2')?.length).toBe(1);
  });

  it('filters out failed operations', () => {
    const operations: ProcessedOperation[] = [
      createOperation('op1', 'habit1', '2026-01-15', true),
      createOperation('op2', 'habit1', '2026-01-16', false),
      createOperation('op3', 'habit2', '2026-01-15', false),
    ];

    const grouped = groupOperationsByHabit(operations);

    expect(grouped.size).toBe(1);
    expect(grouped.get('habit1')?.length).toBe(1);
    expect(grouped.has('habit2')).toBe(false);
  });

  it('returns empty map for no successful operations', () => {
    const operations: ProcessedOperation[] = [
      createOperation('op1', 'habit1', '2026-01-15', false),
    ];

    const grouped = groupOperationsByHabit(operations);

    expect(grouped.size).toBe(0);
  });

  it('handles empty array', () => {
    const grouped = groupOperationsByHabit([]);
    expect(grouped.size).toBe(0);
  });
});

describe('extractSyncedDates', () => {
  it('extracts unique dates from operations', () => {
    const operations: ProcessedOperation[] = [
      createOperation('op1', 'habit1', '2026-01-15', true),
      createOperation('op2', 'habit1', '2026-01-16', true),
      createOperation('op3', 'habit1', '2026-01-15', true), // duplicate
    ];

    const dates = extractSyncedDates(operations);

    expect(dates).toEqual(['2026-01-15', '2026-01-16']);
  });

  it('returns sorted dates', () => {
    const operations: ProcessedOperation[] = [
      createOperation('op1', 'habit1', '2026-01-20', true),
      createOperation('op2', 'habit1', '2026-01-10', true),
      createOperation('op3', 'habit1', '2026-01-15', true),
    ];

    const dates = extractSyncedDates(operations);

    expect(dates).toEqual(['2026-01-10', '2026-01-15', '2026-01-20']);
  });

  it('returns empty array for no operations', () => {
    const dates = extractSyncedDates([]);
    expect(dates).toEqual([]);
  });
});

describe('buildSyncedHabits', () => {
  it('builds SyncedHabit objects from grouped operations', () => {
    const grouped = new Map<string, ProcessedOperation[]>([
      [
        'habit1',
        [
          createOperation('op1', 'habit1', '2026-01-15', true),
          createOperation('op2', 'habit1', '2026-01-16', true),
        ],
      ],
      ['habit2', [createOperation('op3', 'habit2', '2026-01-15', true)]],
    ]);

    const syncedAt = 1706835600000;
    const habits = buildSyncedHabits(grouped, syncedAt);

    expect(habits.length).toBe(2);

    const habit1 = habits.find((h) => h.habitId === 'habit1');
    expect(habit1?.syncedDates).toEqual(['2026-01-15', '2026-01-16']);
    expect(habit1?.syncedAt).toBe(syncedAt);

    const habit2 = habits.find((h) => h.habitId === 'habit2');
    expect(habit2?.syncedDates).toEqual(['2026-01-15']);
    expect(habit2?.syncedAt).toBe(syncedAt);
  });

  it('returns empty array for empty map', () => {
    const habits = buildSyncedHabits(new Map(), Date.now());
    expect(habits).toEqual([]);
  });
});

describe('extractSyncedHabits', () => {
  it('extracts synced habits from operations', () => {
    const operations: ProcessedOperation[] = [
      createOperation('op1', 'habit1', '2026-01-15', true),
      createOperation('op2', 'habit1', '2026-01-16', true),
      createOperation('op3', 'habit2', '2026-01-15', true),
      createOperation('op4', 'habit3', '2026-01-15', false), // failed
    ];

    const habits = extractSyncedHabits(operations);

    expect(habits.length).toBe(2);
    expect(habits.map((h) => h.habitId).sort()).toEqual(['habit1', 'habit2']);
  });

  it('returns empty array when all operations failed', () => {
    const operations: ProcessedOperation[] = [
      createOperation('op1', 'habit1', '2026-01-15', false),
      createOperation('op2', 'habit2', '2026-01-15', false),
    ];

    const habits = extractSyncedHabits(operations);

    expect(habits).toEqual([]);
  });

  it('returns empty array for empty input', () => {
    const habits = extractSyncedHabits([]);
    expect(habits).toEqual([]);
  });
});

describe('createEmptyReconciliationResult', () => {
  it('creates empty result with correct structure', () => {
    const result = createEmptyReconciliationResult();

    expect(result.allReconciled).toBe(true);
    expect(result.totalReconciled).toBe(0);
    expect(result.reconciledHabits).toEqual([]);
    expect(result.durationMs).toBe(0);
    expect(result.completedAt).toBeGreaterThan(0);
  });
});

describe('buildReconciliationResult', () => {
  it('builds result from synced habits', () => {
    const syncedHabits: SyncedHabit[] = [
      {
        habitId: 'habit1' as Id<'habits'>,
        syncedAt: Date.now(),
        syncedDates: ['2026-01-15', '2026-01-16'],
      },
      {
        habitId: 'habit2' as Id<'habits'>,
        syncedAt: Date.now(),
        syncedDates: ['2026-01-15'],
      },
    ];

    const startTime = Date.now() - 50;
    const result = buildReconciliationResult(syncedHabits, startTime);

    expect(result.allReconciled).toBe(true);
    expect(result.totalReconciled).toBe(3); // 2 + 1 dates
    expect(result.reconciledHabits).toEqual(syncedHabits);
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
    expect(result.completedAt).toBeGreaterThan(startTime);
  });

  it('handles empty synced habits', () => {
    const startTime = Date.now();
    const result = buildReconciliationResult([], startTime);

    expect(result.totalReconciled).toBe(0);
    expect(result.reconciledHabits).toEqual([]);
  });
});

describe('updateHabitSyncTimestamps', () => {
  it('adds new habits to timestamps', () => {
    const existing = new Map<string, number>();
    const syncedHabits: SyncedHabit[] = [
      {
        habitId: 'habit1' as Id<'habits'>,
        syncedAt: 1000,
        syncedDates: ['2026-01-15'],
      },
    ];

    const updated = updateHabitSyncTimestamps(existing, syncedHabits);

    expect(updated.get('habit1')).toBe(1000);
  });

  it('updates existing habit with newer timestamp', () => {
    const existing = new Map<string, number>([['habit1', 1000]]);
    const syncedHabits: SyncedHabit[] = [
      {
        habitId: 'habit1' as Id<'habits'>,
        syncedAt: 2000,
        syncedDates: ['2026-01-15'],
      },
    ];

    const updated = updateHabitSyncTimestamps(existing, syncedHabits);

    expect(updated.get('habit1')).toBe(2000);
  });

  it('keeps existing timestamp if newer', () => {
    const existing = new Map<string, number>([['habit1', 3000]]);
    const syncedHabits: SyncedHabit[] = [
      {
        habitId: 'habit1' as Id<'habits'>,
        syncedAt: 2000,
        syncedDates: ['2026-01-15'],
      },
    ];

    const updated = updateHabitSyncTimestamps(existing, syncedHabits);

    expect(updated.get('habit1')).toBe(3000);
  });

  it('preserves other habits', () => {
    const existing = new Map<string, number>([['habit1', 1000]]);
    const syncedHabits: SyncedHabit[] = [
      {
        habitId: 'habit2' as Id<'habits'>,
        syncedAt: 2000,
        syncedDates: ['2026-01-15'],
      },
    ];

    const updated = updateHabitSyncTimestamps(existing, syncedHabits);

    expect(updated.get('habit1')).toBe(1000);
    expect(updated.get('habit2')).toBe(2000);
  });
});

describe('wasHabitSyncedAfter', () => {
  it('returns true if habit synced after timestamp', () => {
    const timestamps = new Map<string, number>([['habit1', 2000]]);

    expect(wasHabitSyncedAfter(timestamps, 'habit1', 1000)).toBe(true);
  });

  it('returns false if habit synced before timestamp', () => {
    const timestamps = new Map<string, number>([['habit1', 1000]]);

    expect(wasHabitSyncedAfter(timestamps, 'habit1', 2000)).toBe(false);
  });

  it('returns false if habit synced at same timestamp', () => {
    const timestamps = new Map<string, number>([['habit1', 1000]]);

    expect(wasHabitSyncedAfter(timestamps, 'habit1', 1000)).toBe(false);
  });

  it('returns false if habit not in map', () => {
    const timestamps = new Map<string, number>();

    expect(wasHabitSyncedAfter(timestamps, 'habit1', 1000)).toBe(false);
  });
});
