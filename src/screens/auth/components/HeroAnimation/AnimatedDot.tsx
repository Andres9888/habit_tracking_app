import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

interface AnimatedDotProps {
  index: number;
  progress: SharedValue<number>;
}

export function AnimatedDot({ index, progress }: AnimatedDotProps) {
  const dotStyle = useAnimatedStyle(() => {
    const isActive = progress.value >= index && progress.value < index + 1;
    return {
      backgroundColor: isActive ? '#22c55e' : '#e7e5e4',
      transform: [{ scale: isActive ? 1.2 : 1 }],
    };
  });

  return <Animated.View style={[styles.dot, dotStyle]} />;
}

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
