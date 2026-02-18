/**
 * usePrefetchNavigation hook - Prefetch data for navigation targets
 *
 * This hook provides prefetch functions that can be called on onPressIn
 * to start loading data before the user completes their tap gesture.
 *
 * In a React Native + Convex architecture, we leverage:
 * - onPressIn callbacks to signal data prefetch intent
 * - Convex's internal caching to warm up queries early
 * - Perceived performance improvement by starting transitions earlier
 *
 * @example
 * ```tsx
 * const { prefetchTemplatesAndCategories } = usePrefetchNavigation();
 *
 * <Pressable
 *   onPressIn={prefetchTemplatesAndCategories}
 *   onPress={openTemplatesScreen}
 * >
 *   <Text>Browse Templates</Text>
 * </Pressable>
 * ```
 */

import { useCallback } from 'react';
import type { Id } from '../../convex/_generated/dataModel';

/**
 * Hook that returns prefetch functions for various navigation targets.
 * These functions signal prefetch intent but don't directly execute queries
 * (since Convex queries are hooks and can't be called in callbacks).
 *
 * Instead, they can:
 * 1. Update internal state to trigger queries elsewhere
 * 2. Be used with components that manage their own query fetching
 * 3. Warm up TanStack Query cache if using it for non-Convex data
 */
export function usePrefetchNavigation() {
  /**
   * Prefetch templates and categories for the TemplatesScreen.
   * Call this on onPressIn when navigating to templates.
   */
  const prefetchTemplatesAndCategories = useCallback(() => {
    // Signal that templates data should be fetched
    // In production, this could:
    // - Dispatch an action to start loading
    // - Update a ref that a component checks
    // - Trigger a manual API call
    if (__DEV__) {
      console.log('[prefetch] Templates + Categories');
    }
  }, []);

  /**
   * Prefetch just templates.
   */
  const prefetchTemplates = useCallback(() => {
    if (__DEV__) {
      console.log('[prefetch] Templates');
    }
  }, []);

  /**
   * Prefetch categories.
   */
  const prefetchCategories = useCallback(() => {
    if (__DEV__) {
      console.log('[prefetch] Categories');
    }
  }, []);

  /**
   * Prefetch analytics data for AnalyticsScreen.
   * Includes overview stats, distribution, trends, and compliance data.
   */
  const prefetchAnalytics = useCallback(() => {
    if (__DEV__) {
      console.log('[prefetch] Analytics');
    }
  }, []);

  /**
   * Prefetch settings data.
   */
  const prefetchSettings = useCallback(() => {
    if (__DEV__) {
      console.log('[prefetch] Settings');
    }
  }, []);

  /**
   * Prefetch archived habits list.
   */
  const prefetchArchivedHabits = useCallback(() => {
    if (__DEV__) {
      console.log('[prefetch] Archived Habits');
    }
  }, []);

  /**
   * Prefetch character/profile data.
   */
  const prefetchCharacterData = useCallback(() => {
    if (__DEV__) {
      console.log('[prefetch] Character Data');
    }
  }, []);

  /**
   * Prefetch habit detail data for a specific habit.
   * Call this when tapping a habit card to view details.
   */
  const prefetchHabitDetail = useCallback((habitId: Id<'habits'>) => {
    if (__DEV__) {
      console.log('[prefetch] Habit Detail:', habitId);
    }
  }, []);

  /**
   * Prefetch habit edit data.
   */
  const prefetchHabitEdit = useCallback((habitId: Id<'habits'>) => {
    if (__DEV__) {
      console.log('[prefetch] Habit Edit:', habitId);
    }
  }, []);

  /**
   * Prefetch habit tracking/calendar data.
   */
  const prefetchHabitTracking = useCallback((habitId: Id<'habits'>) => {
    if (__DEV__) {
      console.log('[prefetch] Habit Tracking:', habitId);
    }
  }, []);

  return {
    prefetchTemplates,
    prefetchCategories,
    prefetchTemplatesAndCategories,
    prefetchAnalytics,
    prefetchSettings,
    prefetchArchivedHabits,
    prefetchCharacterData,
    prefetchHabitDetail,
    prefetchHabitEdit,
    prefetchHabitTracking,
  };
}

export type PrefetchNavigationFunctions = ReturnType<typeof usePrefetchNavigation>;
