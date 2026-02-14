/**
 * Smart Timing — Adaptive Notification Scheduling
 *
 * Learns when a user typically completes each habit and nudges them
 * at that time. Uses a simple rolling average of recent completion
 * times stored in AsyncStorage.
 *
 * Built by Opus.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { clampToQuietHours } from './quietHours';

const STORAGE_KEY_PREFIX = 'smart-timing-';
const MAX_HISTORY = 14; // Keep last 14 completion times

interface CompletionRecord {
  /** Hour of completion (0-23) */
  hour: number;
  /** Minute of completion (0-59) */
  minute: number;
  /** ISO date string for deduplication */
  date: string;
}

/**
 * Record that a habit was completed right now.
 * Call this every time the user completes a habit.
 */
export async function recordHabitCompletion(habitId: string): Promise<void> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${habitId}`;
    const raw = await AsyncStorage.getItem(key);
    const history: CompletionRecord[] = raw ? JSON.parse(raw) : [];

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Don't record duplicate for same day
    if (history.some((r) => r.date === today)) return;

    history.push({
      hour: now.getHours(),
      minute: now.getMinutes(),
      date: today,
    });

    // Keep only the most recent entries
    const trimmed = history.slice(-MAX_HISTORY);
    await AsyncStorage.setItem(key, JSON.stringify(trimmed));
  } catch (error) {
    if (__DEV__) console.warn('recordHabitCompletion failed', error);
  }
}

/**
 * Get the smart notification time for a habit based on historical
 * completion patterns. Returns null if insufficient data (< 3 records).
 *
 * The returned time is clamped to respect quiet hours.
 */
export async function getSmartTime(
  habitId: string
): Promise<{ hour: number; minute: number } | null> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${habitId}`;
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;

    const history: CompletionRecord[] = JSON.parse(raw);
    if (history.length < 3) return null;

    // Calculate average time using circular mean for hours
    // (to handle midnight crossover, though rare for habits)
    let sinSum = 0;
    let cosSum = 0;
    let minuteSum = 0;

    for (const record of history) {
      const angle = (record.hour / 24) * 2 * Math.PI;
      sinSum += Math.sin(angle);
      cosSum += Math.cos(angle);
      minuteSum += record.minute;
    }

    const avgAngle = Math.atan2(sinSum / history.length, cosSum / history.length);
    let avgHour = Math.round(((avgAngle / (2 * Math.PI)) * 24 + 24) % 24);
    const avgMinute = Math.round(minuteSum / history.length);

    // Nudge 30 minutes before average completion time
    let nudgeMinute = avgMinute - 30;
    if (nudgeMinute < 0) {
      nudgeMinute += 60;
      avgHour = (avgHour - 1 + 24) % 24;
    }

    // Round to nearest 5 minutes for cleanliness
    nudgeMinute = Math.round(nudgeMinute / 5) * 5;
    if (nudgeMinute >= 60) {
      nudgeMinute = 0;
      avgHour = (avgHour + 1) % 24;
    }

    return clampToQuietHours(avgHour, nudgeMinute);
  } catch (error) {
    if (__DEV__) console.warn('getSmartTime failed', error);
    return null;
  }
}

/**
 * Clear smart timing data for a habit (e.g., when deleted).
 */
export async function clearSmartTimingData(habitId: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(`${STORAGE_KEY_PREFIX}${habitId}`);
  } catch {
    // Best effort
  }
}

/**
 * Get the number of recorded completions for a habit.
 * Useful for UI to show "learning" state.
 */
export async function getCompletionCount(habitId: string): Promise<number> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${habitId}`;
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return 0;
    const history: CompletionRecord[] = JSON.parse(raw);
    return history.length;
  } catch {
    return 0;
  }
}
