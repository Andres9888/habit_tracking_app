/**
 * Tap Gesture Handler
 * Handles tap-to-toggle completion with haptic feedback
 */

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
  onPress?: () => void;
  setIsToggling: (value: boolean) => void;
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
    isToggling,
    reduceMotion,
    cardScale,
    today,
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
          runOnJS(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
              () => {}
            );
          })();
          triggerUncheckAnimation();
        } else {
          runOnJS(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
              () => {}
            );
          })();
          triggerCompletionCelebration();
        }
        runOnJS(setIsToggling)(true);
        runOnJS(async () => {
          try {
            await toggleCompletionMutation({ date: today, habitId: id });
          } catch (error) {
            if (__DEV__) console.error('Toggle completion failed:', error);
          } finally {
            setTimeout(() => {
              setIsToggling(false);
            }, 300);
          }
        })();
        if (onPress) {
          runOnJS(onPress)();
        }
      }
    });
}
