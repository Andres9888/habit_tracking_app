import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface AnimatedDotProps {
  index: number;
  progress: SharedValue<number>;
}

export function AnimatedDot({ index, progress }: AnimatedDotProps) {
  const { colors: themeColors } = useThemeColors();
  
  const dotStyle = useAnimatedStyle(() => {
    const isActive = progress.value >= index && progress.value < index + 1;
    return {
      backgroundColor: isActive ? themeColors.primary[500] : themeColors.gray[200],
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
