/**
 * Screen 5: PainAmplification - Tinder-style swipe cards for pain points.
 * Accept/reject cards with animated dismiss.
 */

import { Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography, fontWeights } from '@/theme/typography';
import { borderRadius, spacing, shadows } from '@/theme/spacing';
import { StepHeader } from '../components/StepHeader';
import { SwipeButton } from '../components/SwipeButton';
import { useQuestionnaire } from '../QuestionnaireContext';
import { useSwipeCards } from './useSwipeCards';
import type { ScreenProps } from '../questionnaire.types';

export function PainAmplification({ onNext }: ScreenProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const { state, incrementPainCards } = useQuestionnaire();
  const { cards, currentIndex, isFinished, dismiss, cardStyle } =
    useSwipeCards(state.painPoints, onNext, incrementPainCards);

  const currentCard = cards[currentIndex];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.xl,
        paddingTop: insets.top + spacing.lg,
        paddingBottom: insets.bottom + spacing.lg,
      }}
    >
      <StepHeader
        headline="Sound familiar?"
        subtitle="Swipe right if you relate, left if not."
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {isFinished || !currentCard ? null : (
          <Animated.View
            entering={FadeInUp.springify().damping(18)}
            style={[
              cardStyle,
              {
                backgroundColor: colors.card,
                borderRadius: borderRadius.xl,
                padding: spacing.xl,
                width: '100%',
                minHeight: 200,
                justifyContent: 'center',
                alignItems: 'center',
                ...shadows.modal,
              },
            ]}
          >
            <Text
              style={{
                ...typography.body,
                fontWeight: fontWeights.medium,
                fontSize: 17,
                color: colors.text.primary,
                textAlign: 'center',
              }}
            >
              {currentCard.text}
            </Text>
          </Animated.View>
        )}
      </View>
      {isFinished ? null : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: spacing['2xl'],
            marginBottom: spacing.lg,
          }}
        >
          <SwipeButton color={colors.status.error} label={'\u2717'} onPress={() => dismiss(false)} />
          <SwipeButton color={colors.status.success} label={'\u2713'} onPress={() => dismiss(true)} />
        </View>
      )}
    </View>
  );
}
