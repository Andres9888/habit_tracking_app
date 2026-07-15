/**
 * GoalPresetChip — Single preset day-count chip for streak goal picker.
 */
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { useDetailPressAnimation } from '../../../hooks/useDetailPressAnimation';
import { useThemeColors, withAlpha } from '../../../theme';
import { readableHabitAccent } from './goalColorUtils';
import { buildChipContainerStyle } from './buildChipContainerStyle';
import { GoalChipLabel } from './GoalChipLabel';
import { GoalRecommendedBadge } from './GoalRecommendedBadge';
import { useGoalPresetChipAnimation } from './GoalPresetChip.hooks';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GoalPresetChipProps {
  days: number;
  disabled?: boolean;
  habitColor?: string;
  role?: string;
  selected: boolean;
  recommended: boolean;
  onPress: () => void;
  variant?: 'pill' | 'grid';
}

export function GoalPresetChip({
  days,
  disabled = false,
  habitColor,
  role,
  selected,
  recommended,
  onPress,
  variant = 'pill',
}: GoalPresetChipProps) {
  const { colors } = useThemeColors();
  const { animatedStyle: pressStyle, pressHandlers } =
    useDetailPressAnimation();
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
        buildChipContainerStyle(isGrid, disabled),
      ]}
      onPress={onPress}
      onPressIn={disabled ? undefined : pressHandlers.onPressIn}
      onPressOut={disabled ? undefined : pressHandlers.onPressOut}
    >
      <GoalChipLabel
        accent={accent}
        label={label}
        role={role}
        selected={selected}
        showRole={isGrid}
      />
      <GoalRecommendedBadge accent={accent} recommended={recommended} />
    </AnimatedPressable>
  );
}
