/**
 * HabitCard Gesture Types
 */

import type { MutableRefObject } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { Id } from '../../../../convex/_generated/dataModel';

export interface UseHabitCardGesturesOptions {
  id: Id<'habits'>;
  name: string;
  completed: boolean;
  disabled: boolean;
  isToggling: boolean;
  reduceMotion: boolean;
  translateX: SharedValue<number>;
  cardScale: SharedValue<number>;
  today: string;
  isMountedRef: MutableRefObject<boolean>;
  toggleTimeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
  onPress?: () => void;
  onLongPress?: () => void;
  setIsToggling: (value: boolean) => void;
  toggleCompletionMutation: (args: {
    date: string;
    habitId: Id<'habits'>;
  }) => Promise<unknown>;
  triggerCompletionCelebration: () => void;
  triggerUncheckAnimation: () => void;
}
