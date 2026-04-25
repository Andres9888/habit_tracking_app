import { ActivityIndicator, View } from 'react-native';
import Animated, { FadeInUp, useReducedMotion } from 'react-native-reanimated';

import { ScreenErrorBoundary } from '@/components/ErrorBoundary';
import { useThemeColors } from '@/theme/ThemeContext';

import { StepFrame } from './components/StepFrame';
import { STEP_REGISTRY } from './steps/stepRegistry';
import { StepId } from './types';
import { useOnboardingV2State } from './useOnboardingV2State';

// Steps before the question bank (Goal at step 3) hide the progress chrome
// so Welcome and Name feel like a moment, not a form.
const STEPS_WITHOUT_PROGRESS: ReadonlySet<StepId> = new Set(['welcome', 'name']);

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
    : FadeInUp.duration(260).springify().damping(18);

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
