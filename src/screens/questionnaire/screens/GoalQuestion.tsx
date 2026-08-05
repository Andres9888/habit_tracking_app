/**
 * Screen 2: GoalQuestion - Single-select goal picker.
 * "What's your #1 goal right now?"
 */

import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/theme/ThemeContext';
import { spacing } from '@/theme/spacing';
import { StepHeader } from '../components/StepHeader';
import { QuestionnaireCard } from '../components/QuestionnaireCard';
import { CTAButton } from '../components/CTAButton';
import { useQuestionnaire } from '../QuestionnaireContext';
import { GOAL_OPTIONS } from '../data/goals';
import type { ScreenProps } from '../questionnaire.types';

export function GoalQuestion({ onNext }: ScreenProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const { state, setGoal } = useQuestionnaire();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top + spacing.lg,
        paddingBottom: insets.bottom + spacing.lg,
      }}
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <StepHeader
          headline="What's your #1 goal right now?"
          overline="STEP 1 OF 3"
          subtitle="Pick the one that matters most. We'll build around it."
        />
        {GOAL_OPTIONS.map((option) => (
          <QuestionnaireCard
            key={option.id}
            option={option}
            selected={state.selectedGoal === option.id}
            onPress={() => setGoal(option.id)}
          />
        ))}
      </ScrollView>
      <View style={{ paddingHorizontal: spacing.xl }}>
        <CTAButton
          disabled={!state.selectedGoal}
          label="Continue"
          onPress={onNext}
        />
      </View>
    </View>
  );
}
