/**
 * GoalPresetChip — Single preset day-count chip for streak goal picker.
 */
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useDetailPressAnimation } from '../../../hooks/useDetailPressAnimation';
import { useThemeColors, withAlpha } from '../../../theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography, fontWeights } from '../../../theme/typography';
import { useGoalPresetChipAnimation } from './GoalPresetChip.hooks';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const CHIP_BORDER_WIDTH = 1.5;

interface GoalPresetChipProps {
  days: number;
  disabled?: boolean;
  selected: boolean;
  recommended: boolean;
  onPress: () => void;
}

export function GoalPresetChip({
  days,
  disabled = false,
  selected,
  recommended,
  onPress,
}: GoalPresetChipProps) {
  const { colors } = useThemeColors();
  const { animatedStyle: pressStyle, pressHandlers } = useDetailPressAnimation();
  const selectionStyle = useGoalPresetChipAnimation(selected, {
    borderDefault: colors.border,
    borderSelected: colors.primary[600],
    fillDefault: colors.card,
    fillSelected: withAlpha(colors.primary[600], 0.1),
  });
  const label = days === 365 ? '1yr' : `${days}d`;

  return (
    <View style={{ marginTop: recommended ? spacing.sm : 0, position: 'relative' }}>
      {recommended ? (
        <Text
          style={{
            ...typography.caption,
            color: colors.status.success,
            fontSize: 9,
            fontWeight: fontWeights.bold,
            left: 0,
            position: 'absolute',
            right: 0,
            textAlign: 'center',
            top: -spacing.sm,
          }}
        >
          Recommended
        </Text>
      ) : null}
      <AnimatedPressable
        accessibilityLabel={`${label}${recommended ? ', recommended' : ''}`}
        accessibilityRole='button'
        accessibilityState={{ disabled, selected }}
        disabled={disabled}
        style={[
          pressStyle,
          selectionStyle,
          {
            borderRadius: borderRadius.full,
            borderWidth: CHIP_BORDER_WIDTH,
            opacity: disabled ? 0.45 : 1,
            paddingHorizontal: spacing.base,
            paddingVertical: spacing.sm,
          },
        ]}
        onPress={onPress}
        onPressIn={disabled ? undefined : pressHandlers.onPressIn}
        onPressOut={disabled ? undefined : pressHandlers.onPressOut}
      >
        <Text
          style={{
            ...typography.bodySmall,
            color: selected ? colors.primary[700] : colors.text.secondary,
            fontWeight: selected ? fontWeights.bold : fontWeights.medium,
          }}
        >
          {label}
        </Text>
      </AnimatedPressable>
    </View>
  );
}
