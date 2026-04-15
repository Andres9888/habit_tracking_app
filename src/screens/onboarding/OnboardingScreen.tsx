/**
 * OnboardingScreen — 3-step interactive onboarding orchestrator.
 *
 * Steps: Add Habit → Try Completing → Celebration
 */

import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { useThemeColors } from '../../theme/ThemeContext';
import { StepProgressBar } from './components/StepProgressBar';
import { AddHabitStep } from './steps/AddHabitStep';
import { TryCompletionStep } from './steps/TryCompletionStep';
import { CelebrationStep } from './steps/CelebrationStep';
import { useOnboardingFlow } from './useOnboardingFlow';
import { styles } from './OnboardingScreen.styles';

interface OnboardingScreenProps {
  onComplete: () => void;
}

function OnboardingScreenContent({ onComplete }: OnboardingScreenProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const shouldReduceMotion = useReducedMotion();
  const flow = useOnboardingFlow({ onComplete });
  const entering = shouldReduceMotion
    ? undefined
    : FadeInDown.springify().damping(18);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <StepProgressBar
          currentStep={flow.stepIndex}
          totalSteps={flow.totalSteps}
        />
        {flow.currentStep !== 'celebration' ? (
          <Animated.View
            entering={shouldReduceMotion ? undefined : FadeIn.delay(600)}
            style={styles.skipContainer}
          >
            <Pressable
              accessibilityLabel="Skip onboarding"
              accessibilityRole="button"
              hitSlop={24}
              style={styles.skipButton}
              onPress={() => void flow.handleSkip()}
            >
              <Text
                style={[styles.skipText, { color: colors.text.secondary }]}
              >
                I'll explore later
              </Text>
            </Pressable>
          </Animated.View>
        ) : null}
      </View>

      <Animated.View key={flow.currentStep} entering={entering} exiting={FadeOut.duration(150)} style={styles.stepContainer}>
        {flow.currentStep === 'addHabit' ? (
          <AddHabitStep
            onHabitCreated={flow.handleHabitCreated}
            onNext={flow.goNext}
            onSkip={() => void flow.handleSkip()}
          />
        ) : null}
        {flow.currentStep === 'tryCompletion' && flow.createdHabitId ? (
          <TryCompletionStep
            habitId={flow.createdHabitId}
            onNext={flow.goNext}
            onSkip={() => void flow.handleSkip()}
          />
        ) : null}
        {flow.currentStep === 'celebration' ? (
          <CelebrationStep
            habitId={flow.createdHabitId}
            onComplete={() => void flow.handleFinish()}
          />
        ) : null}
      </Animated.View>
    </View>
  );
}

export function OnboardingScreen(props: OnboardingScreenProps) {
  return (
    <ScreenErrorBoundary screenName="Onboarding">
      <OnboardingScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}
