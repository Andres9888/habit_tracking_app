import { Gesture } from 'react-native-gesture-handler';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';

const DISMISS_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 500;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SPRING_CONFIG = { damping: 20, stiffness: 150 };

export function usePanGesture(onDismiss: () => void) {
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (
        event.translationY > DISMISS_THRESHOLD ||
        Math.round(event.velocityY) > VELOCITY_THRESHOLD
      ) {
        translateY.value = withSpring(SCREEN_HEIGHT, SPRING_CONFIG);
        runOnJS(onDismiss)();
      } else {
        translateY.value = withSpring(0, SPRING_CONFIG);
      }
    });

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return { panGesture, sheetAnimatedStyle, translateY };
}
