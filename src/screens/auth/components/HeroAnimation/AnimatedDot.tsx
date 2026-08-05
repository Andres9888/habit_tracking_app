import Animated, {
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { borderRadius } from '@/theme/spacing';

interface AnimatedDotProps {
  index: number;
  progress: SharedValue<number>;
}

export function AnimatedDot({ index, progress }: AnimatedDotProps) {
  const dotStyle = useAnimatedStyle(() => {
    const isActive = progress.value >= index && progress.value < index + 1;
    return {
      backgroundColor: isActive ? colors.primary[500] : colors.gray[200],
      transform: [{ scale: isActive ? 1.2 : 1 }],
    };
  });

  return <Animated.View style={[styles.dot, dotStyle]} />;
}

const styles = StyleSheet.create({
  dot: {
    borderRadius: borderRadius.xs,
    height: 8,
    width: 8,
  },
});
