/**
 * Week Start Day Preferences Utility Tests
 * Progress Section Specification - Phase 8.3: Week Start Customization
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getWeekStartDay,
  saveWeekStartDay,
  clearWeekStartDay,
} from '../weekStartDayPreferences';

// Use the mock from __mocks__/@react-native-async-storage/async-storage.js
jest.mock('@react-native-async-storage/async-storage');

const STORAGE_KEY = '@habit_app:week_start_day';

describe('weekStartDayPreferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWeekStartDay', () => {
    it('should return null when no day is stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getWeekStartDay();

      expect(result).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should return 0 (Sunday) when stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('0');

      const result = await getWeekStartDay();

      expect(result).toBe(0);
    });

    it('should return 1 (Monday) when stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('1');

      const result = await getWeekStartDay();

      expect(result).toBe(1);
    });

    it('should return 2 (Tuesday) when stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('2');

      const result = await getWeekStartDay();

      expect(result).toBe(2);
    });

    it('should return 3 (Wednesday) when stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('3');

      const result = await getWeekStartDay();

      expect(result).toBe(3);
    });

    it('should return 4 (Thursday) when stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('4');

      const result = await getWeekStartDay();

      expect(result).toBe(4);
    });

    it('should return 5 (Friday) when stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5');

      const result = await getWeekStartDay();

      expect(result).toBe(5);
    });

    it('should return 6 (Saturday) when stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('6');

      const result = await getWeekStartDay();

      expect(result).toBe(6);
    });

    it('should return null and clear for invalid number (negative)', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('-1');

      const result = await getWeekStartDay();

      expect(result).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid week start day stored in AsyncStorage: "-1". Clearing preference.'
      );

      consoleSpy.mockRestore();
    });

    it('should return null and clear for invalid number (too high)', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('7');

      const result = await getWeekStartDay();

      expect(result).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);

      consoleSpy.mockRestore();
    });

    it('should return null and clear for non-numeric string', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('monday');

      const result = await getWeekStartDay();

      expect(result).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);

      consoleSpy.mockRestore();
    });

    it('should return null and clear for empty string', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('');

      const result = await getWeekStartDay();

      expect(result).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);

      consoleSpy.mockRestore();
    });

    it('should return null and clear for floating point number', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('1.5');

      const result = await getWeekStartDay();

      expect(result).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);

      consoleSpy.mockRestore();
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      const result = await getWeekStartDay();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error reading week start day preference:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('saveWeekStartDay', () => {
    it('should save 0 (Sunday)', async () => {
      await saveWeekStartDay(0);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, '0');
    });

    it('should save 1 (Monday)', async () => {
      await saveWeekStartDay(1);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, '1');
    });

    it('should save 2 (Tuesday)', async () => {
      await saveWeekStartDay(2);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, '2');
    });

    it('should save 3 (Wednesday)', async () => {
      await saveWeekStartDay(3);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, '3');
    });

    it('should save 4 (Thursday)', async () => {
      await saveWeekStartDay(4);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, '4');
    });

    it('should save 5 (Friday)', async () => {
      await saveWeekStartDay(5);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, '5');
    });

    it('should save 6 (Saturday)', async () => {
      await saveWeekStartDay(6);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, '6');
    });

    it('should not save invalid day (negative)', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Type assertion to test invalid input
      await saveWeekStartDay(-1 as 0);

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid week start day for saveWeekStartDay: "-1"'
      );

      consoleSpy.mockRestore();
    });

    it('should not save invalid day (too high)', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await saveWeekStartDay(7 as 0);

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      // Should not throw
      await expect(saveWeekStartDay(1)).resolves.not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error saving week start day preference:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('clearWeekStartDay', () => {
    it('should remove day from storage', async () => {
      await clearWeekStartDay();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      // Should not throw
      await expect(clearWeekStartDay()).resolves.not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error clearing week start day preference:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('integration scenarios', () => {
    it('should support save then get workflow', async () => {
      // Set up mock to return what was saved
      let storedValue: string | null = null;
      (AsyncStorage.setItem as jest.Mock).mockImplementation(
        async (_key: string, value: string) => {
          storedValue = value;
        }
      );
      (AsyncStorage.getItem as jest.Mock).mockImplementation(async () => {
        return storedValue;
      });

      // Save Monday
      await saveWeekStartDay(1);

      // Retrieve it
      const result = await getWeekStartDay();

      expect(result).toBe(1);
    });

    it('should support clear then get workflow', async () => {
      // Set up mock with initial value that gets cleared
      let storedValue: string | null = '1';
      (AsyncStorage.removeItem as jest.Mock).mockImplementation(async () => {
        storedValue = null;
      });
      (AsyncStorage.getItem as jest.Mock).mockImplementation(async () => {
        return storedValue;
      });

      // Clear saved day
      await clearWeekStartDay();

      // Retrieve should return null
      const result = await getWeekStartDay();

      expect(result).toBeNull();
    });

    it('should allow switching between all valid days', async () => {
      const days = [0, 1, 2, 3, 4, 5, 6] as const;

      for (const day of days) {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(String(day));

        const result = await getWeekStartDay();
        expect(result).toBe(day);
      }
    });

    it('should persist across multiple save operations', async () => {
      let storedValue: string | null = null;
      (AsyncStorage.setItem as jest.Mock).mockImplementation(
        async (_key: string, value: string) => {
          storedValue = value;
        }
      );
      (AsyncStorage.getItem as jest.Mock).mockImplementation(async () => {
        return storedValue;
      });

      // Save Sunday
      await saveWeekStartDay(0);
      expect(await getWeekStartDay()).toBe(0);

      // Update to Monday
      await saveWeekStartDay(1);
      expect(await getWeekStartDay()).toBe(1);

      // Update to Saturday
      await saveWeekStartDay(6);
      expect(await getWeekStartDay()).toBe(6);
    });
  });
});
