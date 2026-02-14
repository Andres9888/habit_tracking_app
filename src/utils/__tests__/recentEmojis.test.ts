/**
 * Recent Emojis Utility Tests
 * Story 2.8: Emoji Picker Modal Redesign - AC1
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getRecentEmojis,
  addRecentEmoji,
  clearRecentEmojis,
} from '../recentEmojis';

// Use the mock from __mocks__/@react-native-async-storage/async-storage.js
jest.mock('@react-native-async-storage/async-storage');

const STORAGE_KEY = '@habit_app:recent_emojis';

describe('recentEmojis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRecentEmojis', () => {
    it('should return empty array when no recent emojis stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getRecentEmojis();

      expect(result).toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should return stored emojis', async () => {
      const storedEmojis = ['💪', '🧘', '📚'];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(storedEmojis)
      );

      const result = await getRecentEmojis();

      expect(result).toEqual(storedEmojis);
    });

    it('should limit results to 10 emojis', async () => {
      const storedEmojis = [
        '1️⃣',
        '2️⃣',
        '3️⃣',
        '4️⃣',
        '5️⃣',
        '6️⃣',
        '7️⃣',
        '8️⃣',
        '9️⃣',
        '🔟',
        '💪',
        '🧘',
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(storedEmojis)
      );

      const result = await getRecentEmojis();

      expect(result).toHaveLength(10);
    });

    it('should filter out non-string and empty values from storage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(['💪', 42, null, '   ', '🧘'])
      );

      const result = await getRecentEmojis();

      expect(result).toEqual(['💪', '🧘']);
    });

    it('should handle invalid JSON gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid json');

      const result = await getRecentEmojis();

      expect(result).toEqual([]);
    });

    it('should handle non-array stored value gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ not: 'an array' })
      );

      const result = await getRecentEmojis();

      expect(result).toEqual([]);
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      const result = await getRecentEmojis();

      expect(result).toEqual([]);
    });
  });

  describe('addRecentEmoji', () => {
    it('should add emoji to empty list', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await addRecentEmoji('💪');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(['💪'])
      );
    });

    it('should add emoji to front of list', async () => {
      const existingEmojis = ['🧘', '📚'];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingEmojis)
      );

      await addRecentEmoji('💪');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(['💪', '🧘', '📚'])
      );
    });

    it('should move existing emoji to front when re-selected', async () => {
      const existingEmojis = ['💪', '🧘', '📚'];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingEmojis)
      );

      await addRecentEmoji('📚');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(['📚', '💪', '🧘'])
      );
    });

    it('should maintain max of 10 emojis', async () => {
      const existingEmojis = [
        '1️⃣',
        '2️⃣',
        '3️⃣',
        '4️⃣',
        '5️⃣',
        '6️⃣',
        '7️⃣',
        '8️⃣',
        '9️⃣',
        '🔟',
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingEmojis)
      );

      await addRecentEmoji('💪');

      const expectedEmojis = [
        '💪',
        '1️⃣',
        '2️⃣',
        '3️⃣',
        '4️⃣',
        '5️⃣',
        '6️⃣',
        '7️⃣',
        '8️⃣',
        '9️⃣',
      ];
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(expectedEmojis)
      );
    });

    it('should trim emoji input before saving', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(['🧘'])
      );

      await addRecentEmoji('  💪  ');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(['💪', '🧘'])
      );
    });

    it('should skip saving when emoji input is empty/whitespace', async () => {
      await addRecentEmoji('   ');

      expect(AsyncStorage.getItem).not.toHaveBeenCalled();
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      // Should not throw
      await expect(addRecentEmoji('💪')).resolves.not.toThrow();
    });
  });

  describe('clearRecentEmojis', () => {
    it('should remove recent emojis from storage', async () => {
      await clearRecentEmojis();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      // Should not throw
      await expect(clearRecentEmojis()).resolves.not.toThrow();
    });
  });
});
