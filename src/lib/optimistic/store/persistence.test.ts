/**
 * Optimistic Store Persistence Tests
 *
 * Tests for AsyncStorage-based persistence of the optimistic store.
 * Covers save, load, clear operations and edge cases.
 *
 * Implements test coverage for:
 * - FR-003: Persist offline queue across app restarts and device reboots
 * - NFR-001: Queue persistence survives app termination and device restart
 * - SC-003: Zero data loss through restarts, reboots, and updates
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Id } from '../../../../convex/_generated/dataModel';
import type { OptimisticOperation, OptimisticStore } from '../types';

import {
  clearOptimisticStore,
  loadOptimisticStore,
  OPTIMISTIC_STORE_STORAGE_KEY,
  OPTIMISTIC_STORE_VERSION,
  saveOptimisticStore,
  type SerializedOptimisticStore,
} from './persistence';

jest.mock('@react-native-async-storage/async-storage');

// Helper to create test habit ID
const createHabitId = (id: string): Id<'habits'> => id as Id<'habits'>;

// Helper to create a valid optimistic store for testing
function createTestStore(
  overrides: Partial<OptimisticStore> = {}
): OptimisticStore {
  return {
    operations: new Map(),
    pendingToggles: new Map(),
    pendingArchives: new Map(),
    pendingReorder: null,
    pendingPauses: new Map(),
    ...overrides,
  };
}

// Helper to create a valid serialized store for testing
function createSerializedStore(
  overrides: Partial<SerializedOptimisticStore> = {}
): SerializedOptimisticStore {
  return {
    version: OPTIMISTIC_STORE_VERSION,
    operations: [],
    pendingToggles: [],
    pendingArchives: [],
    pendingReorder: null,
    pendingPauses: [],
    savedAt: Date.now(),
    ...overrides,
  };
}

describe('optimistic store persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('OPTIMISTIC_STORE_STORAGE_KEY', () => {
    it('has the correct format', () => {
      expect(OPTIMISTIC_STORE_STORAGE_KEY).toBe(
        '@chainday:optimistic_store_v1'
      );
    });
  });

  describe('saveOptimisticStore', () => {
    it('saves store state to AsyncStorage', async () => {
      const store = createTestStore();

      await saveOptimisticStore(store);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        OPTIMISTIC_STORE_STORAGE_KEY,
        expect.any(String)
      );
    });

    it('serializes Maps as arrays of entries', async () => {
      const store = createTestStore({
        pendingToggles: new Map([
          ['habit1:2026-01-30', true],
          ['habit2:2026-01-30', false],
        ]),
      });

      await saveOptimisticStore(store);

      const savedJson = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const parsed = JSON.parse(savedJson);

      expect(parsed.pendingToggles).toEqual([
        ['habit1:2026-01-30', true],
        ['habit2:2026-01-30', false],
      ]);
    });

    it('includes version number', async () => {
      const store = createTestStore();

      await saveOptimisticStore(store);

      const savedJson = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const parsed = JSON.parse(savedJson);

      expect(parsed.version).toBe(OPTIMISTIC_STORE_VERSION);
    });

    it('includes savedAt timestamp', async () => {
      const store = createTestStore();

      const beforeSave = Date.now();
      await saveOptimisticStore(store);
      const afterSave = Date.now();

      const savedJson = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const parsed = JSON.parse(savedJson);

      expect(parsed.savedAt).toBeGreaterThanOrEqual(beforeSave);
      expect(parsed.savedAt).toBeLessThanOrEqual(afterSave);
    });

    it('serializes operations Map correctly', async () => {
      const operation: OptimisticOperation = {
        id: 'op_123',
        type: 'toggle',
        payload: {
          habitId: createHabitId('habit_abc'),
          date: '2026-01-30',
          toCompleted: true,
        },
        state: 'pending',
        startedAt: Date.now(),
      };

      const store = createTestStore({
        operations: new Map([['op_123', operation]]),
      });

      await saveOptimisticStore(store);

      const savedJson = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const parsed = JSON.parse(savedJson);

      expect(parsed.operations).toHaveLength(1);
      expect(parsed.operations[0][0]).toBe('op_123');
      expect(parsed.operations[0][1].id).toBe('op_123');
    });

    it('preserves pendingReorder array', async () => {
      const habitIds = [createHabitId('h1'), createHabitId('h2')];
      const store = createTestStore({
        pendingReorder: habitIds,
      });

      await saveOptimisticStore(store);

      const savedJson = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const parsed = JSON.parse(savedJson);

      expect(parsed.pendingReorder).toEqual(habitIds);
    });

    it('throws error when AsyncStorage fails', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Storage full')
      );

      const store = createTestStore();

      await expect(saveOptimisticStore(store)).rejects.toThrow('Storage full');
    });
  });

  describe('loadOptimisticStore', () => {
    it('returns null when no persisted data exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await loadOptimisticStore();

      expect(result).toBeNull();
    });

    it('returns store with Maps when valid data exists', async () => {
      const serialized = createSerializedStore({
        pendingToggles: [
          ['habit1:2026-01-30', true],
          ['habit2:2026-01-30', false],
        ],
      });

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(serialized)
      );

      const result = await loadOptimisticStore();

      expect(result).not.toBeNull();
      expect(result!.pendingToggles).toBeInstanceOf(Map);
      expect(result!.pendingToggles.get('habit1:2026-01-30')).toBe(true);
      expect(result!.pendingToggles.get('habit2:2026-01-30')).toBe(false);
    });

    it('returns null when data is invalid JSON', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        'not valid json {{'
      );

      const result = await loadOptimisticStore();

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('returns null when data is missing required fields', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      const invalidStore = {
        version: 1,
        // missing other fields
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(invalidStore)
      );

      const result = await loadOptimisticStore();

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid store state')
      );

      consoleWarnSpy.mockRestore();
    });

    it('returns null when version is not a number', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      const invalidStore = {
        version: 'v1', // should be number
        operations: [],
        pendingToggles: [],
        pendingArchives: [],
        pendingReorder: null,
        pendingPauses: [],
        savedAt: Date.now(),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(invalidStore)
      );

      const result = await loadOptimisticStore();

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('returns null when operations is not an array', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      const invalidStore = {
        version: 1,
        operations: 'not an array',
        pendingToggles: [],
        pendingArchives: [],
        pendingReorder: null,
        pendingPauses: [],
        savedAt: Date.now(),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(invalidStore)
      );

      const result = await loadOptimisticStore();

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('returns null when AsyncStorage throws error', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Read error')
      );

      const result = await loadOptimisticStore();

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[optimistic/persistence] Failed to load store state:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it('migrates state from older version', async () => {
      const oldVersionStore = {
        version: 0, // older version
        operations: [],
        pendingToggles: [['habit1:2026-01-30', true]],
        pendingArchives: [],
        pendingReorder: null,
        pendingPauses: [],
        savedAt: Date.now(),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(oldVersionStore)
      );

      const result = await loadOptimisticStore();

      expect(result).not.toBeNull();
      expect(result!.pendingToggles.get('habit1:2026-01-30')).toBe(true);
    });

    it('restores operations correctly', async () => {
      const operation: OptimisticOperation = {
        id: 'op_loaded',
        type: 'toggle',
        payload: {
          habitId: createHabitId('habit_load'),
          date: '2026-01-28',
          toCompleted: true,
        },
        state: 'pending',
        startedAt: Date.now(),
      };

      const serialized = createSerializedStore({
        operations: [['op_loaded', operation]],
      });

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(serialized)
      );

      const result = await loadOptimisticStore();

      expect(result).not.toBeNull();
      expect(result!.operations).toBeInstanceOf(Map);
      expect(result!.operations.get('op_loaded')).toEqual(operation);
    });

    it('restores pendingReorder correctly', async () => {
      const habitIds = [createHabitId('h1'), createHabitId('h2')];
      const serialized = createSerializedStore({
        pendingReorder: habitIds,
      });

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(serialized)
      );

      const result = await loadOptimisticStore();

      expect(result).not.toBeNull();
      expect(result!.pendingReorder).toEqual(habitIds);
    });
  });

  describe('clearOptimisticStore', () => {
    it('removes store state from AsyncStorage', async () => {
      await clearOptimisticStore();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        OPTIMISTIC_STORE_STORAGE_KEY
      );
    });

    it('throws error when AsyncStorage fails', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(
        new Error('Remove failed')
      );

      await expect(clearOptimisticStore()).rejects.toThrow('Remove failed');
    });
  });

  describe('round-trip persistence', () => {
    it('saves and loads store correctly', async () => {
      const operation: OptimisticOperation = {
        id: 'op_roundtrip',
        type: 'toggle',
        payload: {
          habitId: createHabitId('habit_rt'),
          date: '2026-01-30',
          toCompleted: true,
        },
        state: 'pending',
        startedAt: Date.now(),
      };

      const originalStore = createTestStore({
        operations: new Map([['op_roundtrip', operation]]),
        pendingToggles: new Map([['habit_rt:2026-01-30', true]]),
        pendingArchives: new Map([['habit_arch', true]]),
        pendingReorder: [createHabitId('h1'), createHabitId('h2')],
        pendingPauses: new Map([['habit_pause', false]]),
      });

      // Capture what gets saved
      let savedData: string | undefined;
      (AsyncStorage.setItem as jest.Mock).mockImplementation(
        (_key: string, value: string) => {
          savedData = value;
          return Promise.resolve();
        }
      );

      await saveOptimisticStore(originalStore);

      // Return the saved data on load
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(savedData);

      const loadedStore = await loadOptimisticStore();

      expect(loadedStore).not.toBeNull();
      expect(loadedStore!.operations.get('op_roundtrip')).toEqual(operation);
      expect(loadedStore!.pendingToggles.get('habit_rt:2026-01-30')).toBe(true);
      expect(loadedStore!.pendingArchives.get('habit_arch')).toBe(true);
      expect(loadedStore!.pendingReorder).toEqual([
        createHabitId('h1'),
        createHabitId('h2'),
      ]);
      expect(loadedStore!.pendingPauses.get('habit_pause')).toBe(false);
    });

    it('handles empty store', async () => {
      const emptyStore = createTestStore();

      let savedData: string | undefined;
      (AsyncStorage.setItem as jest.Mock).mockImplementation(
        (_key: string, value: string) => {
          savedData = value;
          return Promise.resolve();
        }
      );

      await saveOptimisticStore(emptyStore);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(savedData);

      const loadedStore = await loadOptimisticStore();

      expect(loadedStore).not.toBeNull();
      expect(loadedStore!.operations.size).toBe(0);
      expect(loadedStore!.pendingToggles.size).toBe(0);
      expect(loadedStore!.pendingArchives.size).toBe(0);
      expect(loadedStore!.pendingReorder).toBeNull();
      expect(loadedStore!.pendingPauses.size).toBe(0);
    });

    it('handles store with many operations', async () => {
      const operations = new Map<string, OptimisticOperation>();
      for (let i = 0; i < 100; i++) {
        operations.set(`op_${i}`, {
          id: `op_${i}`,
          type: 'toggle',
          payload: {
            habitId: createHabitId(`habit_${i}`),
            date: '2026-01-30',
            toCompleted: i % 2 === 0,
          },
          state: 'pending',
          startedAt: Date.now() + i,
        });
      }

      const largeStore = createTestStore({ operations });

      let savedData: string | undefined;
      (AsyncStorage.setItem as jest.Mock).mockImplementation(
        (_key: string, value: string) => {
          savedData = value;
          return Promise.resolve();
        }
      );

      await saveOptimisticStore(largeStore);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(savedData);

      const loadedStore = await loadOptimisticStore();

      expect(loadedStore).not.toBeNull();
      expect(loadedStore!.operations.size).toBe(100);
      expect(loadedStore!.operations.get('op_0')).toBeDefined();
      expect(loadedStore!.operations.get('op_99')).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('handles empty string in storage', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('');

      const result = await loadOptimisticStore();

      expect(result).toBeNull();
      consoleWarnSpy.mockRestore();
    });

    it('handles primitive value in storage', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('"just a string"');

      const result = await loadOptimisticStore();

      expect(result).toBeNull();
      consoleWarnSpy.mockRestore();
    });

    it('handles array value in storage (not object)', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[1, 2, 3]');

      const result = await loadOptimisticStore();

      expect(result).toBeNull();
      consoleWarnSpy.mockRestore();
    });

    it('handles pendingReorder as null', async () => {
      const serialized = createSerializedStore({
        pendingReorder: null,
      });

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(serialized)
      );

      const result = await loadOptimisticStore();

      expect(result).not.toBeNull();
      expect(result!.pendingReorder).toBeNull();
    });

    it('rejects invalid pendingReorder type', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      const invalidStore = {
        version: 1,
        operations: [],
        pendingToggles: [],
        pendingArchives: [],
        pendingReorder: 'invalid', // should be array or null
        pendingPauses: [],
        savedAt: Date.now(),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(invalidStore)
      );

      const result = await loadOptimisticStore();

      expect(result).toBeNull();
      consoleWarnSpy.mockRestore();
    });
  });
});
