/**
 * HealthKit Sync Engine - Auto-complete habits based on health data
 * Created by: Sonnet (Claude Sonnet 4.5)
 */

import type { HealthType, HealthHabitMapping, SyncResult } from './types';
import { getStepsToday, getSleepHoursToday, getWorkoutsToday } from './index';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_SYNC_KEY = 'healthkit_last_sync';
const SYNC_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Detect health type from habit name
 */
export function detectHealthType(habitName: string): HealthType | null {
  const name = habitName.toLowerCase();
  
  if (/\b(step|walk|10k)\b/i.test(name)) {
    return 'steps';
  }
  if (/\b(sleep|rest)\b/i.test(name)) {
    return 'sleep';
  }
  if (/\b(exercise|workout|gym|run|bike|swim)\b/i.test(name)) {
    return 'workout';
  }
  
  return null;
}

/**
 * Extract threshold from habit name
 * Examples:
 *  "10K steps" → 10000
 *  "Sleep 8 hours" → 8
 *  "30 min workout" → 1800 (seconds)
 */
export function extractThreshold(habitName: string, healthType: HealthType): number {
  const name = habitName.toLowerCase();
  
  switch (healthType) {
    case 'steps': {
      // Match patterns like "10k", "10000", "5k steps"
      const match = name.match(/(\d+)k?\s*(step|walk)/i);
      if (match) {
        const value = parseInt(match[1], 10);
        return name.includes('k') ? value * 1000 : value;
      }
      return 10000; // Default 10K steps
    }
    
    case 'sleep': {
      // Match patterns like "8 hours", "sleep 7h"
      const match = name.match(/(\d+)\s*(hour|hr|h)\b/i);
      if (match) {
        return parseInt(match[1], 10);
      }
      return 8; // Default 8 hours
    }
    
    case 'workout': {
      // Match patterns like "30 min", "1 hour workout"
      const match = name.match(/(\d+)\s*(min|minute|hour|hr|h)\b/i);
      if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();
        if (unit.startsWith('h')) {
          return value * 3600; // Convert hours to seconds
        }
        return value * 60; // Convert minutes to seconds
      }
      return 1; // Default: at least 1 workout
    }
  }
}

/**
 * Map habits to health data types
 */
export function mapHabitsToHealthData(habits: any[]): HealthHabitMapping[] {
  const mappings: HealthHabitMapping[] = [];
  
  for (const habit of habits) {
    const healthType = detectHealthType(habit.name);
    if (!healthType) continue;
    
    const threshold = extractThreshold(habit.name, healthType);
    
    mappings.push({
      habitId: habit._id,
      habitName: habit.name,
      healthType,
      threshold,
      unit: healthType === 'steps' ? 'steps' : healthType === 'sleep' ? 'hours' : 'workouts',
    });
  }
  
  return mappings;
}

/**
 * Check if health data meets habit threshold
 */
async function meetsThreshold(mapping: HealthHabitMapping): Promise<boolean> {
  try {
    switch (mapping.healthType) {
      case 'steps': {
        const steps = await getStepsToday();
        return steps >= mapping.threshold;
      }
      
      case 'sleep': {
        const hours = await getSleepHoursToday();
        return hours >= mapping.threshold;
      }
      
      case 'workout': {
        const workouts = await getWorkoutsToday();
        if (mapping.threshold === 1) {
          // Just need at least one workout
          return workouts.length > 0;
        }
        // Check total workout duration
        const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
        return totalDuration >= mapping.threshold;
      }
    }
  } catch (error) {
    console.error(`[HealthKit] Failed to check threshold for ${mapping.habitName}:`, error);
    return false;
  }
}

/**
 * Main sync function - auto-complete habits based on health data
 * 
 * @param habits - List of user's habits
 * @param completeHabit - Function to complete a habit (calls Convex mutation)
 * @returns Sync result with completed habits
 */
export async function syncHealthDataWithHabits(
  habits: any[],
  completeHabit: (habitId: string) => Promise<void>
): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    habitsCompleted: [],
    errors: [],
    timestamp: new Date(),
  };
  
  try {
    // Check if we synced recently (cache)
    const lastSync = await AsyncStorage.getItem(LAST_SYNC_KEY);
    if (lastSync) {
      const timeSinceSync = Date.now() - parseInt(lastSync, 10);
      if (timeSinceSync < SYNC_CACHE_DURATION) {
        console.log('[HealthKit] Skipping sync - cached');
        return result;
      }
    }
    
    // Map habits to health data
    const mappings = mapHabitsToHealthData(habits);
    console.log(`[HealthKit] Found ${mappings.length} health-related habits`);
    
    // Check each mapping
    for (const mapping of mappings) {
      try {
        const meets = await meetsThreshold(mapping);
        
        if (meets) {
          console.log(`[HealthKit] Auto-completing: ${mapping.habitName}`);
          await completeHabit(mapping.habitId);
          result.habitsCompleted.push(mapping.habitId);
        }
      } catch (error) {
        const message = `Failed to sync ${mapping.habitName}: ${error}`;
        console.error(`[HealthKit] ${message}`);
        result.errors?.push(message);
      }
    }
    
    // Update last sync timestamp
    await AsyncStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
    
  } catch (error) {
    console.error('[HealthKit] Sync failed:', error);
    result.success = false;
    result.errors?.push(String(error));
  }
  
  return result;
}

/**
 * Get last sync timestamp
 */
export async function getLastSyncTime(): Promise<Date | null> {
  try {
    const timestamp = await AsyncStorage.getItem(LAST_SYNC_KEY);
    return timestamp ? new Date(parseInt(timestamp, 10)) : null;
  } catch {
    return null;
  }
}
