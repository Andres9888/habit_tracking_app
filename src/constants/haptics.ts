/**
 * Haptic Feedback Patterns
 * Based on UX Expert recommendations for multi-layered haptic storytelling
 *
 * Free users: Basic single haptics
 * Premium users: Rich pattern sequences
 */

import * as Haptics from 'expo-haptics';

export type HapticPattern = {
  sequence: Array<Haptics.ImpactFeedbackStyle | Haptics.NotificationFeedbackType>;
  timing: number[]; // milliseconds between each haptic
};

/**
 * Core haptic patterns for different interactions
 */
export const HAPTIC_PATTERNS = {
  // Habit completion - celebratory sequence
  habitComplete: {
    sequence: [
      Haptics.ImpactFeedbackStyle.Light,
      Haptics.ImpactFeedbackStyle.Medium,
      Haptics.ImpactFeedbackStyle.Light,
    ],
    timing: [0, 100, 200],
  },

  // Streak milestone - building excitement
  streakMilestone: {
    sequence: [
      Haptics.ImpactFeedbackStyle.Heavy,
      Haptics.ImpactFeedbackStyle.Medium,
      Haptics.ImpactFeedbackStyle.Medium,
      Haptics.ImpactFeedbackStyle.Light,
    ],
    timing: [0, 150, 300, 450],
  },

  // Premium unlock - powerful, premium feel
  premiumUnlock: {
    sequence: [
      Haptics.ImpactFeedbackStyle.Heavy,
      Haptics.ImpactFeedbackStyle.Heavy,
    ],
    timing: [0, 80],
  },

  // Coin earn - rewarding feedback
  coinEarn: {
    sequence: [
      Haptics.ImpactFeedbackStyle.Light,
      Haptics.ImpactFeedbackStyle.Light,
    ],
    timing: [0, 50],
  },

  // Single haptics (for free users or reduce motion)
  tap: {
    sequence: [Haptics.ImpactFeedbackStyle.Light],
    timing: [0],
  },

  success: {
    sequence: [Haptics.NotificationFeedbackType.Success],
    timing: [0],
  },

  warning: {
    sequence: [Haptics.NotificationFeedbackType.Warning],
    timing: [0],
  },

  error: {
    sequence: [Haptics.NotificationFeedbackType.Error],
    timing: [0],
  },
} as const;

/**
 * Play a haptic pattern sequence
 * Automatically respects reduce motion preference
 */
export async function playHapticPattern(
  pattern: HapticPattern,
  options?: {
    isPremium?: boolean;
    reduceMotion?: boolean;
  }
): Promise<void> {
  const { isPremium = false, reduceMotion = false } = options || {};

  // If reduce motion is enabled, only play first haptic
  if (reduceMotion) {
    const firstHaptic = pattern.sequence[0];
    if (typeof firstHaptic === 'number') {
      await Haptics.impactAsync(firstHaptic);
    } else {
      await Haptics.notificationAsync(firstHaptic);
    }
    return;
  }

  // Free users get simplified sequence (first haptic only)
  if (!isPremium && pattern.sequence.length > 1) {
    const firstHaptic = pattern.sequence[0];
    if (typeof firstHaptic === 'number') {
      await Haptics.impactAsync(firstHaptic);
    } else {
      await Haptics.notificationAsync(firstHaptic);
    }
    return;
  }

  // Premium users get full sequence
  for (let i = 0; i < pattern.sequence.length; i++) {
    const haptic = pattern.sequence[i];
    const delay = pattern.timing[i];

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (typeof haptic === 'number') {
      await Haptics.impactAsync(haptic);
    } else {
      await Haptics.notificationAsync(haptic);
    }
  }
}

/**
 * Convenience functions for common patterns
 */
export const Haptics_Patterns = {
  habitComplete: (isPremium = false, reduceMotion = false) =>
    playHapticPattern(HAPTIC_PATTERNS.habitComplete, { isPremium, reduceMotion }),

  streakMilestone: (isPremium = false, reduceMotion = false) =>
    playHapticPattern(HAPTIC_PATTERNS.streakMilestone, { isPremium, reduceMotion }),

  premiumUnlock: (isPremium = false, reduceMotion = false) =>
    playHapticPattern(HAPTIC_PATTERNS.premiumUnlock, { isPremium, reduceMotion }),

  coinEarn: (isPremium = false, reduceMotion = false) =>
    playHapticPattern(HAPTIC_PATTERNS.coinEarn, { isPremium, reduceMotion }),

  tap: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),

  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),

  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};

