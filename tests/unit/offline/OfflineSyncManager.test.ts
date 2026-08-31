/**
 * Offline Sync Manager Tests
 */

import {
  OfflineSyncManager,
  getOfflineSyncManager,
  resetOfflineSyncManager,
  type SyncItem,
} from '~/lib/offline/syncManager';
import { createRetryContext } from '~/lib/offline/retryStrategy';

describe('OfflineSyncManager', () => {
  beforeEach(() => {
    resetOfflineSyncManager();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const createTestItem = <T>(id: string, payload: T): SyncItem<T> => ({
    id,
    payload,
    retryContext: createRetryContext(),
    type: 'test',
  });

  describe('initialization', () => {
    it('creates with default config', () => {
      const manager = new OfflineSyncManager();
      expect(manager.getStatus().isSyncing).toBe(false);
      expect(manager.canSync()).toBe(true);
    });
  });

  describe('syncItem', () => {
    it('returns success on successful sync', async () => {
      const manager = new OfflineSyncManager();
      const item = createTestItem('1', { data: 'test' });
      const executor = jest.fn().mockResolvedValue(undefined);
      const result = await manager.syncItem(item, executor);
      expect(result.success).toBe(true);
      expect(executor).toHaveBeenCalledWith(item);
    });

    it('updates retry context on failure', async () => {
      const manager = new OfflineSyncManager();
      const item = createTestItem('1', { data: 'test' });
      const executor = jest.fn().mockRejectedValue(new Error('Network error'));
      const result = await manager.syncItem(item, executor);
      expect(result.success).toBe(false);
      expect(result.item.retryContext.attemptCount).toBe(1);
    });

    it('skips when circuit is open', async () => {
      const manager = new OfflineSyncManager({
        circuitBreaker: { failureThreshold: 1 },
      });
      const item = createTestItem('1', { data: 'test' });
      const failingExecutor = jest
        .fn()
        .mockRejectedValue(new Error('Network error'));
      const successExecutor = jest.fn().mockResolvedValue(undefined);
      await manager.syncItem(item, failingExecutor);
      const result = await manager.syncItem(
        createTestItem('2', {}),
        successExecutor
      );
      expect(result.success).toBe(false);
      expect(successExecutor).not.toHaveBeenCalled();
    });
  });

  describe('event emission', () => {
    it('emits item success events', async () => {
      const manager = new OfflineSyncManager();
      const listener = jest.fn();
      manager.subscribe(listener);
      await manager.syncItem(
        createTestItem('1', {}),
        jest.fn().mockResolvedValue(undefined)
      );
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'sync:item:success' })
      );
    });

    it('emits circuit:open event', async () => {
      const manager = new OfflineSyncManager({
        circuitBreaker: { failureThreshold: 1 },
      });
      const listener = jest.fn();
      manager.subscribe(listener);
      await manager.syncItem(
        createTestItem('1', {}),
        jest.fn().mockRejectedValue(new Error('Network error'))
      );
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'circuit:open' })
      );
    });
  });

  describe('resetCircuit', () => {
    it('resets circuit breaker', async () => {
      const manager = new OfflineSyncManager({
        circuitBreaker: { failureThreshold: 1 },
      });
      await manager.syncItem(
        createTestItem('1', {}),
        jest.fn().mockRejectedValue(new Error('Network error'))
      );
      expect(manager.canSync()).toBe(false);
      manager.resetCircuit();
      expect(manager.canSync()).toBe(true);
    });
  });

  describe('singleton', () => {
    it('returns same instance', () => {
      const manager1 = getOfflineSyncManager();
      const manager2 = getOfflineSyncManager();
      expect(manager1).toBe(manager2);
    });

    it('resets on resetOfflineSyncManager', () => {
      const manager1 = getOfflineSyncManager();
      resetOfflineSyncManager();
      const manager2 = getOfflineSyncManager();
      expect(manager1).not.toBe(manager2);
    });
  });
});
