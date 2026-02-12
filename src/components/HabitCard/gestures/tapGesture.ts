/**
 * Tap Gesture Handler
 * Handles tap-to-toggle completion with haptic feedback
 */

import { Gesture } from 'react-native-gesture-handler';
import { withTiming, runOnJS, type SharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { Id } from '../../../../convex/_generated/dataModel';
import { showSyncError } from '../../../utils/errorAlerts';

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
        runOnJS(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
            () => {}
          );
        })();
      } else {
        runOnJS(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
            () => {}
          );
        })();
      }

      // Crisp press scale
      cardScale.value = reduceMotion
        ? withTiming(0.96, { duration: 0 })
        : withTiming(0.96, { duration: 40 });
    })
    .onFinalize(() => {
      cardScale.value = reduceMotion
        ? withTiming(1, { duration: 0 })
        : withTiming(1, { duration: 80 });
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
