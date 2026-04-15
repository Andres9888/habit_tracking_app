/**
 * TryCompletionStep — tap to complete your first habit.
 * Step 1 of the interactive onboarding flow.
 */

import { Text, View } from 'react-native';
import Animated, { FadeInUp, useReducedMotion } from 'react-native-reanimated';

import { useThemeColors } from '../../../theme/ThemeContext';
import { QuickCompleteButton } from '../../../components/QuickCompleteButton/QuickCompleteButton';
import { OnboardingHeader } from '../components/OnboardingHeader';
import type { TryCompletionStepProps } from '../onboarding.types';
import { useHabitForCompletion, useTryCompletionState } from './TryCompletionStep.hooks';
import { styles } from './TryCompletionStep.styles';

export function TryCompletionStep({
  habitId,
  onNext,
}: TryCompletionStepProps) {
  const { colors } = useThemeColors();
  const shouldReduceMotion = useReducedMotion();
  const { habitIcon, habitName, habitColor } = useHabitForCompletion(habitId);
  const { hasCompleted, handleComplete } = useTryCompletionState(onNext);

  return (
    <View style={styles.container}>
      <OnboardingHeader
        subtitle="Tap to complete your first habit for today."
        title="Nice! Now let's try it"
      />

      <View style={styles.content}>
        <Animated.View
          entering={
            shouldReduceMotion
              ? undefined
              : FadeInUp.delay(400).springify().damping(18)
          }
          style={[
            styles.habitCard,
            { backgroundColor: colors.surface, borderColor: colors.cardBorder, borderWidth: 1 },
          ]}
        >
          <Text style={styles.habitEmoji}>{habitIcon}</Text>
          <Text style={[styles.habitName, { color: colors.text.primary }]}>
            {habitName}
          </Text>
          {hasCompleted ? (
            <Text style={[styles.chainText, { color: habitColor }]}>
              Chain: Day 1!
            </Text>
          ) : null}
        </Animated.View>

        <QuickCompleteButton
          completedToday={hasCompleted}
          habitId={habitId}
          habitName={habitName}
          onComplete={handleComplete}
        />
      </View>
    </View>
  );
}
