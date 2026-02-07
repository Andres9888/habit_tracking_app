import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

export function ShimmerBox({
  width,
  height,
  delay = 0,
  style,
}: {
  width: number | string;
  height: number;
  delay?: number;
  style?: object;
}) {
  const opacity = useSharedValue(0.4);
  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 1000 }), -1, true)
    );
  }, [delay, opacity]);
  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[
        { backgroundColor: '#e7e5e4', borderRadius: 8, height, width },
        animStyle,
        style,
      ]}
    />
  );
}
