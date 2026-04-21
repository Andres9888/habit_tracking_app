/**
 * StreakGoalSection — Preset chip picker for setting a streak goal.
 * Values in days. 0 means "no goal".
 */

import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { useThemeColors } from '../../theme/ThemeContext';
import { typography, fontWeights } from '../../theme/typography';
import useHapticFeedback from '../../hooks/useHapticFeedback';

const PRESETS = [
  { days: 0, label: 'None' },
  { days: 7, label: '7d' },
  { days: 21, label: '21d' },
  { days: 30, label: '30d' },
  { days: 66, label: '66d' },
  { days: 100, label: '100d' },
  { days: 365, label: '1yr' },
];

interface StreakGoalSectionProps {
  streakGoal: number;
  onStreakGoalChange: (days: number) => void;
}

export function StreakGoalSection({
  streakGoal,
  onStreakGoalChange,
}: StreakGoalSectionProps) {
  const { colors } = useThemeColors();
  const { triggerSelection } = useHapticFeedback();

  const handleSelect = (days: number) => {
    triggerSelection();
    onStreakGoalChange(days);
  };

  return (
    <Animated.View entering={FadeInUp.delay(340).springify().damping(18)}>
      <Text
        className="mb-2 mt-6 text-center uppercase"
        style={{
          ...typography.caption,
          color: colors.text.tertiary,
          fontWeight: fontWeights.semibold,
          letterSpacing: 0.5,
        }}
      >
        Streak Goal
      </Text>
      <Text
        className="mb-4 text-center"
        style={{ ...typography.caption, color: colors.text.tertiary }}
      >
        {streakGoal > 0
          ? `Aim for ${streakGoal} day${streakGoal === 1 ? '' : 's'}`
          : 'No goal set'}
      </Text>

      <View className="flex-row flex-wrap justify-center gap-2">
        {PRESETS.map(({ days, label }) => {
          const selected = streakGoal === days;
          return (
            <Pressable
              key={days}
              accessibilityLabel={`${label} streak goal`}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              className="rounded-full px-4 py-2"
              style={{
                backgroundColor: selected
                  ? colors.status.streakLight
                  : colors.card,
                borderColor: selected
                  ? colors.status.streak
                  : colors.border,
                borderWidth: 1,
              }}
              onPress={() => handleSelect(days)}
            >
              <Text
                style={{
                  ...typography.bodySmall,
                  color: selected
                    ? colors.status.streakText
                    : colors.text.secondary,
                  fontWeight: selected ? '700' : '500',
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}
