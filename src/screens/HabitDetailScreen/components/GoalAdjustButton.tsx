import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useDetailPressAnimation } from '../../../hooks/useDetailPressAnimation';
import { withAlpha } from '../../../theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GoalAdjustButton({
  accent,
  onPress,
}: {
  accent: string;
  onPress: () => void;
}) {
  const { animatedStyle, pressHandlers } = useDetailPressAnimation();
  return (
    <AnimatedPressable
      accessibilityRole='button'
      style={[
        animatedStyle,
        {
          backgroundColor: withAlpha(accent, 0.1),
          borderRadius: borderRadius.full,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs + 2,
        },
      ]}
      onPress={onPress}
      onPressIn={pressHandlers.onPressIn}
      onPressOut={pressHandlers.onPressOut}
    >
      <Text
        style={{
          ...typography.bodySmall,
          color: accent,
          fontWeight: fontWeights.semibold,
        }}
      >
        Adjust
      </Text>
    </AnimatedPressable>
  );
}
