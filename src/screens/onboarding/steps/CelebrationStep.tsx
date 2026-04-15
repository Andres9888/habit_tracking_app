/**
 * CelebrationStep — confetti + summary + final CTA.
 * Step 2 (final) of the interactive onboarding flow.
 */

import { Text, View } from 'react-native';
import Animated, { FadeInUp, useReducedMotion } from 'react-native-reanimated';

import { useThemeColors } from '../../../theme/ThemeContext';
import { Button } from '../../../components/Button/Button';
import { ConfettiSystem } from '../../../components/CelebrationSystem';
import type { CelebrationStepProps } from '../onboarding.types';
import { useHabitForCompletion } from './TryCompletionStep.hooks';
import { styles } from './CelebrationStep.styles';

export function CelebrationStep({
  habitId,
  onComplete,
}: CelebrationStepProps) {
  const { colors, isDark } = useThemeColors();
  const shouldReduceMotion = useReducedMotion();
  const entering = shouldReduceMotion
    ? undefined
    : FadeInUp.delay(300).springify().damping(18);

  const habit = useHabitForCompletion(habitId);

  return (
    <View style={styles.container}>
      <ConfettiSystem
        burstType="streakMilestone"
        isDarkMode={isDark}
        shouldReduceMotion={!!shouldReduceMotion}
      />

      <View style={styles.content}>
        <Animated.View entering={entering}>
          <Text style={[styles.title, { color: colors.primary[700] }]}>
            You're all set!
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Come back tomorrow to keep your chain going.
          </Text>
        </Animated.View>

        {habitId ? (
          <Animated.View
            entering={
              shouldReduceMotion
                ? undefined
                : FadeInUp.delay(500).springify().damping(18)
            }
            style={[
              styles.habitChip,
              { backgroundColor: colors.surface, borderColor: colors.cardBorder, borderWidth: 1 },
            ]}
          >
            <Text style={styles.habitChipEmoji}>{habit.habitIcon}</Text>
            <Text
              numberOfLines={1}
              style={[styles.habitChipName, { color: colors.text.primary }]}
            >
              {habit.habitName}
            </Text>
          </Animated.View>
        ) : null}
      </View>

      <Animated.View
        entering={
          shouldReduceMotion
            ? undefined
            : FadeInUp.delay(700).springify().damping(18)
        }
        style={styles.buttonContainer}
      >
        <Button
          fullWidth
          accessibilityLabel="Start building habits"
          size="large"
          variant="primary"
          onPress={() => void onComplete()}
        >
          Start Building Habits
        </Button>
      </Animated.View>
    </View>
  );
}
