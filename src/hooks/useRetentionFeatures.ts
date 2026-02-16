/**
 * useRetentionFeatures Hook
 * Coordinates all retention-focused features:
 * - Social proof display
 * - Comeback messaging
 * - Chain nudges
 * - Smart suggestions
 * - Milestone celebrations (14, 60 days)
 */

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface HabitWithStreak {
  _id: string;
  name: string;
  currentStreak?: number;
  category?: string;
  completedToday?: boolean;
}

interface RetentionFeaturesConfig {
  /** List of user's habits */
  habits: HabitWithStreak[];
  /** Whether user completed anything yesterday */
  completedYesterday: boolean;
  /** User's best streak across all habits */
  bestStreak?: number;
  /** Current time (for time-based nudges) */
  currentHour?: number;
  /** Whether user is premium (affects some features) */
  isPremium?: boolean;
}

interface RetentionFeatures {
  /** Show social proof banner */
  shouldShowSocialProof: boolean;
  /** Show comeback message */
  shouldShowComebackMessage: boolean;
  /** Days since last activity */
  daysSinceLastActivity: number;
  /** Show chain nudge */
  shouldShowChainNudge: boolean;
  /** Incomplete habits for nudge */
  incompleteHabits: HabitWithStreak[];
  /** Highest streak habit (for nudge) */
  highestStreakHabit: HabitWithStreak | null;
  /** Show smart suggestions */
  shouldShowSmartSuggestions: boolean;
  /** User's habit categories */
  userCategories: string[];
  /** User's completion rate (0-1) */
  completionRate: number;
  /** Global stats for social proof */
  globalStats: {
    completionsToday: number;
    activeUsers: number;
  };
}

/**
 * Calculate days since last activity
 */
function calculateDaysSinceLastActivity(
  habits: HabitWithStreak[],
  completedYesterday: boolean
): number {
  if (completedYesterday) {
    return 0;
  }
  
  // Check if any habit has a current streak
  const hasActiveStreak = habits.some(h => (h.currentStreak ?? 0) > 0);
  if (hasActiveStreak) {
    return 1; // Missed yesterday
  }
  
  // Default to 1+ days
  return 1;
}

/**
 * Main retention features hook
 */
export function useRetentionFeatures({
  habits = [],
  completedYesterday,
  bestStreak = 0,
  currentHour = new Date().getHours(),
  isPremium = false,
}: RetentionFeaturesConfig): RetentionFeatures {
  const [dismissedNudge, setDismissedNudge] = useState(false);
  
  // Fetch global stats (you'll need to create this query in Convex)
  const globalStats = useQuery(api.analytics.getGlobalStats) ?? {
    activeUsers: 0,
    completionsToday: 0,
  };

  // Calculate incomplete habits
  const incompleteHabits = useMemo(
    () => habits.filter((h) => !h.completedToday),
    [habits]
  );

  // Find highest streak habit
  const highestStreakHabit = useMemo(() => {
    if (incompleteHabits.length === 0) return null;
    
    return [...incompleteHabits].sort(
      (a, b) => (b.currentStreak ?? 0) - (a.currentStreak ?? 0)
    )[0];
  }, [incompleteHabits]);

  // Extract user categories
  const userCategories = useMemo(
    () => [...new Set(habits.map((h) => h.category).filter(Boolean))] as string[],
    [habits]
  );

  // Calculate completion rate
  const completionRate = useMemo(() => {
    if (habits.length === 0) return 0;
    const completedCount = habits.filter((h) => h.completedToday).length;
    return completedCount / habits.length;
  }, [habits]);

  // Days since last activity
  const daysSinceLastActivity = useMemo(
    () => calculateDaysSinceLastActivity(habits, completedYesterday),
    [habits, completedYesterday]
  );

  // Social proof: Show if stats are available and user has habits
  const shouldShowSocialProof = 
    habits.length > 0 && 
    globalStats.completionsToday > 0;

  // Comeback message: Show if missed yesterday
  const shouldShowComebackMessage = 
    daysSinceLastActivity > 0 && 
    habits.length > 0;

  // Chain nudge: Show in evening if incomplete habits with good streak
  const shouldShowChainNudge = 
    !dismissedNudge &&
    currentHour >= 18 && // After 6 PM
    currentHour < 23 && // Before 11 PM
    incompleteHabits.length > 0 &&
    (highestStreakHabit?.currentStreak ?? 0) >= 3;

  // Smart suggestions: Show for users with < 5 habits
  const shouldShowSmartSuggestions = 
    habits.length > 0 && 
    habits.length < 5 &&
    completionRate > 0.5; // Only for engaged users

  return {
    completionRate,
    daysSinceLastActivity,
    globalStats,
    highestStreakHabit,
    incompleteHabits,
    shouldShowChainNudge,
    shouldShowComebackMessage,
    shouldShowSmartSuggestions,
    shouldShowSocialProof,
    userCategories,
  };
}

export type { RetentionFeatures, RetentionFeaturesConfig };
