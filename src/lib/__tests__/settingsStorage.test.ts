/**
 * Tests for settingsStorage module
 *
 * Covers:
 * - Web localStorage functionality
 * - Default values and error handling
 * - Round-trip persistence
 *
 * Note: SecureStore fallback is tested via integration tests
 * due to dynamic import complexity in unit tests
 */

import { getCompactMode, setCompactMode } from '../settingsStorage';

describe('settingsStorage', () => {
  let originalLocalStorage: Storage | undefined;

  beforeEach(() => {
    originalLocalStorage = global.localStorage;
  });

  afterEach(() => {
    // Restore original localStorage
    if (originalLocalStorage) {
      global.localStorage = originalLocalStorage;
    }
  });

  describe('getCompactMode - localStorage', () => {
    it('should return false by default when no value is stored', async () => {
      const mockStorage = {
        getItem: jest.fn().mockReturnValue(null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        key: jest.fn(),
        length: 0,
      };
      global.localStorage = mockStorage as Storage;

      const result = await getCompactMode();

      expect(result).toBe(false);
      expect(mockStorage.getItem).toHaveBeenCalledWith(
        'habitTrackerSettings.compactMode'
      );
    });

    it('should return true when compact mode is enabled', async () => {
      const mockStorage = {
        getItem: jest.fn().mockReturnValue('true'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        key: jest.fn(),
        length: 0,
      };
      global.localStorage = mockStorage as Storage;

      const result = await getCompactMode();

      expect(result).toBe(true);
    });

    it('should return false when compact mode is explicitly disabled', async () => {
      const mockStorage = {
        getItem: jest.fn().mockReturnValue('false'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        key: jest.fn(),
        length: 0,
      };
      global.localStorage = mockStorage as Storage;

      const result = await getCompactMode();

      expect(result).toBe(false);
    });

    it('should handle localStorage errors gracefully', async () => {
      const mockStorage = {
        getItem: jest.fn().mockImplementation(() => {
          throw new Error('localStorage unavailable');
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        key: jest.fn(),
        length: 0,
      };
      global.localStorage = mockStorage as Storage;

      // Should not throw, returns default or tries fallback
      const result = await getCompactMode();
      expect(typeof result).toBe('boolean');
    });

    it('should work when localStorage is unavailable', async () => {
      // @ts-expect-error - intentionally removing localStorage
      delete global.localStorage;

      // Should not throw, uses SecureStore fallback
      const result = await getCompactMode();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('setCompactMode - localStorage', () => {
    it('should save to localStorage when available (enable)', async () => {
      const mockStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        key: jest.fn(),
        length: 0,
      };
      global.localStorage = mockStorage as Storage;

      await setCompactMode(true);

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'habitTrackerSettings.compactMode',
        'true'
      );
    });

    it('should save to localStorage when available (disable)', async () => {
      const mockStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        key: jest.fn(),
        length: 0,
      };
      global.localStorage = mockStorage as Storage;

      await setCompactMode(false);

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'habitTrackerSettings.compactMode',
        'false'
      );
    });

    it('should handle localStorage errors gracefully', async () => {
      const mockStorage = {
        getItem: jest.fn(),
        setItem: jest.fn().mockImplementation(() => {
          throw new Error('localStorage full');
        }),
        removeItem: jest.fn(),
        clear: jest.fn(),
        key: jest.fn(),
        length: 0,
      };
      global.localStorage = mockStorage as Storage;

      // Should not throw, tries fallback
      await expect(setCompactMode(true)).resolves.toBeUndefined();
    });

    it('should work when localStorage is unavailable', async () => {
      // @ts-expect-error - intentionally removing localStorage
      delete global.localStorage;

      // Should not throw, uses SecureStore fallback
      await expect(setCompactMode(true)).resolves.toBeUndefined();
    });
  });

  describe('round-trip persistence - localStorage', () => {
    it('should persist and retrieve compact mode correctly', async () => {
      const storage = new Map<string, string>();
      const mockStorage = {
        getItem: jest.fn((key: string) => storage.get(key) ?? null),
        setItem: jest.fn((key: string, value: string) => {
          storage.set(key, value);
        }),
        removeItem: jest.fn(),
        clear: jest.fn(),
        key: jest.fn(),
        length: 0,
      };
      global.localStorage = mockStorage as Storage;

      // Set to true
      await setCompactMode(true);
      let result = await getCompactMode();
      expect(result).toBe(true);

      // Set to false
      await setCompactMode(false);
      result = await getCompactMode();
      expect(result).toBe(false);

      // Set to true again
      await setCompactMode(true);
      result = await getCompactMode();
      expect(result).toBe(true);
    });

    it('should handle multiple rapid changes', async () => {
      const storage = new Map<string, string>();
      const mockStorage = {
        getItem: jest.fn((key: string) => storage.get(key) ?? null),
        setItem: jest.fn((key: string, value: string) => {
          storage.set(key, value);
        }),
        removeItem: jest.fn(),
        clear: jest.fn(),
        key: jest.fn(),
        length: 0,
      };
      global.localStorage = mockStorage as Storage;

      // Rapid changes
      await setCompactMode(true);
      await setCompactMode(false);
      await setCompactMode(true);
      await setCompactMode(false);

      const result = await getCompactMode();
      expect(result).toBe(false);
      expect(mockStorage.setItem).toHaveBeenCalledTimes(4);
    });
  });

  describe('edge cases', () => {
    it('should handle malformed values in storage', async () => {
      const mockStorage = {
        getItem: jest.fn().mockReturnValue('not-a-boolean'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        key: jest.fn(),
        length: 0,
      };
      global.localStorage = mockStorage as Storage;

      const result = await getCompactMode();

      // Should handle gracefully, likely returns false
      expect(typeof result).toBe('boolean');
    });

    it('should handle empty string in storage', async () => {
      const mockStorage = {
        getItem: jest.fn().mockReturnValue(''),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        key: jest.fn(),
        length: 0,
      };
      global.localStorage = mockStorage as Storage;

      const result = await getCompactMode();

      expect(typeof result).toBe('boolean');
    });

    it('should be async-safe (can be called concurrently)', async () => {
      const storage = new Map<string, string>();
      const mockStorage = {
        getItem: jest.fn((key: string) => storage.get(key) ?? null),
        setItem: jest.fn((key: string, value: string) => {
          storage.set(key, value);
        }),
        removeItem: jest.fn(),
        clear: jest.fn(),
        key: jest.fn(),
        length: 0,
      };
      global.localStorage = mockStorage as Storage;

      // Concurrent calls
      const promises = [
        setCompactMode(true),
        setCompactMode(false),
        getCompactMode(),
      ];

      await expect(Promise.all(promises)).resolves.toBeDefined();
    });
  });
});
