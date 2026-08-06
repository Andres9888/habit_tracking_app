/**
 * Queue Storage Transaction Safety Tests
 *
 * Tests for crash recovery and transaction-safe persistence.
 * Implements test coverage for Edge Case: "App crash during queue write"
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import type { OfflineQueueState } from '../queue';
import { OFFLINE_QUEUE_VERSION } from '../queue';

import {
  clearQueueState,
  loadQueueState,
  OFFLINE_QUEUE_STORAGE_KEY,
  saveQueueState,
} from './queueStorage';
import { createEnvelope, getPendingKey } from './transactionSafety';

jest.mock('@react-native-async-storage/async-storage');

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

describe('queueStorage - transaction safety', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveQueueState with transaction safety', () => {
    it('writes to pending key first then main key', async () => {
      const state = createTestQueueState();

      await saveQueueState(state);

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      expect(calls.length).toBeGreaterThanOrEqual(2);
      // First call is to pending key
      expect(calls[0][0]).toBe(getPendingKey(OFFLINE_QUEUE_STORAGE_KEY));
      // Second call is to main key
      expect(calls[1][0]).toBe(OFFLINE_QUEUE_STORAGE_KEY);
    });

    it('removes pending key after successful write', async () => {
      const state = createTestQueueState();

      await saveQueueState(state);

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        getPendingKey(OFFLINE_QUEUE_STORAGE_KEY)
      );
    });

    it('includes checksum in pending write', async () => {
      const state = createTestQueueState({
        operations: [
          {
            id: 'op_1',
            type: 'toggleCompletion',
            payload: {
              habitId: 'h1' as never,
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

      const pendingCall = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
      const envelope = JSON.parse(pendingCall[1]);

      expect(envelope.envelopeVersion).toBe(1);
      expect(envelope.checksum).toBeDefined();
      expect(typeof envelope.checksum).toBe('string');
      expect(envelope.timestamp).toBeDefined();
    });
  });

  describe('loadQueueState - crash recovery', () => {
    it('recovers from valid pending write after crash', async () => {
      const pendingState = createTestQueueState({
        operations: [
          {
            id: 'op_recovered',
            type: 'toggleCompletion',
            payload: {
              habitId: 'h_recovered' as never,
              date: '2026-01-30',
              toCompleted: true,
            },
            status: 'pending',
            createdAt: Date.now(),
            retryCount: 0,
          },
        ],
      });

      // Simulate crash: pending key exists, main key has old/different data
      const envelope = createEnvelope(pendingState);
      const pendingKey = getPendingKey(OFFLINE_QUEUE_STORAGE_KEY);

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === pendingKey) {
          return JSON.stringify(envelope);
        }
        if (key === OFFLINE_QUEUE_STORAGE_KEY) {
          return JSON.stringify(createTestQueueState()); // Old empty state
        }
        return null;
      });

      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      const result = await loadQueueState();

      expect(result.operations).toHaveLength(1);
      expect(result.operations[0].id).toBe('op_recovered');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[queueStorage] Recovered from interrupted write'
      );

      consoleWarnSpy.mockRestore();
    });

    it('falls back to main state when pending is corrupted', async () => {
      const mainState = createTestQueueState({
        operations: [
          {
            id: 'op_main',
            type: 'toggleCompletion',
            payload: {
              habitId: 'h_main' as never,
              date: '2026-01-30',
              toCompleted: false,
            },
            status: 'pending',
            createdAt: Date.now(),
            retryCount: 0,
          },
        ],
      });

      // Corrupted pending envelope (wrong checksum)
      const corruptedEnvelope = {
        data: { ...mainState, operations: [{ id: 'op_corrupted' }] },
        checksum: 'cs_wrong',
        timestamp: Date.now(),
        envelopeVersion: 1,
      };

      const pendingKey = getPendingKey(OFFLINE_QUEUE_STORAGE_KEY);

      jest.spyOn(console, 'warn').mockImplementation(() => {});
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === pendingKey) {
          return JSON.stringify(corruptedEnvelope);
        }
        if (key === OFFLINE_QUEUE_STORAGE_KEY) {
          return JSON.stringify(mainState);
        }
        return null;
      });

      const result = await loadQueueState();

      expect(result.operations).toHaveLength(1);
      expect(result.operations[0].id).toBe('op_main');
    });

    it('returns default state when both pending and main are missing', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await loadQueueState();

      expect(result.version).toBe(OFFLINE_QUEUE_VERSION);
      expect(result.operations).toEqual([]);
    });

    it('migrates recovered state from older version', async () => {
      const oldVersionState = {
        version: 0,
        operations: [
          {
            id: 'op_old',
            type: 'toggleCompletion',
            payload: {
              habitId: 'h_old' as never,
              date: '2026-01-30',
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

      const envelope = createEnvelope(oldVersionState);
      const pendingKey = getPendingKey(OFFLINE_QUEUE_STORAGE_KEY);

      jest.spyOn(console, 'warn').mockImplementation(() => {});
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === pendingKey) {
          return JSON.stringify(envelope);
        }
        return null;
      });

      const result = await loadQueueState();

      expect(result.version).toBe(OFFLINE_QUEUE_VERSION);
      expect(result.operations[0].id).toBe('op_old');
    });
  });

  describe('clearQueueState - cleanup', () => {
    it('cleans up transaction artifacts when clearing', async () => {
      await clearQueueState();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        OFFLINE_QUEUE_STORAGE_KEY
      );
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        getPendingKey(OFFLINE_QUEUE_STORAGE_KEY),
        expect.stringContaining('_backup'),
      ]);
    });
  });

  describe('data integrity scenarios', () => {
    it('preserves all operations during transaction', async () => {
      const operations = Array.from({ length: 50 }, (_, i) => ({
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

      const state = createTestQueueState({ operations });

      // Capture main key data
      let mainKeyData: string | undefined;
      (AsyncStorage.setItem as jest.Mock).mockImplementation(
        (key: string, value: string) => {
          if (key === OFFLINE_QUEUE_STORAGE_KEY) {
            mainKeyData = value;
          }
          return Promise.resolve();
        }
      );

      await saveQueueState(state);

      // Verify main key has all operations
      expect(mainKeyData).toBeDefined();
      const savedState = JSON.parse(mainKeyData!);
      expect(savedState.operations).toHaveLength(50);
    });

    it('handles special characters in operation payloads', async () => {
      const state = createTestQueueState({
        operations: [
          {
            id: 'op_special',
            type: 'toggleCompletion',
            payload: {
              habitId: 'habit_with_émojis_🎯' as never,
              date: '2026-01-30',
              toCompleted: true,
            },
            status: 'pending',
            createdAt: Date.now(),
            retryCount: 0,
            lastError: 'Error with "quotes" and \'apostrophes\'',
          },
        ],
      });

      // Capture envelope data
      let envelopeData: string | undefined;
      (AsyncStorage.setItem as jest.Mock).mockImplementation(
        (key: string, value: string) => {
          if (key === getPendingKey(OFFLINE_QUEUE_STORAGE_KEY)) {
            envelopeData = value;
          }
          return Promise.resolve();
        }
      );

      await saveQueueState(state);

      // Verify envelope was created correctly
      expect(envelopeData).toBeDefined();
      const envelope = JSON.parse(envelopeData!);
      expect(envelope.data.operations[0].payload.habitId).toBe(
        'habit_with_émojis_🎯'
      );
    });
  });
});
