
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

// Swipe dismissal constants
const SWIPE_DISMISS_THRESHOLD = 100; // pixels
const SWIPE_VELOCITY_THRESHOLD = 500; // pixels per second

interface UseSwipeDismissProps {
  onClose: () => void;
}

/**
 * Hook that manages swipe-to-dismiss gesture for modal components.
 * Returns the pan gesture and animated style for the modal container.
 */
export function useSwipeDismiss({ onClose }: UseSwipeDismissProps) {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ startY: 0 });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { startY: translateY.value };
    })
    .onUpdate((event) => {
      // Only allow downward swipes
      const newTranslateY = context.value.startY + event.translationY;
      if (newTranslateY >= 0) {
        translateY.value = newTranslateY;
      }
    })
    .onEnd((event) => {
      const shouldDismiss =
        translateY.value > SWIPE_DISMISS_THRESHOLD ||
        event.velocityY > SWIPE_VELOCITY_THRESHOLD;

      if (shouldDismiss) {
        runOnJS(onClose)();
        translateY.value = 0;
      } else {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 300,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return { animatedStyle, panGesture };
}
