import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface AnimatedDotProps {
  index: number;
  progress: SharedValue<number>;
}

export function AnimatedDot({ index, progress }: AnimatedDotProps) {
  const { colors, isDark } = useThemeColors();
  const activeColor = isDark ? colors.primary[500] : '#22c55e';
  const inactiveColor = isDark ? colors.gray[300] : '#e7e5e4';

  const dotStyle = useAnimatedStyle(() => {
    const isActive = progress.value >= index && progress.value < index + 1;
    return {
      backgroundColor: isActive ? activeColor : inactiveColor,
      transform: [{ scale: isActive ? 1.2 : 1 }],
    };
  });

  return <Animated.View style={[styles.dot, dotStyle]} />;
}

const styles = StyleSheet.create({
  dot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
});
