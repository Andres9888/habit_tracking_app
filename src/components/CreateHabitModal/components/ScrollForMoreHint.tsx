/** ScrollForMoreHint — bottom fade and label that reveal more form content below. */

import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { withAlpha } from '@/theme/colors';
import { fontWeights, typography } from '@/theme/typography';
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
    const hasMoreBelow = interpolate(
      remaining,
      [8, 48],
      [0, 1],
      Extrapolation.CLAMP
    );
    const hasNotScrolled = interpolate(
      scrollY.value,
      [0, 12],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity: Math.min(hasMoreBelow, hasNotScrolled),
    };
  });

  return (
    <Animated.View
      pointerEvents='none'
      style={[styles.wrap, wrapStyle]}
      testID='scroll-for-more-hint'
    >
      <LinearGradient
        colors={[withAlpha(colors.surface, 0), colors.surface]}
        locations={[0, 0.72]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.labelRow}>
        <ChevronDown color={colors.primary[700]} size={14} strokeWidth={2.25} />
        <Text style={[styles.label, { color: colors.primary[700] }]}>
          Scroll for more
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.caption,
    fontWeight: fontWeights.semibold,
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  wrap: {
    alignItems: 'center',
    bottom: 0,
    height: 64,
    justifyContent: 'flex-end',
    left: 0,
    paddingBottom: 8,
    position: 'absolute',
    right: 0,
  },
});
