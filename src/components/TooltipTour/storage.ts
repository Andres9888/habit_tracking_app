/**
 * TooltipTour Storage
 * 
 * AsyncStorage utilities for persisting which tooltips the user has seen.
 * Once a tooltip is dismissed, it will never show again.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@habit_tracker/tooltip_tour_seen';

export interface TooltipStorage {
  /** Timestamp when tour was completed */
  completedAt: string | null;
  /** Individual tooltip IDs that have been seen */
  seenTooltipIds: string[];
}

/**
 * Check if user has completed the tooltip tour
 */
export async function hasCompletedTour(): Promise<boolean> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return false;
    
    const parsed: TooltipStorage = JSON.parse(data);
    return parsed.completedAt !== null;
  } catch (error) {
    console.error('[TooltipTour] Error checking tour status:', error);
    return false;
  }
}

/**
 * Check if a specific tooltip has been seen
 */
export async function hasSeenTooltip(tooltipId: string): Promise<boolean> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return false;
    
    const parsed: TooltipStorage = JSON.parse(data);
    return parsed.seenTooltipIds.includes(tooltipId);
  } catch (error) {
    console.error('[TooltipTour] Error checking tooltip:', error);
    return false;
  }
}

/**
 * Mark a specific tooltip as seen
 */
export async function markTooltipSeen(tooltipId: string): Promise<void> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    const current: TooltipStorage = data 
      ? JSON.parse(data)
      : { completedAt: null, seenTooltipIds: [] };
    
    if (!current.seenTooltipIds.includes(tooltipId)) {
      current.seenTooltipIds.push(tooltipId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
  } catch (error) {
    console.error('[TooltipTour] Error marking tooltip seen:', error);
  }
}

/**
 * Mark the entire tour as completed
 */
export async function markTourCompleted(): Promise<void> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    const current: TooltipStorage = data 
      ? JSON.parse(data)
      : { completedAt: null, seenTooltipIds: [] };
    
    current.completedAt = new Date().toISOString();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (error) {
    console.error('[TooltipTour] Error marking tour completed:', error);
  }
}

/**
 * Reset tour state (for testing/debugging)
 */
export async function resetTour(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[TooltipTour] Error resetting tour:', error);
  }
}
