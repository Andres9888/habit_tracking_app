/**
 * useFilteredHabits — Filters habits by search query
 * Debounces search for smooth UX
 */

import { useMemo } from 'react';
import { useDebounce } from '../../../../hooks/useDebounce';
import type { Doc } from '../../../../../convex/_generated/dataModel';

export function useFilteredHabits(
  habits: Doc<'habits'>[] | undefined,
  searchQuery: string
) {
  // Debounce search query to reduce re-renders (150ms for smooth UX)
  const debouncedSearchQuery = useDebounce(searchQuery, 150);

  return useMemo(() => {
    if (!habits) return [];
    
    const safeSearchQuery = (debouncedSearchQuery ?? '').trim();
    if (!safeSearchQuery) return habits;

    const query = safeSearchQuery.toLowerCase();
    return habits.filter((habit) => 
      (habit.name || '').toLowerCase().includes(query)
    );
  }, [habits, debouncedSearchQuery]);
}
