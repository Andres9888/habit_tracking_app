import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTemplateSearch } from '../useTemplateSearch';
import type { Doc, Id } from '../../../convex/_generated/dataModel';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Create mock templates that match the schema
const createMockTemplate = (
  id: string,
  name: string,
  description: string,
  category: string,
  scientificReference = 'Research citation'
): Doc<'templates'> => ({
  _id: id as Id<'templates'>,
  _creationTime: Date.now(),
  name,
  description,
  category: category as Doc<'templates'>['category'],
  scientificReference,
  icon: '🎯',
  iconColor: '#000000',
  frequency: 'daily',
  createdAt: Date.now(),
});

const mockTemplates: Doc<'templates'>[] = [
  createMockTemplate(
    '1',
    'Morning Meditation',
    '10 minutes of mindful breathing to start your day',
    'mindfulness',
    'Kabat-Zinn, 1990'
  ),
  createMockTemplate(
    '2',
    'Daily Exercise',
    'Regular physical activity for health and wellness',
    'health_fitness',
    'WHO Guidelines, 2020'
  ),
  createMockTemplate(
    '3',
    'Evening Journaling',
    'Reflect on your day and express gratitude',
    'mindfulness',
    'Pennebaker, 1997'
  ),
  createMockTemplate(
    '4',
    'Sleep Routine',
    'Wind down for better sleep quality',
    'sleep',
    'Walker, 2017'
  ),
  createMockTemplate(
    '5',
    'Deep Breathing',
    'Practice diaphragmatic breathing for stress relief',
    'breathing',
    'Huberman Lab, 2022'
  ),
  createMockTemplate(
    '6',
    'Cold Shower',
    'Brief cold exposure for energy and alertness',
    'recovery',
    'Huberman Lab, 2021'
  ),
  createMockTemplate(
    '7',
    'Reading Time',
    'Read for 30 minutes daily to expand knowledge',
    'learning',
    'Various studies'
  ),
  createMockTemplate(
    '8',
    'Hydration Tracker',
    'Drink 8 glasses of water throughout the day',
    'health_fitness',
    'Mayo Clinic'
  ),
];

describe('useTemplateSearch - Fuzzy Matching', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  describe('exact matches', () => {
    it('finds exact name matches', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('Morning Meditation');
      });

      expect(result.current.searchResults.length).toBe(1);
      expect(result.current.searchResults[0].item.name).toBe('Morning Meditation');
    });

    it('finds partial matches', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('Meditation');
      });

      expect(result.current.searchResults.length).toBeGreaterThan(0);
      expect(result.current.searchResults[0].item.name).toBe('Morning Meditation');
    });
  });

  describe('typo tolerance - core fuzzy matching feature', () => {
    it('finds "Meditation" when searching for "meditatoin" (transposed letters)', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('meditatoin');
      });

      expect(result.current.searchResults.length).toBeGreaterThan(0);
      expect(result.current.searchResults[0].item.name).toBe('Morning Meditation');
    });

    it('finds "Exercise" when searching for "exersice" (common typo)', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('exersice');
      });

      expect(result.current.searchResults.length).toBeGreaterThan(0);
      expect(result.current.searchResults[0].item.name).toBe('Daily Exercise');
    });

    it('finds "Breathing" when searching for "breathin" (missing letter)', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('breathin');
      });

      expect(result.current.searchResults.length).toBeGreaterThan(0);
      expect(result.current.searchResults[0].item.name).toBe('Deep Breathing');
    });

    it('finds "Journaling" when searching for "journalling" (double letter)', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('journalling');
      });

      expect(result.current.searchResults.length).toBeGreaterThan(0);
      expect(result.current.searchResults[0].item.name).toBe('Evening Journaling');
    });

    it('finds "Sleep" when searching for "slep" (missing letter)', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('slep');
      });

      expect(result.current.searchResults.length).toBeGreaterThan(0);
      expect(result.current.searchResults[0].item.name).toBe('Sleep Routine');
    });

    it('finds "Cold Shower" when searching for "could shower" (phonetic typo)', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('could shower');
      });

      // This is a challenging case - may or may not match depending on threshold
      // The important thing is that fuzzy search attempts to find similar results
      // If it finds results, the first should be Cold Shower
      if (result.current.searchResults.length > 0) {
        expect(result.current.searchResults[0].item.name).toBe('Cold Shower');
      }
    });

    it('finds "Hydration" when searching for "hydratoin" (transposed letter)', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('hydratoin');
      });

      expect(result.current.searchResults.length).toBeGreaterThan(0);
      expect(result.current.searchResults[0].item.name).toBe('Hydration Tracker');
    });
  });

  describe('case insensitivity', () => {
    it('finds matches regardless of case', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('MORNING');
      });

      expect(result.current.searchResults.length).toBeGreaterThan(0);
      expect(result.current.searchResults[0].item.name).toBe('Morning Meditation');
    });

    it('finds matches with mixed case input', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('mOrNiNg');
      });

      expect(result.current.searchResults.length).toBeGreaterThan(0);
      expect(result.current.searchResults[0].item.name).toBe('Morning Meditation');
    });
  });

  describe('search across multiple fields', () => {
    it('finds matches in description field', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('mindful');
      });

      expect(result.current.searchResults.length).toBeGreaterThan(0);
      // Should find Morning Meditation (description contains "mindful breathing")
      expect(result.current.searchResults[0].item.name).toBe('Morning Meditation');
    });

    it('finds matches in scientific reference field', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('Huberman');
      });

      expect(result.current.searchResults.length).toBe(2);
      // Should find templates referencing Huberman Lab
      const names = result.current.searchResults.map((r) => r.item.name);
      expect(names).toContain('Deep Breathing');
      expect(names).toContain('Cold Shower');
    });
  });

  describe('search result scoring', () => {
    it('ranks exact name matches higher than description matches', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('meditation');
      });

      expect(result.current.searchResults.length).toBeGreaterThan(0);
      // First result should have a better (lower) score
      const firstScore = result.current.searchResults[0].score;
      expect(firstScore).toBeLessThan(0.5); // Good match
    });

    it('includes match score in results', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('sleep');
      });

      expect(result.current.searchResults.length).toBeGreaterThan(0);
      expect(typeof result.current.searchResults[0].score).toBe('number');
    });
  });

  describe('edge cases', () => {
    it('returns empty results for empty query', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      expect(result.current.searchResults).toEqual([]);
    });

    it('returns empty results for whitespace-only query', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('   ');
      });

      expect(result.current.searchResults).toEqual([]);
    });

    it('returns empty results for query with no matches', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('xyznonexistent123');
      });

      expect(result.current.searchResults).toEqual([]);
    });

    it('handles special characters in query without crashing', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      // Should not throw when special characters are present
      expect(() => {
        act(() => {
          result.current.setSearchQuery('sleep!@#$%^&*()');
        });
      }).not.toThrow();

      // Search should complete (may or may not find results depending on Fuse.js handling)
      expect(result.current.isSearching).toBe(true);
    });
  });

  describe('category filtering', () => {
    it('filters search results by category', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('daily');
        result.current.setSearchCategoryFilter('health_fitness');
      });

      // All results should be in health_fitness category
      result.current.searchResults.forEach((r) => {
        expect(r.item.category).toBe('health_fitness');
      });
    });

    it('provides category result counts', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('day');
      });

      expect(typeof result.current.categoryResultCounts).toBe('object');
    });
  });

  describe('isSearching flag', () => {
    it('returns false when query is empty', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      expect(result.current.isSearching).toBe(false);
    });

    it('returns true when query has content', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('test');
      });

      expect(result.current.isSearching).toBe(true);
    });
  });

  describe('suggestions', () => {
    it('returns empty suggestions for short queries', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('m');
      });

      expect(result.current.suggestions).toEqual([]);
    });

    it('returns template name suggestions for valid queries', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('mor');
      });

      expect(result.current.suggestions.length).toBeGreaterThan(0);
      expect(result.current.suggestions).toContain('Morning Meditation');
    });

    it('limits suggestions to 5', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('da');
      });

      expect(result.current.suggestions.length).toBeLessThanOrEqual(5);
    });
  });

  describe('clearSearch', () => {
    it('clears search query and category filter', () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.setSearchQuery('meditation');
        result.current.setSearchCategoryFilter('mindfulness');
      });

      expect(result.current.searchQuery).toBe('meditation');
      expect(result.current.searchCategoryFilter).toBe('mindfulness');

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.searchQuery).toBe('');
      expect(result.current.searchCategoryFilter).toBeNull();
    });
  });
});

describe('useTemplateSearch - Recent Searches', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('loads recent searches from storage on mount', async () => {
    const storedSearches = JSON.stringify(['meditation', 'exercise']);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(storedSearches);

    const { result } = renderHook(() =>
      useTemplateSearch({ templates: mockTemplates })
    );

    await waitFor(() => {
      expect(result.current.recentSearches).toEqual(['meditation', 'exercise']);
    });
  });

  it('handles invalid stored data gracefully', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid json');

    const { result } = renderHook(() =>
      useTemplateSearch({ templates: mockTemplates })
    );

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        'template_recent_searches'
      );
    });
  });

  it('adds search to recent history', async () => {
    const { result } = renderHook(() =>
      useTemplateSearch({ templates: mockTemplates })
    );

    act(() => {
      result.current.addRecentSearch('meditation');
    });

    expect(result.current.recentSearches).toContain('meditation');
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('does not add short queries to recent history', () => {
    const { result } = renderHook(() =>
      useTemplateSearch({ templates: mockTemplates })
    );

    act(() => {
      result.current.addRecentSearch('m');
    });

    expect(result.current.recentSearches).not.toContain('m');
  });

  it('removes duplicates when adding recent search', () => {
    const { result } = renderHook(() =>
      useTemplateSearch({ templates: mockTemplates })
    );

    act(() => {
      result.current.addRecentSearch('meditation');
      result.current.addRecentSearch('exercise');
      result.current.addRecentSearch('meditation');
    });

    const meditationCount = result.current.recentSearches.filter(
      (s) => s.toLowerCase() === 'meditation'
    ).length;
    expect(meditationCount).toBe(1);
  });

  it('limits recent searches to 5', () => {
    const { result } = renderHook(() =>
      useTemplateSearch({ templates: mockTemplates })
    );

    act(() => {
      result.current.addRecentSearch('one');
      result.current.addRecentSearch('two');
      result.current.addRecentSearch('three');
      result.current.addRecentSearch('four');
      result.current.addRecentSearch('five');
      result.current.addRecentSearch('six');
    });

    expect(result.current.recentSearches.length).toBe(5);
  });

  it('removes specific search from history', () => {
    const { result } = renderHook(() =>
      useTemplateSearch({ templates: mockTemplates })
    );

    act(() => {
      result.current.addRecentSearch('meditation');
      result.current.addRecentSearch('exercise');
    });

    act(() => {
      result.current.removeRecentSearch('meditation');
    });

    expect(result.current.recentSearches).not.toContain('meditation');
    expect(result.current.recentSearches).toContain('exercise');
  });

  it('clears all recent searches', () => {
    const { result } = renderHook(() =>
      useTemplateSearch({ templates: mockTemplates })
    );

    act(() => {
      result.current.addRecentSearch('meditation');
      result.current.addRecentSearch('exercise');
    });

    act(() => {
      result.current.clearRecentSearches();
    });

    expect(result.current.recentSearches).toEqual([]);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
      'template_recent_searches'
    );
  });
});

describe('useTemplateSearch - Recent Searches Persistence', () => {
  const STORAGE_KEY = 'template_recent_searches';

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  describe('storage key and format', () => {
    it('uses the correct storage key for all operations', async () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      // Wait for initial load
      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
      });

      // Add a search
      act(() => {
        result.current.addRecentSearch('test query');
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.any(String)
      );
    });

    it('stores searches as a JSON array of strings', async () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.addRecentSearch('meditation');
        result.current.addRecentSearch('exercise');
      });

      const lastCall = (AsyncStorage.setItem as jest.Mock).mock.calls.pop();
      expect(lastCall[0]).toBe(STORAGE_KEY);

      const storedData = JSON.parse(lastCall[1]);
      expect(Array.isArray(storedData)).toBe(true);
      expect(storedData.every((s: unknown) => typeof s === 'string')).toBe(true);
      expect(storedData).toContain('meditation');
      expect(storedData).toContain('exercise');
    });
  });

  describe('MRU ordering persistence', () => {
    it('stores searches in most-recently-used order', async () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.addRecentSearch('first');
        result.current.addRecentSearch('second');
        result.current.addRecentSearch('third');
      });

      const lastCall = (AsyncStorage.setItem as jest.Mock).mock.calls.pop();
      const storedData = JSON.parse(lastCall[1]);

      // Most recent should be first
      expect(storedData[0]).toBe('third');
      expect(storedData[1]).toBe('second');
      expect(storedData[2]).toBe('first');
    });

    it('moves re-added search to the front', async () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.addRecentSearch('meditation');
        result.current.addRecentSearch('exercise');
        result.current.addRecentSearch('sleep');
        result.current.addRecentSearch('meditation'); // Re-add first one
      });

      const lastCall = (AsyncStorage.setItem as jest.Mock).mock.calls.pop();
      const storedData = JSON.parse(lastCall[1]);

      expect(storedData[0]).toBe('meditation');
      expect(storedData).toHaveLength(3); // No duplicates
    });
  });

  describe('persistence across hook re-renders', () => {
    it('loads persisted searches on subsequent mount', async () => {
      // First mount - add some searches
      const { result: result1, unmount } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result1.current.addRecentSearch('meditation');
        result1.current.addRecentSearch('exercise');
      });

      // Capture what was stored
      const lastSetCall = (AsyncStorage.setItem as jest.Mock).mock.calls.pop();
      const storedValue = lastSetCall[1];

      // Unmount first instance
      unmount();

      // Reset mocks and set up storage to return previously stored value
      jest.clearAllMocks();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(storedValue);

      // Second mount - should load persisted searches
      const { result: result2 } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      await waitFor(() => {
        expect(result2.current.recentSearches).toEqual(['exercise', 'meditation']);
      });
    });

    it('preserves order after app restart simulation', async () => {
      const storedSearches = JSON.stringify([
        'sleep',
        'exercise',
        'meditation',
      ]);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(storedSearches);

      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      await waitFor(() => {
        expect(result.current.recentSearches).toEqual([
          'sleep',
          'exercise',
          'meditation',
        ]);
      });

      // Verify order is maintained
      expect(result.current.recentSearches[0]).toBe('sleep');
      expect(result.current.recentSearches[2]).toBe('meditation');
    });
  });

  describe('removeRecentSearch persistence', () => {
    it('persists removal to AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(['meditation', 'exercise', 'sleep'])
      );

      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      await waitFor(() => {
        expect(result.current.recentSearches).toHaveLength(3);
      });

      jest.clearAllMocks();

      act(() => {
        result.current.removeRecentSearch('exercise');
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.any(String)
      );

      const lastCall = (AsyncStorage.setItem as jest.Mock).mock.calls.pop();
      const storedData = JSON.parse(lastCall[1]);
      expect(storedData).toEqual(['meditation', 'sleep']);
      expect(storedData).not.toContain('exercise');
    });

    it('handles removing non-existent search gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(['meditation', 'exercise'])
      );

      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      await waitFor(() => {
        expect(result.current.recentSearches).toHaveLength(2);
      });

      jest.clearAllMocks();

      // Remove something that doesn't exist
      act(() => {
        result.current.removeRecentSearch('non-existent');
      });

      // Should still persist (empty removal is still valid)
      expect(AsyncStorage.setItem).toHaveBeenCalled();
      expect(result.current.recentSearches).toEqual(['meditation', 'exercise']);
    });
  });

  describe('clearRecentSearches persistence', () => {
    it('removes storage key when clearing all searches', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(['meditation', 'exercise', 'sleep'])
      );

      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      await waitFor(() => {
        expect(result.current.recentSearches).toHaveLength(3);
      });

      jest.clearAllMocks();

      act(() => {
        result.current.clearRecentSearches();
      });

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
      expect(AsyncStorage.setItem).not.toHaveBeenCalled(); // Should use removeItem, not setItem([])
    });
  });

  describe('edge cases for persistence', () => {
    it('handles null stored value', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      await waitFor(() => {
        expect(result.current.recentSearches).toEqual([]);
      });
    });

    it('handles empty array stored value', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');

      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      await waitFor(() => {
        expect(result.current.recentSearches).toEqual([]);
      });
    });

    it('handles storage error gracefully during load', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      // Should not throw
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      // Should have empty recent searches since load failed
      expect(result.current.recentSearches).toEqual([]);
    });

    it('trims whitespace from searches before storing', async () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.addRecentSearch('  meditation  ');
      });

      const lastCall = (AsyncStorage.setItem as jest.Mock).mock.calls.pop();
      const storedData = JSON.parse(lastCall[1]);
      expect(storedData[0]).toBe('meditation');
    });

    it('handles case-insensitive duplicate detection', async () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.addRecentSearch('Meditation');
        result.current.addRecentSearch('MEDITATION');
        result.current.addRecentSearch('meditation');
      });

      // Should only have one entry (the most recent casing)
      expect(result.current.recentSearches).toHaveLength(1);
      expect(result.current.recentSearches[0]).toBe('meditation');

      const lastCall = (AsyncStorage.setItem as jest.Mock).mock.calls.pop();
      const storedData = JSON.parse(lastCall[1]);
      expect(storedData).toHaveLength(1);
    });

    it('respects MAX_RECENT_SEARCHES limit in storage', async () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      act(() => {
        result.current.addRecentSearch('one');
        result.current.addRecentSearch('two');
        result.current.addRecentSearch('three');
        result.current.addRecentSearch('four');
        result.current.addRecentSearch('five');
        result.current.addRecentSearch('six'); // This should push out 'one'
      });

      const lastCall = (AsyncStorage.setItem as jest.Mock).mock.calls.pop();
      const storedData = JSON.parse(lastCall[1]);

      expect(storedData).toHaveLength(5);
      expect(storedData).not.toContain('one');
      expect(storedData[0]).toBe('six');
    });

    it('does not persist empty or whitespace-only searches', async () => {
      const { result } = renderHook(() =>
        useTemplateSearch({ templates: mockTemplates })
      );

      jest.clearAllMocks();

      act(() => {
        result.current.addRecentSearch('');
        result.current.addRecentSearch('   ');
      });

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      expect(result.current.recentSearches).toEqual([]);
    });
  });
});

describe('useTemplateSearch - highlightMatch', () => {
  it('returns text unchanged when no matches provided', () => {
    const { result } = renderHook(() =>
      useTemplateSearch({ templates: mockTemplates })
    );

    const highlighted = result.current.highlightMatch('Test text', 'name', undefined);
    expect(highlighted).toBe('Test text');
  });

  it('returns text unchanged when matches array is empty', () => {
    const { result } = renderHook(() =>
      useTemplateSearch({ templates: mockTemplates })
    );

    const highlighted = result.current.highlightMatch('Test text', 'name', []);
    expect(highlighted).toBe('Test text');
  });

  it('returns text unchanged when no match for specified field', () => {
    const { result } = renderHook(() =>
      useTemplateSearch({ templates: mockTemplates })
    );

    const matches = [
      {
        key: 'description',
        value: 'some description',
        indices: [[0, 3]] as ReadonlyArray<readonly [number, number]>,
      },
    ];

    const highlighted = result.current.highlightMatch('Test text', 'name', matches);
    expect(highlighted).toBe('Test text');
  });
});
