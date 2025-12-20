/**
 * Last Custom Color Utility Tests
 * Color Picker Specification - T3.4: Remember last custom color in AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getLastCustomColor,
  saveLastCustomColor,
  clearLastCustomColor,
} from '../lastCustomColor';

// Use the mock from __mocks__/@react-native-async-storage/async-storage.js
jest.mock('@react-native-async-storage/async-storage');

const STORAGE_KEY = '@habit_app:last_custom_color';

describe('lastCustomColor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLastCustomColor', () => {
    it('should return null when no color is stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getLastCustomColor();

      expect(result).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should return stored color', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('#FF5733');

      const result = await getLastCustomColor();

      expect(result).toBe('#FF5733');
    });

    it('should return null for invalid hex color format', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('not-a-color');

      const result = await getLastCustomColor();

      expect(result).toBeNull();
    });

    it('should return null for short hex format', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('#FFF');

      const result = await getLastCustomColor();

      expect(result).toBeNull();
    });

    it('should handle lowercase hex colors', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('#ff5733');

      const result = await getLastCustomColor();

      expect(result).toBe('#ff5733');
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      const result = await getLastCustomColor();

      expect(result).toBeNull();
    });
  });

  describe('saveLastCustomColor', () => {
    it('should save valid hex color', async () => {
      await saveLastCustomColor('#FF5733');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        '#FF5733'
      );
    });

    it('should convert lowercase to uppercase', async () => {
      await saveLastCustomColor('#ff5733');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        '#FF5733'
      );
    });

    it('should not save invalid hex color format', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await saveLastCustomColor('not-a-color');

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid color format for saveLastCustomColor:',
        'not-a-color'
      );

      consoleSpy.mockRestore();
    });

    it('should not save short hex format', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await saveLastCustomColor('#FFF');

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should not save empty string', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await saveLastCustomColor('');

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      // Should not throw
      await expect(saveLastCustomColor('#FF5733')).resolves.not.toThrow();
    });
  });

  describe('clearLastCustomColor', () => {
    it('should remove color from storage', async () => {
      await clearLastCustomColor();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      // Should not throw
      await expect(clearLastCustomColor()).resolves.not.toThrow();
    });
  });
});
