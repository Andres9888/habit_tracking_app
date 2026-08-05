/**
 * Queue Storage Tests
 *
 * Tests for AsyncStorage-based persistence of the offline queue.
 * Covers save, load, clear operations and edge cases.
 *
 * Implements test coverage for:
 * - FR-003: Persist offline queue across app restarts and device reboots
 * - NFR-001: Queue persistence survives app termination and device restart
 * - SC-003: Zero data loss through restarts, reboots, and updates
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import type { OfflineQueueState } from '../queue';
import { OFFLINE_QUEUE_VERSION } from '../queue';

import {
  clearQueueState,
  loadQueueState,
  OFFLINE_QUEUE_STORAGE_KEY,
  saveQueueState,
  setQueueStorageScope,
} from './queueStorage';

jest.mock('@react-native-async-storage/async-storage');

// Helper to create valid queue state for testing
function createTestQueueState(
  overrides: Partial<OfflineQueueState> = {}
): OfflineQueueState {
  const now = Date.now();
  return {
    version: OFFLINE_QUEUE_VERSION,
    operations: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('queueStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setQueueStorageScope(null);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('OFFLINE_QUEUE_STORAGE_KEY', () => {
    it('has the correct format', () => {
      expect(OFFLINE_QUEUE_STORAGE_KEY).toBe('@chainday:offline_queue_v1');
    });
  });

  describe('saveQueueState', () => {
    it('saves queue state to AsyncStorage', async () => {
      const state = createTestQueueState();

      await saveQueueState(state);

      // Transaction-safe write: writes to main key (second call after pending)
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        OFFLINE_QUEUE_STORAGE_KEY,
        expect.any(String)
      );
    });

    it('serializes state as JSON', async () => {
      const state = createTestQueueState({
        operations: [
          {
            id: 'op_123',
            type: 'toggleCompletion',
            payload: {
              habitId: 'habit_abc' as never,
              date: '2026-01-30',
              toCompleted: true,
            },
            status: 'pending',
            createdAt: Date.now(),
            retryCount: 0,
          },
        ],
      });

      await saveQueueState(state);

      // Main key is the second setItem call (index 1) due to transaction safety
      const savedJson = (AsyncStorage.setItem as jest.Mock).mock.calls[1][1];
      const parsed = JSON.parse(savedJson);

      expect(parsed.version).toBe(OFFLINE_QUEUE_VERSION);
      expect(parsed.operations).toHaveLength(1);
      expect(parsed.operations[0].id).toBe('op_123');
    });

    it('updates the updatedAt timestamp on save', async () => {
      const originalUpdatedAt = Date.now() - 10000;
      const state = createTestQueueState({ updatedAt: originalUpdatedAt });

      const beforeSave = Date.now();
      await saveQueueState(state);
      const afterSave = Date.now();

      // Main key is the second setItem call (index 1) due to transaction safety
      const savedJson = (AsyncStorage.setItem as jest.Mock).mock.calls[1][1];
      const parsed = JSON.parse(savedJson);

      expect(parsed.updatedAt).toBeGreaterThanOrEqual(beforeSave);
      expect(parsed.updatedAt).toBeLessThanOrEqual(afterSave);
    });

    it('preserves all queue state fields', async () => {
      const state = createTestQueueState({
        lastSyncCompletedAt: Date.now() - 5000,
        operations: [
          {
            id: 'op_456',
            type: 'toggleCompletion',
            payload: {
              habitId: 'habit_xyz' as never,
              date: '2026-01-29',
              toCompleted: false,
            },
            status: 'syncing',
            createdAt: Date.now() - 1000,
            lastAttemptAt: Date.now() - 500,
            retryCount: 2,
            lastError: 'Network error',
            lastErrorCategory: 'network',
          },
        ],
      });

      await saveQueueState(state);

      // Main key is the second setItem call (index 1) due to transaction safety
      const savedJson = (AsyncStorage.setItem as jest.Mock).mock.calls[1][1];
      const parsed = JSON.parse(savedJson);

      expect(parsed.lastSyncCompletedAt).toBeDefined();
      expect(parsed.operations[0].status).toBe('syncing');
      expect(parsed.operations[0].retryCount).toBe(2);
      expect(parsed.operations[0].lastError).toBe('Network error');
    });

    it('throws error when AsyncStorage fails', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Storage full')
      );

      const state = createTestQueueState();

      await expect(saveQueueState(state)).rejects.toThrow('Storage full');
    });

    it('uses a user-scoped storage key when configured', async () => {
      setQueueStorageScope('user_123');

      await saveQueueState(createTestQueueState());

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@chainday:offline_queue_v1:user_123_pending',
        expect.any(String)
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@chainday:offline_queue_v1:user_123',
        expect.any(String)
      );
    });
  });

  describe('loadQueueState', () => {
    it('returns persisted state when valid data exists', async () => {
      const state = createTestQueueState({
        operations: [
          {
            id: 'op_loaded',
            type: 'toggleCompletion',
            payload: {
              habitId: 'habit_load' as never,
              date: '2026-01-28',
              toCompleted: true,
            },
            status: 'pending',
            createdAt: Date.now(),
            retryCount: 0,
          },
        ],
      });

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(state)
      );

      const result = await loadQueueState();

      expect(result.version).toBe(OFFLINE_QUEUE_VERSION);
      expect(result.operations).toHaveLength(1);
      expect(result.operations[0].id).toBe('op_loaded');
    });

    it('returns default state when no persisted data exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await loadQueueState();

      expect(result.version).toBe(OFFLINE_QUEUE_VERSION);
      expect(result.operations).toEqual([]);
      expect(result.createdAt).toBeGreaterThan(0);
      expect(result.updatedAt).toBeGreaterThan(0);
    });

    it('loads from the scoped storage key when configured', async () => {
      setQueueStorageScope('user_456');
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(createTestQueueState())
      );

      await loadQueueState();

      expect(AsyncStorage.getItem).toHaveBeenNthCalledWith(
        1,
        '@chainday:offline_queue_v1:user_456_pending'
      );
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        '@chainday:offline_queue_v1:user_456'
      );
    });

    it('returns default state when data is invalid JSON', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        'not valid json {{'
      );

      const result = await loadQueueState();

      expect(result.version).toBe(OFFLINE_QUEUE_VERSION);
      expect(result.operations).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('returns default state when data is missing required fields', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      const invalidState = {
        version: 1,
        // missing operations, createdAt, updatedAt
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(invalidState)
      );

      const result = await loadQueueState();

      expect(result.version).toBe(OFFLINE_QUEUE_VERSION);
      expect(result.operations).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid queue state')
      );

      consoleWarnSpy.mockRestore();
    });

    it('returns default state when version is not a number', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      const invalidState = {
        version: 'v1', // should be number
        operations: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(invalidState)
      );

      const result = await loadQueueState();

      expect(result.operations).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('returns default state when operations is not an array', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      const invalidState = {
        version: 1,
        operations: 'not an array',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(invalidState)
      );

      const result = await loadQueueState();

      expect(result.operations).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('returns default state when AsyncStorage throws error', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Read error')
      );

      const result = await loadQueueState();

      expect(result.version).toBe(OFFLINE_QUEUE_VERSION);
      expect(result.operations).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[queueStorage] Failed to load queue state:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it('migrates state from older version', async () => {
      const oldVersionState = {
        version: 0, // older version
        operations: [
          {
            id: 'op_old',
            type: 'toggleCompletion',
            payload: {
              habitId: 'habit_migrate' as never,
              date: '2026-01-27',
              toCompleted: true,
            },
            status: 'pending',
            createdAt: Date.now(),
            retryCount: 0,
          },
        ],
        createdAt: Date.now() - 10000,
        updatedAt: Date.now() - 5000,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(oldVersionState)
      );

      const result = await loadQueueState();

      expect(result.version).toBe(OFFLINE_QUEUE_VERSION);
      expect(result.operations).toHaveLength(1);
      expect(result.operations[0].id).toBe('op_old');
    });

    it('preserves operations during migration', async () => {
      const oldVersionState = {
        version: 0,
        operations: [
          {
            id: 'op_migrate_1',
            type: 'toggleCompletion',
            payload: {
              habitId: 'h1' as never,
              date: '2026-01-01',
              toCompleted: true,
            },
            status: 'pending',
            createdAt: 1000,
            retryCount: 0,
          },
          {
            id: 'op_migrate_2',
            type: 'toggleCompletion',
            payload: {
              habitId: 'h2' as never,
              date: '2026-01-02',
              toCompleted: false,
            },
            status: 'failed',
            createdAt: 2000,
            retryCount: 3,
            lastError: 'Server error',
          },
        ],
        createdAt: Date.now() - 10000,
        updatedAt: Date.now() - 5000,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(oldVersionState)
      );

      const result = await loadQueueState();

      expect(result.operations).toHaveLength(2);
      expect(result.operations[0].id).toBe('op_migrate_1');
      expect(result.operations[1].id).toBe('op_migrate_2');
      expect(result.operations[1].retryCount).toBe(3);
    });
  });

  describe('clearQueueState', () => {
    it('removes queue state from AsyncStorage', async () => {
      await clearQueueState();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        OFFLINE_QUEUE_STORAGE_KEY
      );
    });

    it('throws error when AsyncStorage fails', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(
        new Error('Remove failed')
      );

      await expect(clearQueueState()).rejects.toThrow('Remove failed');
    });
  });

  describe('round-trip persistence', () => {
    // Reset all mocks before each round-trip test since previous tests may have
    // set mockRejectedValue which persists across clearAllMocks()
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('saves and loads state correctly', async () => {
      const originalState = createTestQueueState({
        operations: [
          {
            id: 'op_roundtrip',
            type: 'toggleCompletion',
            payload: {
              habitId: 'habit_rt' as never,
              date: '2026-01-30',
              toCompleted: true,
            },
            status: 'pending',
            createdAt: Date.now(),
            retryCount: 0,
          },
        ],
        lastSyncCompletedAt: Date.now() - 1000,
      });

      // Capture what gets saved to main key
      let mainKeyData: string | undefined;
      (AsyncStorage.setItem as jest.Mock).mockImplementation(
        (key: string, value: string) => {
          if (key === OFFLINE_QUEUE_STORAGE_KEY) {
            mainKeyData = value;
          }
          return Promise.resolve();
        }
      );

      await saveQueueState(originalState);

      // Return the saved data on load
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(mainKeyData);

      const loadedState = await loadQueueState();

      expect(loadedState.version).toBe(originalState.version);
      expect(loadedState.operations).toHaveLength(1);
      expect(loadedState.operations[0].id).toBe('op_roundtrip');
      expect(loadedState.operations[0].payload.habitId).toBe('habit_rt');
      expect(loadedState.lastSyncCompletedAt).toBe(
        originalState.lastSyncCompletedAt
      );
    });

    it('handles empty operations array', async () => {
      const emptyState = createTestQueueState({ operations: [] });

      // Capture what gets saved to main key
      let mainKeyData: string | undefined;
      (AsyncStorage.setItem as jest.Mock).mockImplementation(
        (key: string, value: string) => {
          if (key === OFFLINE_QUEUE_STORAGE_KEY) {
            mainKeyData = value;
          }
          return Promise.resolve();
        }
      );

      await saveQueueState(emptyState);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(mainKeyData);

      const loadedState = await loadQueueState();

      expect(loadedState.operations).toEqual([]);
    });

    it('handles large number of operations', async () => {
      const operations = Array.from({ length: 100 }, (_, i) => ({
        id: `op_${i}`,
        type: 'toggleCompletion' as const,
        payload: {
          habitId: `habit_${i}` as never,
          date: '2026-01-30',
          toCompleted: i % 2 === 0,
        },
        status: 'pending' as const,
        createdAt: Date.now() + i,
        retryCount: 0,
      }));

      const largeState = createTestQueueState({ operations });

      // Capture what gets saved to main key
      let mainKeyData: string | undefined;
      (AsyncStorage.setItem as jest.Mock).mockImplementation(
        (key: string, value: string) => {
          if (key === OFFLINE_QUEUE_STORAGE_KEY) {
            mainKeyData = value;
          }
          return Promise.resolve();
        }
      );

      await saveQueueState(largeState);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(mainKeyData);

      const loadedState = await loadQueueState();

      expect(loadedState.operations).toHaveLength(100);
      expect(loadedState.operations[0].id).toBe('op_0');
      expect(loadedState.operations[99].id).toBe('op_99');
    });
  });

  describe('edge cases', () => {
    it('handles null value in storage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await loadQueueState();

      expect(result.operations).toEqual([]);
    });

    it('handles empty string in storage', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('');

      const result = await loadQueueState();

      expect(result.operations).toEqual([]);
      consoleWarnSpy.mockRestore();
    });

    it('handles state with null operations array', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      const stateWithNull = {
        version: 1,
        operations: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(stateWithNull)
      );

      const result = await loadQueueState();

      expect(result.operations).toEqual([]);
      consoleWarnSpy.mockRestore();
    });

    it('handles primitive value in storage', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('"just a string"');

      const result = await loadQueueState();

      expect(result.operations).toEqual([]);
      consoleWarnSpy.mockRestore();
    });

    it('handles array value in storage (not object)', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[1, 2, 3]');

      const result = await loadQueueState();

      expect(result.operations).toEqual([]);
      consoleWarnSpy.mockRestore();
    });
  });
});
