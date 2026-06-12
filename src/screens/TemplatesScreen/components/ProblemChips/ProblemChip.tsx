import { useEffect } from 'react';
import { Text, View } from 'react-native';
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { springs } from '../../../../theme/animations';
import type { GoalCollection } from '../../data/goalCollections';
import { styles as s } from './ProblemChips.styles';

interface ProblemChipProps {
  goal: GoalCollection;
  importedCount: number;
  isSelected: boolean;
  isWide: boolean;
  onSelectGoal: (goal: GoalCollection) => void;
}

export function ProblemChip({
  goal,
  importedCount,
  isSelected,
  isWide,
  onSelectGoal,
}: ProblemChipProps) {
  const { colors, isDark } = useThemeColors();
  const progress = useSharedValue(isSelected ? 1 : 0);
  const selectedBgColor = isDark ? goal.darkBgColor : goal.bgColor;
  const selectedTextColor = isDark ? goal.darkTextColor : goal.textColor;
  const showProgress = isSelected && importedCount > 0;

  useEffect(() => {
    progress.value = withSpring(isSelected ? 1 : 0, springs.responsive);
  }, [isSelected, progress]);

  const animatedChipStyle = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.card, selectedBgColor]
      ),
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.border, selectedTextColor]
      ),
    }),
    [colors.border, colors.card, selectedBgColor, selectedTextColor]
  );

  return (
    <AnimatedPressable
      accessibilityLabel={`${goal.problemLabel}: ${goal.promise}`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      hitSlop={0}
      style={[s.chip, isWide ? s.chipWide : s.chipHalf, animatedChipStyle]}
      onPress={() => {
        void triggerHaptic('selection');
        onSelectGoal(goal);
      }}
    >
      <Text style={s.emoji}>{goal.emoji}</Text>
      <Text
        style={[
          s.label,
          { color: isSelected ? selectedTextColor : colors.text.primary },
        ]}
      >
        {goal.problemLabel}
      </Text>
      {showProgress ? (
        <View style={s.progressBadge}>
          <Text style={s.progressText}>{importedCount} of 2</Text>
        </View>
      ) : null}
    </AnimatedPressable>
  );
}
