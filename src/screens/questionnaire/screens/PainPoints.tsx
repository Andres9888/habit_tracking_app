/**
 * Screen 3: PainPoints - Multi-select pain point picker.
 * "What usually gets in the way?"
 */

import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/theme/ThemeContext';
import { spacing } from '@/theme/spacing';
import { StepHeader } from '../components/StepHeader';
import { QuestionnaireCard } from '../components/QuestionnaireCard';
import { CTAButton } from '../components/CTAButton';
import { useQuestionnaire } from '../QuestionnaireContext';
import { PAIN_POINT_OPTIONS } from '../data/painPoints';
import type { ScreenProps } from '../questionnaire.types';

export function PainPoints({ onNext }: ScreenProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const { state, setPainPoints } = useQuestionnaire();

  const togglePainPoint = (id: string) => {
    const current = state.painPoints;
    const next = current.includes(id)
      ? current.filter((p) => p !== id)
      : [...current, id];
    setPainPoints(next);
  };

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
          headline="What usually gets in the way?"
          overline="STEP 2 OF 3"
          subtitle="Select all that apply. No judgment \u2014 this helps us personalize your plan."
        />
        {PAIN_POINT_OPTIONS.map((option) => (
          <QuestionnaireCard
            key={option.id}
            option={option}
            selected={state.painPoints.includes(option.id)}
            onPress={() => togglePainPoint(option.id)}
          />
        ))}
      </ScrollView>
      <View style={{ paddingHorizontal: spacing.xl }}>
        <CTAButton
          disabled={state.painPoints.length === 0}
          label="That's helpful \u2014 continue"
          onPress={onNext}
        />
      </View>
    </View>
  );
}
