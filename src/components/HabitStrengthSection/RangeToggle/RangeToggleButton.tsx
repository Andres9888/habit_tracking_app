/**
 * RangeToggleButton - equal-width segment (flex: 1), weight- and
 * color-driven active state. Mirrors DetailViewTabButton at a smaller scale.
 */
import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '@/theme';
import { useDetailPressAnimation } from '@/hooks/useDetailPressAnimation';
import { fontWeights, typography } from '@/theme/typography';
import type { TimeRange } from '../types';

interface RangeToggleButtonProps {
  activeRange: TimeRange;
  label: string;
  value: TimeRange;
  onPress: (value: TimeRange) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function RangeToggleButton({
  activeRange,
  label,
  value,
  onPress,
}: RangeToggleButtonProps) {
  const { colors } = useThemeColors();
  const { animatedStyle, pressHandlers } = useDetailPressAnimation();
  const isActive = activeRange === value;
  const color = isActive ? colors.primary[700] : colors.text.tertiary;

  return (
    <AnimatedPressable
      accessibilityRole='tab'
      accessibilityState={{ selected: isActive }}
      hitSlop={4}
      style={[
        animatedStyle,
        {
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          paddingVertical: 5,
          zIndex: 1,
        },
      ]}
      onPress={() => onPress(value)}
      onPressIn={pressHandlers.onPressIn}
      onPressOut={pressHandlers.onPressOut}
    >
      <Text
        style={{
          color,
          fontSize: typography.caption.fontSize,
          fontWeight: isActive ? fontWeights.bold : fontWeights.medium,
        }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
