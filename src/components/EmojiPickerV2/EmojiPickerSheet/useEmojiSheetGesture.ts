/**
 * useEmojiSheetGesture — drag-to-dismiss / collapse pan gesture for the
 * emoji picker sheet.
 *
 * Velocity-aware release, structured like `useNoteSheetGesture`: dismiss
 * when the projected landing position clears the threshold (distance OR
 * flick), otherwise spring back to the current collapsed/expanded offset
 * with the release velocity. Dragging above the resting position resists
 * via `rubberband` instead of clamping.
 */
import { Gesture } from 'react-native-gesture-handler';
import { withSpring, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { springs } from '@/theme/animations';
import { project, rubberband } from '@/theme/sheetMotion';

const DISMISS_THRESHOLD_RATIO = 0.25;
const DISMISS_VELOCITY = 500;

interface UseEmojiSheetGestureOptions {
  translateY: SharedValue<number>;
  sheetHeight: SharedValue<number>;
  context: SharedValue<{ y: number }>;
  expandedHeight: number;
  onDismiss: () => void;
}

export function useEmojiSheetGesture({
  translateY,
  sheetHeight,
  context,
  expandedHeight,
  onDismiss,
}: UseEmojiSheetGestureOptions) {
  return Gesture.Pan()
    .onStart(() => {
      'worklet';
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      'worklet';
      const next = context.value.y + event.translationY;
      translateY.value = next >= 0 ? next : rubberband(next, expandedHeight);
    })
    .onEnd((event) => {
      'worklet';
      const threshold = expandedHeight * DISMISS_THRESHOLD_RATIO;
      const projected = translateY.value + project(event.velocityY);
      const shouldDismiss =
        translateY.value > threshold ||
        projected > threshold ||
        event.velocityY > DISMISS_VELOCITY;

      if (shouldDismiss) {
        scheduleOnRN(onDismiss);
      } else {
        const offset = expandedHeight - sheetHeight.value;
        translateY.value = withSpring(offset, {
          ...springs.gesture,
          velocity: event.velocityY,
        });
      }
    });
}
