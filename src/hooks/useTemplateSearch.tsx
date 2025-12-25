import { useMemo, useState, useCallback, useEffect } from 'react';
import { Text } from 'react-native';
import Fuse, { type IFuseOptions, type FuseResultMatch } from 'fuse.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Doc } from '../../convex/_generated/dataModel';

// Fuse.js configuration optimized for habit templates
const FUSE_OPTIONS: IFuseOptions<Doc<'templates'>> = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'description', weight: 0.25 },
    { name: 'category', weight: 0.15 },
    { name: 'scientificReference', weight: 0.1 },
  ],
  threshold: 0.35, // 0 = exact, 1 = match anything
  distance: 100, // Max characters from expected position
  minMatchCharLength: 2, // Min chars before matching
  includeScore: true, // Return match quality score
  includeMatches: true, // Return positions for highlighting
  ignoreLocation: true, // Search entire string
  findAllMatches: true, // Continue after first match
};

const STORAGE_KEY = 'template_recent_searches';
const MAX_RECENT_SEARCHES = 5;

interface SearchResult {
  item: Doc<'templates'>;
  score: number;
  matches?: readonly FuseResultMatch[];
}

interface UseTemplateSearchOptions {
  templates: Doc<'templates'>[];
}

export function useTemplateSearch({ templates }: UseTemplateSearchOptions) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategoryFilter, setSearchCategoryFilter] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from storage
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) {
        try {
          setRecentSearches(JSON.parse(data));
        } catch {
          // Invalid data, reset
          AsyncStorage.removeItem(STORAGE_KEY);
        }
      }
    });
  }, []);

  // Initialize Fuse instance - memoized for performance
  const fuse = useMemo(() => {
    return new Fuse(templates, FUSE_OPTIONS);
  }, [templates]);

  // Perform fuzzy search
  const searchResults = useMemo((): SearchResult[] => {
    const query = searchQuery.trim();
    if (!query) return [];

    let results = fuse.search(query);

    // Apply category filter if set
    if (searchCategoryFilter) {
      results = results.filter((r) => r.item.category === searchCategoryFilter);
    }

    return results.map((r) => ({
      item: r.item,
      score: r.score ?? 1,
      matches: r.matches,
    }));
  }, [searchQuery, fuse, searchCategoryFilter]);

  // Count results per category (for filter pills)
  const categoryResultCounts = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return {};

    const allResults = fuse.search(query);
    const counts: Record<string, number> = {};

    for (const result of allResults) {
      const category = result.item.category;
      counts[category] = (counts[category] || 0) + 1;
    }

    return counts;
  }, [searchQuery, fuse]);

  // Generate suggestions based on current query
  const suggestions = useMemo((): string[] => {
    if (searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    const seen = new Set<string>();
    const results: string[] = [];

    // Find matching template names
    for (const template of templates) {
      const name = template.name;
      const lowerName = name.toLowerCase();

      // Prioritize names that start with query
      if (lowerName.startsWith(query) && !seen.has(name)) {
        seen.add(name);
        results.unshift(name); // Add to front
      } else if (lowerName.includes(query) && !seen.has(name)) {
        seen.add(name);
        results.push(name);
      }

      if (results.length >= 5) break;
    }

    return results.slice(0, 5);
  }, [searchQuery, templates]);

  // Add a search to recent history
  const addRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Remove a specific search from history
  const removeRecentSearch = useCallback((query: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== query);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Clear all recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  // Clear current search state
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchCategoryFilter(null);
  }, []);

  // Highlight matching text segments in search results
  const highlightMatch = useCallback(
    (
      text: string,
      fieldKey: string,
      matches?: readonly FuseResultMatch[]
    ): React.ReactNode => {
      if (!matches || matches.length === 0) return text;

      const fieldMatch = matches.find((m) => m.key === fieldKey);
      if (!fieldMatch || !fieldMatch.indices || fieldMatch.indices.length === 0) {
        return text;
      }

      const parts: React.ReactNode[] = [];
      let lastIndex = 0;

      // Sort indices to ensure proper order
      const sortedIndices = [...fieldMatch.indices].sort((a, b) => a[0] - b[0]);

      for (const [start, end] of sortedIndices) {
        // Add non-matching segment
        if (start > lastIndex) {
          parts.push(text.slice(lastIndex, start));
        }
        // Add highlighted matching segment
        parts.push(
          <Text
            key={`match-${start}`}
            style={{
              backgroundColor: '#FEF3C7',
              fontWeight: '600',
              borderRadius: 2,
            }}
          >
            {text.slice(start, end + 1)}
          </Text>
        );
        lastIndex = end + 1;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
      }

      return <>{parts}</>;
    },
    []
  );

  return {
    // Core search state
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching: searchQuery.trim().length > 0,

    // Category filtering
    searchCategoryFilter,
    setSearchCategoryFilter,
    categoryResultCounts,

    // Recent searches
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,

    // Suggestions
    suggestions,

    // Utilities
    clearSearch,
    highlightMatch,
  };
}
