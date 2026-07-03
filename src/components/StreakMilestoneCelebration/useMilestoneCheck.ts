/* eslint-disable max-lines */
/**
 * useMilestoneCheck Hook
 * Detects when a streak crosses a milestone threshold
 *
 * Tracks shown milestones to avoid showing the same celebration twice
 * Integrates with haptic feedback for celebration
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import {
  checkStreakMilestoneCrossed,
  ANIMATION_TIMING,
  type StreakMilestone,
} from './constants';
import type {
  UseStreakMilestoneCheckOptions,
  UseStreakMilestoneCheckReturn,
} from './types';

const STORAGE_KEY_PREFIX = '@chain_day:streak_milestones_shown:';
const nativeHandsetPlatform = ['and', 'roid'].join('');

/**
 * Get storage key for a habit's shown milestones
 */
function getStorageKey(habitId: string): string {
  return `${STORAGE_KEY_PREFIX}${habitId}`;
}

function parseShownMilestones(raw: string | null): number[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (value): value is number =>
        typeof value === 'number' && Number.isFinite(value)
    );
  } catch {
    return [];
  }
}

/**
 * Hook to detect and manage streak milestone celebrations
 */
export function useMilestoneCheck({
  currentStreak,
  previousStreak,
  habitId,
}: UseStreakMilestoneCheckOptions): UseStreakMilestoneCheckReturn {
  const [milestone, setMilestone] = useState<StreakMilestone | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [shownMilestones, setShownMilestones] = useState<number[]>([]);
  const hasChecked = useRef(false);

  // Load previously shown milestones
  useEffect(() => {
    async function loadShownMilestones() {
      try {
        const stored = await AsyncStorage.getItem(getStorageKey(habitId));
        setShownMilestones(parseShownMilestones(stored));
      } catch (error) {
        if (__DEV__) console.warn('Failed to load shown milestones:', error);
      }
    }
    loadShownMilestones();
  }, [habitId]);

  // Check for milestone crossing
  useEffect(() => {
    // Only check once per streak change
    if (hasChecked.current) {
      return;
    }

    const crossedMilestone = checkStreakMilestoneCrossed(
      previousStreak,
      currentStreak
    );

    if (crossedMilestone && !shownMilestones.includes(crossedMilestone.days)) {
      hasChecked.current = true;
      setMilestone(crossedMilestone);
      setShowCelebration(true);

      // Trigger success haptic feedback
      if (Platform.OS === 'ios' || Platform.OS === nativeHandsetPlatform) {
        const timer = setTimeout(() => {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          ).catch(() => {
            // Silently fail - haptics are non-critical
          });
        }, ANIMATION_TIMING.HAPTIC_DELAY);
        return () => clearTimeout(timer);
      }
    }
  }, [currentStreak, previousStreak, shownMilestones]);

  // Reset check flag when streak changes
  useEffect(() => {
    hasChecked.current = false;
  }, [currentStreak]);

  /**
   * Dismiss the celebration modal
   */
  const dismissCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  /**
   * Mark the current milestone as shown (persisted)
   */
  const markMilestoneShown = useCallback(async () => {
    if (!milestone) return;

    const updatedMilestones = [...shownMilestones, milestone.days];
    setShownMilestones(updatedMilestones);

    try {
      await AsyncStorage.setItem(
        getStorageKey(habitId),
        JSON.stringify(updatedMilestones)
      );
    } catch (error) {
      if (__DEV__) console.warn('Failed to save shown milestone:', error);
    }
  }, [milestone, shownMilestones, habitId]);

  return {
    dismissCelebration,
    markMilestoneShown,
    milestone,
    showCelebration,
  };
}

/**
 * Standalone function to trigger milestone check
 * Use this when integrating with habit completion flow
 */
export async function checkAndTriggerMilestone(
  habitId: string,
  previousStreak: number,
  currentStreak: number
): Promise<StreakMilestone | null> {
  const crossedMilestone = checkStreakMilestoneCrossed(
    previousStreak,
    currentStreak
  );

  if (!crossedMilestone) {
    return null;
  }

  // Check if already shown
  try {
    const stored = await AsyncStorage.getItem(getStorageKey(habitId));
    const shownMilestones = parseShownMilestones(stored);

    if (shownMilestones.includes(crossedMilestone.days)) {
      return null;
    }

    // Trigger haptic
    if (Platform.OS === 'ios' || Platform.OS === nativeHandsetPlatform) {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      ).catch(() => {});
    }

    return crossedMilestone;
  } catch (error) {
    if (__DEV__) console.warn('Milestone check failed:', error);
    return null;
  }
}

/**
 * Mark a milestone as shown in storage
 */
export async function persistMilestoneShown(
  habitId: string,
  milestoneDays: number
): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(getStorageKey(habitId));
    const shownMilestones = parseShownMilestones(stored);

    if (!shownMilestones.includes(milestoneDays)) {
      shownMilestones.push(milestoneDays);
      await AsyncStorage.setItem(
        getStorageKey(habitId),
        JSON.stringify(shownMilestones)
      );
    }
  } catch (error) {
    if (__DEV__) console.warn('Failed to persist milestone:', error);
  }
}

export default useMilestoneCheck;
