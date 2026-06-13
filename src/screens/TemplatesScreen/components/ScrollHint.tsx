/**
 * ScrollHint — bottom scrim + "More below" chip for the landing browse scroll.
 */

import { StyleSheet, Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';

interface ScrollHintProps {
  reducedMotion: boolean;
  scrollY: SharedValue<number>;
  visible: boolean;
}

export function ScrollHint({
  reducedMotion,
  scrollY,
  visible,
}: ScrollHintProps) {
  const { colors, isDark } = useThemeColors();
  const bg = colors.background;
  const bgOpaque = bg + (isDark ? 'F5' : 'F5');
  const bgTransparent = bg + '00';
  const chipBg = colors.card + 'E6';

  const animatedStyle = useAnimatedStyle(() => {
    if (reducedMotion || !visible) return { opacity: 0 };
    return {
      opacity: interpolate(scrollY.value, [0, 24], [1, 0], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View pointerEvents='none' style={[s.overlay, animatedStyle]}>
      <LinearGradient
        colors={[bgTransparent, bgOpaque]}
        pointerEvents='none'
        style={s.scrim}
      >
        <View
          style={[
            s.chip,
            { backgroundColor: chipBg, borderColor: colors.border },
          ]}
        >
          <ChevronDown
            color={colors.text.secondary}
            size={14}
            strokeWidth={2.5}
          />
          <Text style={[s.chipText, { color: colors.text.secondary }]}>
            More below
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  chip: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: spacing.xs,
    borderWidth: 1,
    elevation: 2,
    paddingHorizontal: spacing.md + 1,
    paddingVertical: spacing.sm - 2,
    shadowColor: '#2D2A26',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  chipText: { ...typography.caption, fontWeight: fontWeights.semibold },
  overlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  scrim: {
    alignItems: 'center',
    height: 84,
    justifyContent: 'flex-end',
    paddingBottom: spacing.md,
  },
});
