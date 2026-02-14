import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { useThemeColors } from '../../../theme/ThemeContext';

const SPRING_CONFIG = { damping: 18, stiffness: 200 };

interface DotIndicatorsProps {
  count: number;
  currentIndex: number;
}

function AnimatedDot({
  index,
  currentIndex,
}: {
  index: number;
  currentIndex: number;
}) {
  const { colors } = useThemeColors();
  const isActive = index === currentIndex;

  const animatedStyle = useAnimatedStyle(() => ({
    width: withSpring(isActive ? 24 : 8, SPRING_CONFIG),
    backgroundColor: isActive ? colors.primary[600] : colors.gray[300],
    opacity: withSpring(isActive ? 1 : 0.5, SPRING_CONFIG),
  }));

  return (
    <Animated.View
      accessibilityLabel={`Page ${index + 1}${isActive ? ', current' : ''}`}
      accessibilityRole='tab'
      accessibilityState={{ selected: isActive }}
      style={[styles.dot, animatedStyle]}
    />
  );
}

export function DotIndicators({ count, currentIndex }: DotIndicatorsProps) {
  return (
    <View
      accessible
      accessibilityLabel={`Page ${currentIndex + 1} of ${count}`}
      accessibilityRole='tablist'
      style={styles.container}
    >
      {Array.from({ length: count }, (_, i) => (
        <AnimatedDot key={i} currentIndex={currentIndex} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    borderRadius: 4,
    height: 8,
  },
});
