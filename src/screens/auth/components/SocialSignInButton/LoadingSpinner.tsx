import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { durations } from '@/theme/animations';
import { borderRadius } from '@/theme/spacing';

interface LoadingSpinnerProps {
  color: string;
}

export function LoadingSpinner({ color }: LoadingSpinnerProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: durations.loop, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(rotation);
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          borderColor: color,
          borderRadius: borderRadius.medium,
          borderTopColor: 'transparent',
          borderWidth: 2,
          height: 20,
          width: 20,
        },
      ]}
    />
  );
}
