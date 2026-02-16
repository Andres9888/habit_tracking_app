/**
 * Widget Data Bridge
 * 
 * Manages data synchronization between React Native app and iOS widget
 * using shared UserDefaults via App Groups.
 * 
 * Flow:
 * 1. App updates widget data whenever habits change
 * 2. Data stored in shared App Group container
 * 3. Widget reads data on timeline refresh (every ~15 min)
 * 
 * @see WIDGET_ROADMAP.md for architecture details
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Shared App Group ID (must match Info.plist entitlements)
 */
export const APP_GROUP_ID = 'group.com.chainday.app.shared';

/**
 * Storage key for widget data
 */
const WIDGET_DATA_KEY = 'widget_data_v1';

/**
 * Widget data structure
 */
export interface WidgetHabit {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  completed: boolean;
  streak: number;
}

export interface WidgetStats {
  completed: number;
  total: number;
  percentage: number;
}

export interface WidgetBestStreak {
  name: string;
  count: number;
}

export interface WidgetData {
  habits: WidgetHabit[];
  todayStats: WidgetStats;
  bestStreak: WidgetBestStreak | null;
  lastUpdated: number;
}

/**
 * Write widget data to shared storage
 * Called whenever habit state changes or app backgrounds
 */
export async function updateWidgetData(data: WidgetData): Promise<void> {
  try {
    // Add timestamp
    const dataWithTimestamp: WidgetData = {
      ...data,
      lastUpdated: Date.now(),
    };

    // Serialize to JSON
    const jsonData = JSON.stringify(dataWithTimestamp);

    // Write to shared storage
    // Note: In production, this would use SharedGroupPreferences
    // For now, using AsyncStorage as placeholder until native module configured
    await AsyncStorage.setItem(WIDGET_DATA_KEY, jsonData);

    console.log('[WidgetDataBridge] Updated widget data:', {
      habitsCount: data.habits.length,
      completionRate: data.todayStats.percentage,
    });

    // Trigger widget reload (iOS 14+)
    // This would call native method: WidgetCenter.reloadAllTimelines()
    if (__DEV__) {
      console.log('[WidgetDataBridge] Would reload widget timeline in production');
    }
  } catch (error) {
    console.error('[WidgetDataBridge] Failed to update widget data:', error);
  }
}

/**
 * Transform Convex habit data to widget format
 * Maps full habit objects to minimal widget representation
 */
export function transformHabitsForWidget(
  habits: Array<{
    _id: string;
    name: string;
    icon?: string;
    color?: string;
    currentStreak?: number;
  }>,
  tracking: Array<{
    habitId: string;
    completed: boolean;
  }>
): WidgetData {
  const now = new Date();
  const todayISO = now.toISOString().split('T')[0];

  // Map habits to widget format
  const widgetHabits: WidgetHabit[] = habits.map((habit) => {
    const trackingRecord = tracking.find((t) => t.habitId === habit._id);
    return {
      id: habit._id,
      name: habit.name,
      icon: habit.icon,
      color: habit.color || '#059669',
      completed: trackingRecord?.completed || false,
      streak: habit.currentStreak || 0,
    };
  });

  // Calculate today's stats
  const completedCount = widgetHabits.filter((h) => h.completed).length;
  const totalCount = widgetHabits.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Find best streak
  const sortedByStreak = [...widgetHabits].sort((a, b) => b.streak - a.streak);
  const bestStreak = sortedByStreak[0]
    ? {
        name: sortedByStreak[0].name,
        count: sortedByStreak[0].streak,
      }
    : null;

  return {
    habits: widgetHabits,
    todayStats: {
      completed: completedCount,
      total: totalCount,
      percentage,
    },
    bestStreak,
    lastUpdated: Date.now(),
  };
}

/**
 * Hook into habit toggle to update widget
 * Call this after any habit completion state change
 * 
 * Example usage:
 * ```typescript
 * await toggleHabit(habitId);
 * await syncWidgetData(); // <-- Add this
 * ```
 */
export async function syncWidgetData(): Promise<void> {
  // TODO: Fetch current habits and tracking from Convex
  // TODO: Transform to widget format
  // TODO: Call updateWidgetData()
  
  console.log('[WidgetDataBridge] syncWidgetData called (stub)');
  
  // Placeholder for demonstration
  if (__DEV__) {
    const mockData: WidgetData = {
      habits: [
        {
          id: '1',
          name: 'Drink Water',
          icon: '💧',
          color: '#059669',
          completed: true,
          streak: 5,
        },
        {
          id: '2',
          name: 'Read',
          icon: '📚',
          color: '#047857',
          completed: true,
          streak: 12,
        },
        {
          id: '3',
          name: 'Exercise',
          icon: '🏃',
          color: '#059669',
          completed: false,
          streak: 3,
        },
      ],
      todayStats: {
        completed: 2,
        total: 3,
        percentage: 67,
      },
      bestStreak: {
        name: 'Read',
        count: 12,
      },
      lastUpdated: Date.now(),
    };

    await updateWidgetData(mockData);
  }
}

/**
 * Read widget data (for debugging/testing)
 */
export async function getWidgetData(): Promise<WidgetData | null> {
  try {
    const jsonData = await AsyncStorage.getItem(WIDGET_DATA_KEY);
    if (!jsonData) return null;
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('[WidgetDataBridge] Failed to read widget data:', error);
    return null;
  }
}
