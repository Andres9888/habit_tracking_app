/**
 * Tap Gesture Handler
 * Handles tap-to-toggle completion with haptic feedback
 */

import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, type SharedValue } from 'react-native-reanimated';
import { HapticPatterns } from '../../../utils/haptics/patterns';
import type { Id } from '../../../../convex/_generated/dataModel';
import { showSyncError } from '../../../utils/errorAlerts';
import {
  pressCard,
  releaseCard,
} from '../../../utils/animations/cardPressAnimation';

interface TapGestureOptions {
  id: Id<'habits'>;
  completed: boolean;
  disabled: boolean;
  reduceMotion: boolean;
  cardScale: SharedValue<number>;
  today: string;
  onPress?: () => void;
  toggleOptimistic: () => void;
  toggleCompletionMutation: (args: {
    date: string;
    habitId: Id<'habits'>;
  }) => Promise<unknown>;
  triggerCompletionCelebration: () => void;
  triggerUncheckAnimation: () => void;
}

export function createTapGesture(options: TapGestureOptions) {
  const {
    id,
    completed,
    disabled,
    reduceMotion,
    cardScale,
    today,
    onPress,
    toggleOptimistic,
    toggleCompletionMutation,
    triggerCompletionCelebration,
    triggerUncheckAnimation,
  } = options;

  return Gesture.Tap()
    .onBegin(() => {
      if (disabled) return;

      // Instant haptic feedback on touch
      if (completed) {
        runOnJS(HapticPatterns.tap)();
      } else {
        runOnJS(HapticPatterns.success)();
      }

      // Standard card press animation with spring physics
      if (reduceMotion) {
        cardScale.value = 0.97;
      } else {
        pressCard(cardScale);
      }
    })
    .onFinalize(() => {
      if (reduceMotion) {
        cardScale.value = 1;
      } else {
        releaseCard(cardScale);
      }
    })
    .onEnd(() => {
      if (disabled) return;

      // Optimistic UI update — instant visual toggle
      runOnJS(toggleOptimistic)();

      if (completed) {
        triggerUncheckAnimation();
      } else {
        triggerCompletionCelebration();
      }

      // Fire mutation in background
      runOnJS(async () => {
        try {
          await toggleCompletionMutation({ date: today, habitId: id });
        } catch (error) {
          if (__DEV__) console.error('Toggle completion failed:', error);
          showSyncError();
          // Revert optimistic state on error
          runOnJS(toggleOptimistic)();
        }
      })();

      if (onPress) {
        runOnJS(onPress)();
      }
    });
}
