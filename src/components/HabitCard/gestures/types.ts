/**
 * HabitCard Gesture Types
 *
 * Options passed to {@link useHabitCardGestures} and forwarded to
 * individual gesture factories (tap, pan, long-press).
 */

import type { SharedValue } from 'react-native-reanimated';
import type { Id } from '../../../../convex/_generated/dataModel';

/**
 * Full options bag for gesture composition.
 * Contains shared values, callbacks, and state needed by all three gesture handlers.
 */
export interface UseHabitCardGesturesOptions {
  id: Id<'habits'>;
  name: string;
  completed: boolean;
  disabled: boolean;
  reduceMotion: boolean;
  translateX: SharedValue<number>;
  cardScale: SharedValue<number>;
  today: string;
  onPress?: () => void;
  onLongPress?: () => void;
  toggleOptimistic: () => void;
  toggleCompletionMutation: (args: {
    date: string;
    habitId: Id<'habits'>;
  }) => Promise<unknown>;
  triggerCompletionCelebration: () => void;
  triggerUncheckAnimation: () => void;
}
