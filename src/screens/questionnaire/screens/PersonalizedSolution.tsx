/**
 * Screen 6: PersonalizedSolution - Shows solutions matched to pain points.
 * Maps user's pain points to solution cards, backfills if needed.
 */

import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/theme/ThemeContext';
import { spacing } from '@/theme/spacing';
import { StepHeader } from '../components/StepHeader';
import { SolutionCard } from '../components/SolutionCard';
import { CTAButton } from '../components/CTAButton';
import { useQuestionnaire } from '../QuestionnaireContext';
import { SOLUTION_MAP, DEFAULT_SOLUTION_IDS } from '../data/solutions';
import type { ScreenProps } from '../questionnaire.types';

const MAX_SOLUTIONS = 4;

function getSolutions(painPoints: string[]) {
  const matched = painPoints
    .filter((id) => SOLUTION_MAP[id])
    .map((id) => SOLUTION_MAP[id]);

  if (matched.length >= 2) {
    return matched.slice(0, MAX_SOLUTIONS);
  }

  const backfillIds = DEFAULT_SOLUTION_IDS.filter(
    (id) => !painPoints.includes(id),
  );
  const backfilled = backfillIds
    .map((id) => SOLUTION_MAP[id])
    .filter(Boolean);

  return [...matched, ...backfilled].slice(0, MAX_SOLUTIONS);
}

export function PersonalizedSolution({ onNext }: ScreenProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const { state } = useQuestionnaire();

  const solutions = getSolutions(state.painPoints);

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
          headline="Here's why Chain Day is different"
          subtitle="Personalized features based on what gets in your way."
        />
        {solutions.map((solution) => (
          <SolutionCard key={solution.title} solution={solution} />
        ))}
      </ScrollView>
      <View style={{ paddingHorizontal: spacing.xl }}>
        <CTAButton label="Show me the habits" onPress={onNext} />
      </View>
    </View>
  );
}
