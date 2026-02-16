/**
 * Smart Suggestions Hook
 * 
 * Provides smart template suggestions based on user's existing habits
 */

import { useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { getSmartSuggestions, shouldShowSuggestions } from '../utils/habitSuggestions';
import type { Doc } from '../../convex/_generated/dataModel';

export interface UseSmartSuggestionsResult {
  /** Suggested templates based on user's habits */
  suggestions: Doc<'templates'>[];
  /** Whether to show suggestions section (user has 1-4 habits) */
  shouldShow: boolean;
  /** Loading state */
  isLoading: boolean;
}

export function useSmartSuggestions(): UseSmartSuggestionsResult {
  const habits = useQuery(api.habits.list);
  const templates = useQuery(api.templates.list, {});
  
  const isLoading = habits === undefined || templates === undefined;
  
  const result = useMemo(() => {
    if (!habits || !templates) {
      return {
        suggestions: [],
        shouldShow: false,
      };
    }
    
    // Filter out archived habits
    const activeHabits = habits.filter(h => !h.archived);
    
    return {
      suggestions: getSmartSuggestions(activeHabits, templates),
      shouldShow: shouldShowSuggestions(activeHabits.length),
    };
  }, [habits, templates]);
  
  return {
    ...result,
    isLoading,
  };
}
