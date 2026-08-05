/**
 * Tests for calendarCollapsePreferences utility
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getCalendarCollapsePreferences,
  getCalendarExpandedState,
  setCalendarExpandedState,
  clearCalendarCollapsePreference,
  clearAllCalendarCollapsePreferences,
} from '../calendarCollapsePreferences';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const STORAGE_KEY = '@habit_app:calendar_collapse_preferences';

describe('calendarCollapsePreferences', () => {
  const mockHabitId = 'test-habit-id' as unknown;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCalendarCollapsePreferences', () => {
    it('should return empty object when no preferences stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getCalendarCollapsePreferences();

      expect(result).toEqual({});
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should return parsed preferences when stored', async () => {
      const storedData = {
        'habit-1': { isExpanded: true, updatedAt: 1234567890 },
        'habit-2': { isExpanded: false, updatedAt: 1234567891 },
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(storedData)
      );

      const result = await getCalendarCollapsePreferences();

      expect(result).toEqual(storedData);
    });

    it('should return empty object on parse error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid json');

      const result = await getCalendarCollapsePreferences();

      expect(result).toEqual({});
    });

    it('should return empty object on storage error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      const result = await getCalendarCollapsePreferences();

      expect(result).toEqual({});
    });
  });

  describe('getCalendarExpandedState', () => {
    it('should return null when no preference exists for habit', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getCalendarExpandedState(mockHabitId);

      expect(result).toBeNull();
    });

    it('should return true when habit is saved as expanded', async () => {
      const storedData = {
        [mockHabitId]: { isExpanded: true, updatedAt: Date.now() },
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(storedData)
      );

      const result = await getCalendarExpandedState(mockHabitId);

      expect(result).toBe(true);
    });

    it('should return false when habit is saved as collapsed', async () => {
      const storedData = {
        [mockHabitId]: { isExpanded: false, updatedAt: Date.now() },
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(storedData)
      );

      const result = await getCalendarExpandedState(mockHabitId);

      expect(result).toBe(false);
    });

    it('should return null on error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      const result = await getCalendarExpandedState(mockHabitId);

      expect(result).toBeNull();
    });
  });

  describe('setCalendarExpandedState', () => {
    it('should save expanded state for new habit', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await setCalendarExpandedState(mockHabitId, true);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.stringContaining(mockHabitId)
      );

      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(savedData[mockHabitId].isExpanded).toBe(true);
      expect(savedData[mockHabitId].updatedAt).toBeGreaterThan(0);
    });

    it('should update existing habit preference', async () => {
      const existingData = {
        [mockHabitId]: { isExpanded: true, updatedAt: 1234567890 },
        'other-habit': { isExpanded: false, updatedAt: 1234567890 },
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingData)
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await setCalendarExpandedState(mockHabitId, false);

      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(savedData[mockHabitId].isExpanded).toBe(false);
      expect(savedData['other-habit'].isExpanded).toBe(false); // unchanged
    });

    it('should handle storage error gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      // Should not throw
      await expect(
        setCalendarExpandedState(mockHabitId, true)
      ).resolves.not.toThrow();
    });
  });

  describe('clearCalendarCollapsePreference', () => {
    it('should remove preference for specific habit', async () => {
      const existingData = {
        [mockHabitId]: { isExpanded: true, updatedAt: 1234567890 },
        'other-habit': { isExpanded: false, updatedAt: 1234567890 },
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingData)
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await clearCalendarCollapsePreference(mockHabitId);

      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(savedData[mockHabitId]).toBeUndefined();
      expect(savedData['other-habit']).toBeDefined();
    });

    it('should handle non-existent habit gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await expect(
        clearCalendarCollapsePreference(mockHabitId)
      ).resolves.not.toThrow();
    });

    it('should handle storage error gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      await expect(
        clearCalendarCollapsePreference(mockHabitId)
      ).resolves.not.toThrow();
    });
  });

  describe('clearAllCalendarCollapsePreferences', () => {
    it('should remove all preferences', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      await clearAllCalendarCollapsePreferences();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should handle storage error gracefully', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      await expect(
        clearAllCalendarCollapsePreferences()
      ).resolves.not.toThrow();
    });
  });
});
