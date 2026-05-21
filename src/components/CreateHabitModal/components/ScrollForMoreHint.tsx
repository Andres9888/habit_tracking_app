/** ScrollForMoreHint — tiny static chevron at the bottom edge, visible while there's scroll room left. */

import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface ScrollForMoreHintProps {
  scrollY: SharedValue<number>;
  viewportHeight: SharedValue<number>;
  contentHeight: SharedValue<number>;
}

export function ScrollForMoreHint({
  scrollY,
  viewportHeight,
  contentHeight,
}: ScrollForMoreHintProps) {
  const { colors } = useThemeColors();

  const wrapStyle = useAnimatedStyle(() => {
    if (viewportHeight.value <= 0 || contentHeight.value <= 0) {
      return { opacity: 0 };
    }
    const remaining =
      contentHeight.value - (scrollY.value + viewportHeight.value);
    return {
      opacity: interpolate(
        remaining,
        [8, 48],
        [0, 0.5],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <Animated.View style={[styles.wrap, wrapStyle]}>
      <ChevronDown
        color={colors.text.tertiary}
        size={14}
        strokeWidth={2}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    bottom: 8,
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
  },
});
