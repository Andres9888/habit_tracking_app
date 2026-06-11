import { ActivityIndicator, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { ScreenErrorBoundary } from '@/components/ErrorBoundary';
import { durations, enterEasing } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';

import { StepFrame } from './components/StepFrame';
import { STEP_REGISTRY } from './steps/stepRegistry';
import { StepId } from './types';
import { useOnboardingV2State } from './useOnboardingV2State';

// Steps before the question bank hide the progress chrome so the
// pre-questionnaire screens (welcome → problem → solution → name)
// feel like a moment, not a form.
const STEPS_WITHOUT_PROGRESS: ReadonlySet<StepId> = new Set([
  'welcome',
  'problem',
  'solutionIntro',
  'name',
]);

interface OnboardingFlowV2Props {
  onComplete: () => void;
}

function OnboardingFlowV2Content({ onComplete }: OnboardingFlowV2Props) {
  const { colors } = useThemeColors();
  const reduceMotion = useReducedMotion();
  const state = useOnboardingV2State();

  if (!state.isHydrated) {
    return (
      <View style={{ alignItems: 'center', backgroundColor: colors.background, flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary[600]} />
      </View>
    );
  }

  const StepComponent = STEP_REGISTRY[state.currentStepId];
  const isLastStep = state.currentStepIndex === state.totalSteps - 1;
  const entering = reduceMotion
    ? undefined
    : FadeInDown.duration(durations.enter).easing(enterEasing);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      return;
    }
    state.onNext();
  };

  return (
    <StepFrame
      canGoBack={state.currentStepIndex > 0}
      currentStep={state.currentStepIndex + 1}
      hideProgress={STEPS_WITHOUT_PROGRESS.has(state.currentStepId)}
      onBack={state.onBack}
      totalSteps={state.totalSteps}
    >
      <Animated.View entering={entering} key={state.currentStepId} style={{ flex: 1 }}>
        <StepComponent
          answers={state.answers}
          onAnswerChange={state.updateAnswers}
          onBack={state.onBack}
          onNext={handleNext}
        />
      </Animated.View>
    </StepFrame>
  );
}

export function OnboardingFlowV2({ onComplete }: OnboardingFlowV2Props) {
  return (
    <ScreenErrorBoundary screenName="OnboardingV2">
      <OnboardingFlowV2Content onComplete={onComplete} />
    </ScreenErrorBoundary>
  );
}
