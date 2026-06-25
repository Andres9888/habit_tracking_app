/**
 * GoalPresetChip — Single preset day-count chip for streak goal picker.
 */
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useDetailPressAnimation } from '../../../hooks/useDetailPressAnimation';
import { useThemeColors, withAlpha } from '../../../theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography, fontWeights } from '../../../theme/typography';
import { readableHabitAccent } from './goalColorUtils';
import { useGoalPresetChipAnimation } from './GoalPresetChip.hooks';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const CHIP_BORDER_WIDTH = 1.5;

interface GoalPresetChipProps {
  days: number;
  disabled?: boolean;
  habitColor?: string;
  selected: boolean;
  recommended: boolean;
  onPress: () => void;
  variant?: 'pill' | 'grid';
}

export function GoalPresetChip({
  days,
  disabled = false,
  habitColor,
  selected,
  recommended,
  onPress,
  variant = 'pill',
}: GoalPresetChipProps) {
  const { colors } = useThemeColors();
  const { animatedStyle: pressStyle, pressHandlers } = useDetailPressAnimation();
  const isGrid = variant === 'grid';
  const fillDefault = isGrid ? colors.gray[50] : colors.card;
  const accent = readableHabitAccent(
    habitColor,
    fillDefault,
    colors.primary[700]
  );
  const selectionStyle = useGoalPresetChipAnimation(selected, {
    borderDefault: colors.border,
    borderSelected: accent,
    fillDefault,
    fillSelected: withAlpha(accent, 0.1),
  });
  const label = days === 365 ? '1yr' : `${days}d`;

  return (
    <AnimatedPressable
      accessibilityLabel={`${label}${recommended ? ', recommended' : ''}`}
      accessibilityRole='button'
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      style={[
        pressStyle,
        selectionStyle,
        {
          alignItems: 'center',
          borderRadius: isGrid ? borderRadius.medium : borderRadius.full,
          borderWidth: CHIP_BORDER_WIDTH,
          opacity: disabled ? 0.45 : 1,
          paddingHorizontal: isGrid ? spacing.sm : spacing.base,
          paddingVertical: isGrid ? spacing.sm + 2 : spacing.sm,
          width: isGrid ? '100%' : undefined,
        },
      ]}
      onPress={onPress}
      onPressIn={disabled ? undefined : pressHandlers.onPressIn}
      onPressOut={disabled ? undefined : pressHandlers.onPressOut}
    >
      <Text
        style={{
          ...typography.bodySmall,
          color: selected ? accent : colors.text.secondary,
          fontWeight: selected ? fontWeights.bold : fontWeights.medium,
        }}
      >
        {label}
      </Text>
      {recommended ? (
        <Text
          style={{
            ...typography.tabBar,
            color: accent,
            fontWeight: fontWeights.bold,
            marginTop: spacing.xs,
            textTransform: 'uppercase',
          }}
        >
          Recommended
        </Text>
      ) : isGrid ? (
        <View style={{ height: 12, marginTop: spacing.xs }} />
      ) : null}
    </AnimatedPressable>
  );
}
