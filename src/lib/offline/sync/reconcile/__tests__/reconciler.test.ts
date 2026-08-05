/**
 * StateReconciler Tests
 */

import type { Id } from '../../../../../../convex/_generated/dataModel';
import type { ProcessedOperation, ReconciliationEvent } from '../types';
import {
  createInitialState,
  DEFAULT_RECONCILIATION_CONFIG,
  StateReconciler,
} from '../reconciler';

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

describe('createInitialState', () => {
  it('creates state with correct defaults', () => {
    const state = createInitialState();

    expect(state.isReconciling).toBe(false);
    expect(state.lastResult).toBeUndefined();
    expect(state.habitSyncTimestamps.size).toBe(0);
    expect(state.pendingRefreshCount).toBe(0);
  });
});

describe('DEFAULT_RECONCILIATION_CONFIG', () => {
  it('has expected default values', () => {
    expect(DEFAULT_RECONCILIATION_CONFIG.autoReconcile).toBe(true);
    expect(DEFAULT_RECONCILIATION_CONFIG.reconcileDelayMs).toBe(100);
    expect(typeof DEFAULT_RECONCILIATION_CONFIG.onReconciled).toBe('function');
  });
});

describe('StateReconciler', () => {
  let reconciler: StateReconciler;

  beforeEach(() => {
    reconciler = new StateReconciler();
    jest.useFakeTimers();
  });

  afterEach(() => {
    reconciler.reset();
    jest.useRealTimers();
  });

  describe('constructor', () => {
    it('creates reconciler with default config', () => {
      const state = reconciler.getState();

      expect(state.isReconciling).toBe(false);
      expect(state.habitSyncTimestamps.size).toBe(0);
    });

    it('accepts custom config', () => {
      const onReconciled = jest.fn();
      const customReconciler = new StateReconciler({
        autoReconcile: false,
        onReconciled,
        reconcileDelayMs: 500,
      });

      // Schedule and verify it doesn't auto-reconcile
      customReconciler.scheduleReconcile([]);
      jest.advanceTimersByTime(600);
      expect(onReconciled).not.toHaveBeenCalled();

      customReconciler.reset();
    });
  });

  describe('getState', () => {
    it('returns a copy of state', () => {
      const state1 = reconciler.getState();
      const state2 = reconciler.getState();

      expect(state1).not.toBe(state2);
      expect(state1).toEqual(state2);
    });
  });

  describe('subscribe', () => {
    it('adds listener and returns unsubscribe function', () => {
      const listener = jest.fn();

      const unsubscribe = reconciler.subscribe(listener);

      expect(typeof unsubscribe).toBe('function');
    });

    it('calls listener on events', () => {
      const listener = jest.fn();
      reconciler.subscribe(listener);

      reconciler.reconcile([
        createOperation('op1', 'habit1', '2026-01-15', true),
      ]);

      expect(listener).toHaveBeenCalled();
    });

    it('unsubscribe removes listener', () => {
      const listener = jest.fn();
      const unsubscribe = reconciler.subscribe(listener);

      unsubscribe();
      reconciler.reconcile([
        createOperation('op1', 'habit1', '2026-01-15', true),
      ]);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('reconcile', () => {
    it('reconciles successful operations', () => {
      const operations: ProcessedOperation[] = [
        createOperation('op1', 'habit1', '2026-01-15', true),
        createOperation('op2', 'habit2', '2026-01-16', true),
      ];

      const result = reconciler.reconcile(operations);

      expect(result.allReconciled).toBe(true);
      expect(result.totalReconciled).toBe(2);
      expect(result.reconciledHabits.length).toBe(2);
    });

    it('filters out failed operations', () => {
      const operations: ProcessedOperation[] = [
        createOperation('op1', 'habit1', '2026-01-15', true),
        createOperation('op2', 'habit2', '2026-01-16', false),
      ];

      const result = reconciler.reconcile(operations);

      expect(result.totalReconciled).toBe(1);
      expect(result.reconciledHabits.length).toBe(1);
      expect(result.reconciledHabits[0].habitId).toBe('habit1');
    });

    it('updates habit sync timestamps', () => {
      reconciler.reconcile([
        createOperation('op1', 'habit1', '2026-01-15', true),
      ]);

      expect(reconciler.isHabitSynced('habit1')).toBe(true);
      expect(reconciler.getHabitSyncTimestamp('habit1')).toBeGreaterThan(0);
    });

    it('emits started and completed events', () => {
      const events: ReconciliationEvent[] = [];
      reconciler.subscribe((event) => events.push(event));

      reconciler.reconcile([
        createOperation('op1', 'habit1', '2026-01-15', true),
      ]);

      expect(events.map((e) => e.type)).toContain('reconcile:started');
      expect(events.map((e) => e.type)).toContain('reconcile:completed');
    });

    it('emits habit_synced event for each habit', () => {
      const events: ReconciliationEvent[] = [];
      reconciler.subscribe((event) => events.push(event));

      reconciler.reconcile([
        createOperation('op1', 'habit1', '2026-01-15', true),
        createOperation('op2', 'habit2', '2026-01-16', true),
      ]);

      const habitSyncedEvents = events.filter(
        (e) => e.type === 'reconcile:habit_synced'
      );
      expect(habitSyncedEvents.length).toBe(2);
    });

    it('calls onReconciled callback', () => {
      const onReconciled = jest.fn();
      const customReconciler = new StateReconciler({ onReconciled });

      customReconciler.reconcile([
        createOperation('op1', 'habit1', '2026-01-15', true),
      ]);

      expect(onReconciled).toHaveBeenCalledTimes(1);
      expect(onReconciled).toHaveBeenCalledWith(
        expect.objectContaining({
          allReconciled: true,
          totalReconciled: 1,
        })
      );

      customReconciler.reset();
    });

    it('returns empty result when already reconciling', () => {
      // Start reconciliation
      let resolvePromise: () => void;
      const blockingListener = jest.fn(
        () =>
          new Promise<void>((resolve) => {
            resolvePromise = resolve;
          })
      );

      // Mock isReconciling state
      const state = reconciler.getState();
      (reconciler as { state: typeof state }).state = {
        ...state,
        isReconciling: true,
      };

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = reconciler.reconcile([
        createOperation('op1', 'habit1', '2026-01-15', true),
      ]);

      expect(result.totalReconciled).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Reconciliation already in progress, skipping'
      );

      consoleSpy.mockRestore();
    });

    it('handles errors gracefully', () => {
      const events: ReconciliationEvent[] = [];
      reconciler.subscribe((event) => events.push(event));

      // Force an error by passing invalid data
      const invalidOps = [{ invalid: true }] as unknown as ProcessedOperation[];

      // The implementation is defensive, so it won't throw but may have issues
      // Let's test error handling by mocking
      const originalExtract = require('../helpers').extractSyncedHabits;
      jest
        .spyOn(require('../helpers'), 'extractSyncedHabits')
        .mockImplementation(() => {
          throw new Error('Test error');
        });

      const result = reconciler.reconcile([
        createOperation('op1', 'habit1', '2026-01-15', true),
      ]);

      const errorEvents = events.filter((e) => e.type === 'reconcile:error');
      expect(errorEvents.length).toBe(1);
      expect(result.totalReconciled).toBe(0);

      // Restore mock
      jest
        .spyOn(require('../helpers'), 'extractSyncedHabits')
        .mockImplementation(originalExtract);
    });

    it('handles empty operations array', () => {
      const result = reconciler.reconcile([]);

      expect(result.totalReconciled).toBe(0);
      expect(result.reconciledHabits).toEqual([]);
    });
  });

  describe('scheduleReconcile', () => {
    it('schedules reconciliation with delay', () => {
      const onReconciled = jest.fn();
      const customReconciler = new StateReconciler({
        onReconciled,
        reconcileDelayMs: 200,
      });

      customReconciler.scheduleReconcile([
        createOperation('op1', 'habit1', '2026-01-15', true),
      ]);

      expect(onReconciled).not.toHaveBeenCalled();

      jest.advanceTimersByTime(200);

      expect(onReconciled).toHaveBeenCalledTimes(1);

      customReconciler.reset();
    });

    it('does not schedule when autoReconcile is false', () => {
      const onReconciled = jest.fn();
      const customReconciler = new StateReconciler({
        autoReconcile: false,
        onReconciled,
      });

      customReconciler.scheduleReconcile([
        createOperation('op1', 'habit1', '2026-01-15', true),
      ]);

      jest.advanceTimersByTime(1000);

      expect(onReconciled).not.toHaveBeenCalled();

      customReconciler.reset();
    });

    it('cancels previous scheduled reconciliation', () => {
      const onReconciled = jest.fn();
      const customReconciler = new StateReconciler({
        onReconciled,
        reconcileDelayMs: 200,
      });

      customReconciler.scheduleReconcile([
        createOperation('op1', 'habit1', '2026-01-15', true),
      ]);
      customReconciler.scheduleReconcile([
        createOperation('op2', 'habit2', '2026-01-16', true),
      ]);

      jest.advanceTimersByTime(200);

      // Should only be called once
      expect(onReconciled).toHaveBeenCalledTimes(1);
      // Should reconcile the second schedule
      expect(onReconciled).toHaveBeenCalledWith(
        expect.objectContaining({
          reconciledHabits: expect.arrayContaining([
            expect.objectContaining({ habitId: 'habit2' }),
          ]),
        })
      );

      customReconciler.reset();
    });
  });

  describe('cancelScheduledReconcile', () => {
    it('cancels pending scheduled reconciliation', () => {
      const onReconciled = jest.fn();
      const customReconciler = new StateReconciler({
        onReconciled,
        reconcileDelayMs: 200,
      });

      customReconciler.scheduleReconcile([
        createOperation('op1', 'habit1', '2026-01-15', true),
      ]);
      customReconciler.cancelScheduledReconcile();

      jest.advanceTimersByTime(300);

      expect(onReconciled).not.toHaveBeenCalled();

      customReconciler.reset();
    });
  });

  describe('isHabitSynced', () => {
    it('returns true for synced habit', () => {
      reconciler.reconcile([
        createOperation('op1', 'habit1', '2026-01-15', true),
      ]);

      expect(reconciler.isHabitSynced('habit1')).toBe(true);
    });

    it('returns false for unsynced habit', () => {
      expect(reconciler.isHabitSynced('habit1')).toBe(false);
    });
  });

  describe('getHabitSyncTimestamp', () => {
    it('returns timestamp for synced habit', () => {
      const before = Date.now();
      reconciler.reconcile([
        createOperation('op1', 'habit1', '2026-01-15', true),
      ]);
      const after = Date.now();

      const timestamp = reconciler.getHabitSyncTimestamp('habit1');

      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });

    it('returns undefined for unsynced habit', () => {
      expect(reconciler.getHabitSyncTimestamp('habit1')).toBeUndefined();
    });
  });

  describe('clearSyncTimestamps', () => {
    it('clears all sync timestamps', () => {
      reconciler.reconcile([
        createOperation('op1', 'habit1', '2026-01-15', true),
        createOperation('op2', 'habit2', '2026-01-16', true),
      ]);

      reconciler.clearSyncTimestamps();

      expect(reconciler.isHabitSynced('habit1')).toBe(false);
      expect(reconciler.isHabitSynced('habit2')).toBe(false);
    });
  });

  describe('reset', () => {
    it('resets to initial state', () => {
      reconciler.reconcile([
        createOperation('op1', 'habit1', '2026-01-15', true),
      ]);
      const listener = jest.fn();
      reconciler.subscribe(listener);

      reconciler.reset();

      const state = reconciler.getState();
      expect(state.isReconciling).toBe(false);
      expect(state.lastResult).toBeUndefined();
      expect(state.habitSyncTimestamps.size).toBe(0);

      // Listener should be removed
      reconciler.reconcile([
        createOperation('op2', 'habit2', '2026-01-16', true),
      ]);
      expect(listener).not.toHaveBeenCalled();
    });

    it('cancels scheduled reconciliation on reset', () => {
      const onReconciled = jest.fn();
      const customReconciler = new StateReconciler({
        onReconciled,
        reconcileDelayMs: 200,
      });

      customReconciler.scheduleReconcile([
        createOperation('op1', 'habit1', '2026-01-15', true),
      ]);
      customReconciler.reset();

      jest.advanceTimersByTime(300);

      expect(onReconciled).not.toHaveBeenCalled();
    });
  });
});
