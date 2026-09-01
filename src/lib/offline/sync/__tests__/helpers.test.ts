/**
 * Sync Orchestrator Helpers Tests
 */

import {
  filterPendingOperations,
  getOperationsForSync,
  shouldSkipSync,
  DEFAULT_ORCHESTRATOR_CONFIG,
} from '../helpers';
import type { OfflineOperation } from '../../queue';

describe('Sync Orchestrator Helpers', () => {
  const createOperation = (
    overrides: Partial<OfflineOperation> = {}
  ): OfflineOperation => ({
    createdAt: Date.now(),
    id: `op_${Date.now()}_${Math.random()}`,
    payload: {
      date: '2026-01-30',
      habitId: 'habit_123' as unknown,
      toCompleted: true,
    },
    retryCount: 0,
    status: 'pending',
    type: 'toggleCompletion',
    ...overrides,
  });

  describe('filterPendingOperations', () => {
    it('filters only pending operations', () => {
      const operations = [
        createOperation({ id: 'pending-1', status: 'pending' }),
        createOperation({ id: 'syncing-1', status: 'syncing' }),
        createOperation({ id: 'pending-2', status: 'pending' }),
        createOperation({ id: 'completed-1', status: 'completed' }),
        createOperation({ id: 'failed-1', status: 'failed' }),
      ];

      const pending = filterPendingOperations(operations);

      expect(pending).toHaveLength(2);
      expect(pending.map((op) => op.id)).toEqual(['pending-1', 'pending-2']);
    });

    it('returns empty array when no pending', () => {
      const operations = [
        createOperation({ status: 'syncing' }),
        createOperation({ status: 'completed' }),
      ];

      expect(filterPendingOperations(operations)).toEqual([]);
    });
  });

  describe('getOperationsForSync', () => {
    it('returns pending operations sorted by createdAt (FIFO)', () => {
      const now = Date.now();
      const operations = [
        createOperation({ createdAt: now + 200, id: 'third' }),
        createOperation({ createdAt: now, id: 'first' }),
        createOperation({ createdAt: now + 100, id: 'second' }),
      ];

      const forSync = getOperationsForSync(operations, 10);

      expect(forSync.map((op) => op.id)).toEqual(['first', 'second', 'third']);
    });

    it('respects limit parameter', () => {
      const operations = Array.from({ length: 10 }, (_, i) =>
        createOperation({ createdAt: i, id: `op-${i}` })
      );

      const forSync = getOperationsForSync(operations, 3);

      expect(forSync).toHaveLength(3);
      expect(forSync.map((op) => op.id)).toEqual(['op-0', 'op-1', 'op-2']);
    });

    it('excludes non-pending operations', () => {
      const now = Date.now();
      const operations = [
        createOperation({ createdAt: now, id: 'pending-1', status: 'pending' }),
        createOperation({
          createdAt: now + 50,
          id: 'syncing-1',
          status: 'syncing',
        }),
        createOperation({
          createdAt: now + 100,
          id: 'pending-2',
          status: 'pending',
        }),
      ];

      const forSync = getOperationsForSync(operations, 10);

      expect(forSync).toHaveLength(2);
      expect(forSync.map((op) => op.id)).toEqual(['pending-1', 'pending-2']);
    });
  });

  describe('shouldSkipSync', () => {
    it('returns false when no previous sync', () => {
      expect(shouldSkipSync(undefined, 5000)).toBe(false);
    });

    it('returns true when within minimum interval', () => {
      const lastSync = Date.now() - 2000; // 2 seconds ago
      expect(shouldSkipSync(lastSync, 5000)).toBe(true);
    });

    it('returns false when past minimum interval', () => {
      const lastSync = Date.now() - 10000; // 10 seconds ago
      expect(shouldSkipSync(lastSync, 5000)).toBe(false);
    });

    it('returns false exactly at minimum interval', () => {
      const lastSync = Date.now() - 5000; // Exactly 5 seconds ago
      expect(shouldSkipSync(lastSync, 5000)).toBe(false);
    });
  });

  describe('DEFAULT_ORCHESTRATOR_CONFIG', () => {
    it('has expected default values', () => {
      expect(DEFAULT_ORCHESTRATOR_CONFIG.batchSize).toBe(50);
      expect(DEFAULT_ORCHESTRATOR_CONFIG.autoSyncOnOnline).toBe(true);
      expect(DEFAULT_ORCHESTRATOR_CONFIG.syncDebounceMs).toBe(1000);
      expect(DEFAULT_ORCHESTRATOR_CONFIG.minSyncIntervalMs).toBe(5000);
    });
  });
});
