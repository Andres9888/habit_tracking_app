/**
 * useCelebrationHaptics Hook
 * Enhanced haptic feedback for celebrations and milestones
 * 
 * Provides special haptic patterns for:
 * - Completing all habits for the day
 * - Hitting streak milestones (7, 14, 21, 30 days)
 * - First habit of the day
 */

import { useCallback, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useReduceMotion } from './useReduceMotion';

interface UseCelebrationHapticsOptions {
  isEnabled?: boolean;
  preference?: boolean;
}

const isHapticsSupported = Platform.OS === 'ios' || Platform.OS === 'android';

// Helper to wait between haptic pulses
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useCelebrationHaptics({ 
  isEnabled = true, 
  preference 
}: UseCelebrationHapticsOptions = {}) {
  const reduceMotion = useReduceMotion({ preference });
  const shouldVibrate = isEnabled && !reduceMotion && isHapticsSupported;

  // Single completion - light tap
  const triggerCompletion = useCallback(async () => {
    if (!shouldVibrate) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  }, [shouldVibrate]);

  // First habit of the day - medium tap with success
  const triggerFirstCompletion = useCallback(async () => {
    if (!shouldVibrate) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await wait(100);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  }, [shouldVibrate]);

  // All habits complete - celebration pattern
  const triggerAllComplete = useCallback(async () => {
    if (!shouldVibrate) return;
    try {
      // Triple pulse celebration
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await wait(80);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await wait(80);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await wait(150);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  }, [shouldVibrate]);

  // Streak milestone (7, 14, 21, 30+ days) - special pattern
  const triggerStreakMilestone = useCallback(async (days: number) => {
    if (!shouldVibrate) return;
    try {
      if (days >= 30) {
        // Major milestone - intense celebration
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await wait(100);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await wait(100);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await wait(150);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (days >= 21) {
        // 21 days - habit formed!
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await wait(80);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await wait(150);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (days >= 7) {
        // First week
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await wait(100);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {}
  }, [shouldVibrate]);

  // Undo action - warning tap
  const triggerUndo = useCallback(async () => {
    if (!shouldVibrate) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {}
  }, [shouldVibrate]);

  return useMemo(() => ({
    triggerCompletion,
    triggerFirstCompletion,
    triggerAllComplete,
    triggerStreakMilestone,
    triggerUndo,
  }), [
    triggerCompletion,
    triggerFirstCompletion,
    triggerAllComplete,
    triggerStreakMilestone,
    triggerUndo,
  ]);
}

export default useCelebrationHaptics;
