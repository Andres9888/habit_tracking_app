/**
 * Tap Gesture Handler
 * Handles tap-to-toggle completion with haptic feedback
 */

import type { MutableRefObject } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  withSpring,
  withTiming,
  runOnJS,
  type SharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { Id } from '../../../../convex/_generated/dataModel';
import { Springs } from '../../../constants/motion';

interface TapGestureOptions {
  id: Id<'habits'>;
  completed: boolean;
  disabled: boolean;
  isToggling: boolean;
  reduceMotion: boolean;
  cardScale: SharedValue<number>;
  today: string;
  isMountedRef: MutableRefObject<boolean>;
  toggleTimeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
  onPress?: () => void;
  setIsToggling: (value: boolean) => void;
  toggleCompletionMutation: (args: {
    date: string;
    habitId: Id<'habits'>;
  }) => Promise<unknown>;
  triggerCompletionCelebration: () => void;
  triggerUncheckAnimation: () => void;
}

function fireHapticLight() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

function fireHapticMedium() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

export function createTapGesture(options: TapGestureOptions) {
  const {
    id,
    completed,
    disabled,
    isToggling,
    reduceMotion,
    cardScale,
    today,
    isMountedRef,
    toggleTimeoutRef,
    onPress,
    setIsToggling,
    toggleCompletionMutation,
    triggerCompletionCelebration,
    triggerUncheckAnimation,
  } = options;
  const press = (v: number) =>
    reduceMotion
      ? withTiming(v, { duration: 0 })
      : withSpring(v, Springs.button);

  function handleToggleCompletion() {
    toggleCompletionMutation({ date: today, habitId: id })
      .catch((error: unknown) => {
        if (__DEV__) console.error('Toggle completion failed:', error);
      })
      .finally(() => {
        toggleTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setIsToggling(false);
          }
        }, 300);
      });
  }

  return Gesture.Tap()
    .onBegin(() => {
      cardScale.value = press(0.96);
    })
    .onFinalize(() => {
      cardScale.value = press(1);
    })
    .onEnd(() => {
      if (!disabled && !isToggling) {
        if (completed) {
          runOnJS(fireHapticLight)();
          triggerUncheckAnimation();
        } else {
          runOnJS(fireHapticMedium)();
          triggerCompletionCelebration();
        }
        runOnJS(setIsToggling)(true);
        runOnJS(handleToggleCompletion)();
        if (onPress) {
          runOnJS(onPress)();
        }
      }
    });
}
