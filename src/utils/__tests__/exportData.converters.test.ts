/**
 * Export Data Converters Tests
 * Tests for converting habit data to CSV and JSON formats
 */

import { convertToCSV, convertToJSON } from '../exportData/converters';
import type { ExportData } from '../exportData/types';

describe('exportData/converters', () => {
  const mockExportData: ExportData = {
    exportDate: '2024-02-18',
    user: {
      totalHabits: 3,
      averageStrength: 75,
    },
    habits: [
      {
        id: '1',
        name: 'Morning Run',
        icon: '🏃',
        strength: 85.5,
        currentStreak: 10,
        longestStreak: 20,
        createdAt: '2024-01-01T00:00:00Z',
        completions: [
          { date: '2024-02-17', completed: true },
          { date: '2024-02-16', completed: true },
        ],
      },
      {
        id: '2',
        name: 'Read',
        icon: '📚',
        strength: 65,
        currentStreak: 5,
        longestStreak: 15,
        createdAt: '2024-01-15T00:00:00Z',
        completions: [
          { date: '2024-02-17', completed: false },
          { date: '2024-02-16', completed: true },
        ],
      },
    ],
  };

  describe('convertToCSV', () => {
    it('returns CSV string', () => {
      const result = convertToCSV(mockExportData);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('includes CSV headers', () => {
      const result = convertToCSV(mockExportData);
      expect(result).toContain('Habit Name');
      expect(result).toContain('Icon');
      expect(result).toContain('Strength %');
      expect(result).toContain('Current Streak');
      expect(result).toContain('Longest Streak');
      expect(result).toContain('Created Date');
      expect(result).toContain('Total Completions');
    });

    it('includes habit data in CSV rows', () => {
      const result = convertToCSV(mockExportData);
      expect(result).toContain('Morning Run');
      expect(result).toContain('🏃');
      expect(result).toContain('Read');
      expect(result).toContain('📚');
    });

    it('formats strength as percentage without decimals', () => {
      const result = convertToCSV(mockExportData);
      expect(result).toContain('86');
    });

    it('includes habit metadata as comments', () => {
      const result = convertToCSV(mockExportData);
      expect(result).toContain('# Export Date: 2024-02-18');
      expect(result).toContain('# Total Habits: 3');
      expect(result).toContain('# Average Strength: 75%');
    });

    it('counts completed habits correctly', () => {
      const result = convertToCSV(mockExportData);
      expect(result).toContain('2');
      expect(result).toContain('1');
    });

    it('handles empty completions array', () => {
      const dataWithEmpty: ExportData = {
        ...mockExportData,
        habits: [
          {
            id: '1',
            name: 'Empty Habit',
            icon: '✨',
            strength: 50,
            currentStreak: 0,
            longestStreak: 0,
            createdAt: '2024-02-01T00:00:00Z',
            completions: [],
          },
        ],
      };

      const result = convertToCSV(dataWithEmpty);
      expect(result).toContain('Empty Habit');
      expect(result).toContain('0');
    });

    it('handles habits with no icon', () => {
      const dataWithoutIcon: ExportData = {
        ...mockExportData,
        habits: [
          {
            id: '1',
            name: 'No Icon Habit',
            icon: null,
            strength: 60,
            currentStreak: 3,
            longestStreak: 10,
            createdAt: '2024-01-01T00:00:00Z',
            completions: [{ date: '2024-02-17', completed: true }],
          },
        ],
      };

      const result = convertToCSV(dataWithoutIcon);
      expect(result).toContain('No Icon Habit');
      expect(() => convertToCSV(dataWithoutIcon)).not.toThrow();
    });
  });

  describe('convertToJSON', () => {
    it('returns JSON string', () => {
      const result = convertToJSON(mockExportData);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('produces valid JSON', () => {
      const result = convertToJSON(mockExportData);
      expect(() => JSON.parse(result)).not.toThrow();
    });

    it('preserves all data in JSON output', () => {
      const result = convertToJSON(mockExportData);
      const parsed = JSON.parse(result);

      expect(parsed.exportDate).toBe(mockExportData.exportDate);
      expect(parsed.user.totalHabits).toBe(mockExportData.user.totalHabits);
      expect(parsed.user.averageStrength).toBe(
        mockExportData.user.averageStrength
      );
      expect(parsed.habits).toHaveLength(mockExportData.habits.length);
    });

    it('preserves habit details', () => {
      const result = convertToJSON(mockExportData);
      const parsed = JSON.parse(result);

      const firstHabit = parsed.habits[0];
      expect(firstHabit.name).toBe('Morning Run');
      expect(firstHabit.icon).toBe('🏃');
      expect(firstHabit.strength).toBe(85.5);
      expect(firstHabit.currentStreak).toBe(10);
      expect(firstHabit.longestStreak).toBe(20);
    });

    it('preserves completion history', () => {
      const result = convertToJSON(mockExportData);
      const parsed = JSON.parse(result);

      const completions = parsed.habits[0].completions;
      expect(completions).toHaveLength(2);
      expect(completions[0].date).toBe('2024-02-17');
      expect(completions[0].completed).toBe(true);
    });

    it('handles empty habits array', () => {
      const emptyData: ExportData = {
        ...mockExportData,
        habits: [],
      };

      const result = convertToJSON(emptyData);
      const parsed = JSON.parse(result);
      expect(parsed.habits).toEqual([]);
    });

    it('handles complex emoji and special characters', () => {
      const complexData: ExportData = {
        ...mockExportData,
        habits: [
          {
            id: '1',
            name: 'Emoji Test 🎉🌟✨',
            icon: '🎭',
            strength: 75,
            currentStreak: 5,
            longestStreak: 10,
            createdAt: '2024-01-01T00:00:00Z',
            completions: [{ date: '2024-02-17', completed: true }],
          },
        ],
      };

      const result = convertToJSON(complexData);
      const parsed = JSON.parse(result);
      expect(parsed.habits[0].name).toBe('Emoji Test 🎉🌟✨');
      expect(parsed.habits[0].icon).toBe('🎭');
    });

    it('maintains data types in JSON', () => {
      const result = convertToJSON(mockExportData);
      const parsed = JSON.parse(result);

      expect(typeof parsed.user.totalHabits).toBe('number');
      expect(typeof parsed.user.averageStrength).toBe('number');
      expect(typeof parsed.habits[0].strength).toBe('number');
      expect(typeof parsed.habits[0].name).toBe('string');
    });
  });

  describe('format consistency', () => {
    it('CSV and JSON contain same habit names', () => {
      const csv = convertToCSV(mockExportData);
      const json = convertToJSON(mockExportData);
      const parsed = JSON.parse(json);

      parsed.habits.forEach((habit: any) => {
        expect(csv).toContain(habit.name);
      });
    });

    it('both formats represent same data', () => {
      const csv = convertToCSV(mockExportData);
      const json = convertToJSON(mockExportData);
      const parsed = JSON.parse(json);

      expect(csv).toContain(mockExportData.exportDate);
      expect(parsed.exportDate).toBe(mockExportData.exportDate);
    });
  });
});
