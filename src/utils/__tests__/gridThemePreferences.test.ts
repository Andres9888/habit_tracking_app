/**
 * Grid Theme Preferences Utility Tests
 * Progress Section Specification - Phase 8.2: Persist theme to AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getSelectedGridTheme,
  saveSelectedGridTheme,
  clearSelectedGridTheme,
} from '../gridThemePreferences';

// Use the mock from __mocks__/@react-native-async-storage/async-storage.js
jest.mock('@react-native-async-storage/async-storage');

const STORAGE_KEY = '@habit_app:grid_theme_selection';

describe('gridThemePreferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSelectedGridTheme', () => {
    it('should return null when no theme is stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getSelectedGridTheme();

      expect(result).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should return stored "github" theme', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('github');

      const result = await getSelectedGridTheme();

      expect(result).toBe('github');
    });

    it('should return stored "tiles" theme', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('tiles');

      const result = await getSelectedGridTheme();

      expect(result).toBe('tiles');
    });

    it('should return stored "dots" theme', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dots');

      const result = await getSelectedGridTheme();

      expect(result).toBe('dots');
    });

    it('should return stored "pixels" theme', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('pixels');

      const result = await getSelectedGridTheme();

      expect(result).toBe('pixels');
    });

    it('should return null and clear for invalid theme name', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid-theme');

      const result = await getSelectedGridTheme();

      expect(result).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid grid theme stored in AsyncStorage: "invalid-theme". Clearing preference.'
      );

      consoleSpy.mockRestore();
    });

    it('should return null and clear for empty string', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('');

      const result = await getSelectedGridTheme();

      expect(result).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);

      consoleSpy.mockRestore();
    });

    it('should return null and clear for number stored as string', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('123');

      const result = await getSelectedGridTheme();

      expect(result).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);

      consoleSpy.mockRestore();
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      const result = await getSelectedGridTheme();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error reading grid theme preference:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should be case-sensitive (reject GITHUB uppercase)', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('GITHUB');

      const result = await getSelectedGridTheme();

      expect(result).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);

      consoleSpy.mockRestore();
    });
  });

  describe('saveSelectedGridTheme', () => {
    it('should save "github" theme', async () => {
      await saveSelectedGridTheme('github');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, 'github');
    });

    it('should save "tiles" theme', async () => {
      await saveSelectedGridTheme('tiles');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, 'tiles');
    });

    it('should save "dots" theme', async () => {
      await saveSelectedGridTheme('dots');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, 'dots');
    });

    it('should save "pixels" theme', async () => {
      await saveSelectedGridTheme('pixels');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, 'pixels');
    });

    it('should not save invalid theme name', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Type assertion to test invalid input
      await saveSelectedGridTheme('invalid' as 'github');

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid theme name for saveSelectedGridTheme: "invalid"'
      );

      consoleSpy.mockRestore();
    });

    it('should not save empty string', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await saveSelectedGridTheme('' as 'github');

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      // Should not throw
      await expect(saveSelectedGridTheme('github')).resolves.not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error saving grid theme preference:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('clearSelectedGridTheme', () => {
    it('should remove theme from storage', async () => {
      await clearSelectedGridTheme();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      // Should not throw
      await expect(clearSelectedGridTheme()).resolves.not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error clearing grid theme preference:',
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

      // Save dots theme
      await saveSelectedGridTheme('dots');

      // Retrieve it
      const result = await getSelectedGridTheme();

      expect(result).toBe('dots');
    });

    it('should support clear then get workflow', async () => {
      // Set up mock with initial value that gets cleared
      let storedValue: string | null = 'tiles';
      (AsyncStorage.removeItem as jest.Mock).mockImplementation(async () => {
        storedValue = null;
      });
      (AsyncStorage.getItem as jest.Mock).mockImplementation(async () => {
        return storedValue;
      });

      // Clear saved theme
      await clearSelectedGridTheme();

      // Retrieve should return null
      const result = await getSelectedGridTheme();

      expect(result).toBeNull();
    });

    it('should allow switching between all valid themes', async () => {
      const themes = ['github', 'tiles', 'dots', 'pixels'] as const;

      for (const theme of themes) {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(theme);

        const result = await getSelectedGridTheme();
        expect(result).toBe(theme);
      }
    });
  });
});
