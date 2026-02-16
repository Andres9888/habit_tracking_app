/**
 * useHabitCardGestures — Composes pan, tap, and long-press into a single gesture.
 *
 * **Gesture composition (via `Gesture.Race`):**
 * - **Long press** (500ms) — Opens quick-actions menu; wins the race first.
 * - **Tap + Pan** (simultaneous) — Tap toggles completion; pan reveals swipe actions.
 *   Running simultaneously lets the user start a swipe mid-tap without conflict.
 *
 * Each gesture factory lives in `./gestures/` for testability.
 */

import { Gesture } from 'react-native-gesture-handler';
import { createPanGesture } from './gestures/panGesture';
import { createTapGesture } from './gestures/tapGesture';
import { createLongPressGesture } from './gestures/longPressGesture';
import type { UseHabitCardGesturesOptions } from './gestures/types';

export type { UseHabitCardGesturesOptions } from './gestures/types';

export function useHabitCardGestures(options: UseHabitCardGesturesOptions) {
  const panGesture = createPanGesture(options.translateX, options.reduceMotion);

  const tapGesture = createTapGesture({
    cardScale: options.cardScale,
    completed: options.completed,
    disabled: options.disabled,
    id: options.id,
    onPress: options.onPress,
    reduceMotion: options.reduceMotion,
    today: options.today,
    toggleCompletionMutation: options.toggleCompletionMutation,
    toggleOptimistic: options.toggleOptimistic,
    triggerCompletionCelebration: options.triggerCompletionCelebration,
    triggerUncheckAnimation: options.triggerUncheckAnimation,
  });

  const longPressGesture = createLongPressGesture({
    disabled: options.disabled,
    onLongPress: options.onLongPress,
  });

  const composedGesture = Gesture.Race(
    longPressGesture,
    Gesture.Simultaneous(tapGesture, panGesture)
  );

  return { composedGesture, longPressGesture, panGesture, tapGesture };
}
