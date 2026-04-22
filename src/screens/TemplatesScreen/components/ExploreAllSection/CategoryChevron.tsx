/**
 * CategoryChevron — chevron-in-circle affordance for accordion toggle.
 * Rotates 180° with a bg tint when the category is expanded.
 */

import { ChevronDown } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { durations } from '../../../../theme/animations';

const SIZE = 20;

interface CategoryChevronProps {
  expanded: boolean;
}

export function CategoryChevron({ expanded }: CategoryChevronProps) {
  const { colors, isDark } = useThemeColors();
  const progress = useDerivedValue(() =>
    withTiming(expanded ? 1 : 0, { duration: durations.moderate })
  );
  const idleBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
  const activeBg = colors.primary[100];

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [idleBg, activeBg]
    ),
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }));

  return (
    <Animated.View style={[s.container, animatedStyle]}>
      <ChevronDown
        color={expanded ? colors.primary[700] : colors.text.tertiary}
        size={12}
        strokeWidth={3}
      />
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: SIZE / 2,
    height: SIZE,
    justifyContent: 'center',
    width: SIZE,
  },
});
