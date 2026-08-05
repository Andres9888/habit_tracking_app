/**
 * Haptic Patterns Library
 *
 * Centralized, named haptic patterns for premium tactile feedback.
 * Each pattern is designed for a specific interaction type.
 *
 * Created by Opus.
 */

import * as Haptics from 'expo-haptics';

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * Named haptic patterns mapped to interaction types.
 * All patterns are async sequences of expo-haptics calls.
 * Keys are sorted alphabetically per lint rules.
 */
export const HapticPatterns = {
  /**
   * Celebration — extra satisfying timed sequence for milestones and achievements.
   * Builds intensity: light → medium → heavy → success notification.
   * Total duration ~400ms.
   */
  celebration: async (): Promise<void> => {
    // Opening flourish — ascending intensity
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await wait(60);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await wait(80);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await wait(100);
    // Triumphant finale
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await wait(80);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  /**
   * Major celebration — for big milestones (30+ day streaks, all habits complete).
   * Extended version of celebration with extra pulses.
   * Total duration ~600ms.
   */
  celebrationMajor: async (): Promise<void> => {
    // Triple ascending pulse
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await wait(50);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await wait(50);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await wait(120);
    // Power hits
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await wait(80);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await wait(100);
    // Finale
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  /**
   * Error notification — for failed actions, validation errors.
   */
  error: async (): Promise<void> => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },

  /**
   * Heavy impact — for drag-and-drop begin, long press activation.
   */
  heavy: async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },

  /**
   * Selection changed — ultra-light feedback for picker scrolling, selection changes.
   */
  selection: async (): Promise<void> => {
    await Haptics.selectionAsync();
  },

  /**
   * Double tap streak pattern — two quick medium taps for streak increments.
   */
  streak: async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await wait(60);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  /**
   * Success notification — for completed actions, saves, confirmations.
   */
  success: async (): Promise<void> => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  /**
   * Light tap — for general button presses, list item taps, navigation.
   */
  tap: async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  /**
   * Medium impact — for toggles, switches, state changes.
   */
  toggle: async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  /**
   * Warning notification — for destructive actions, undo prompts.
   */
  warning: async (): Promise<void> => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },
} as const;

/**
 * All available haptic pattern names.
 */
export type HapticPatternName = keyof typeof HapticPatterns;
