import { ActivityIndicator, View } from 'react-native';

import { ScreenErrorBoundary } from '@/components/ErrorBoundary';
import { useThemeColors } from '@/theme/ThemeContext';

import { StepFrame } from './components/StepFrame';
import { STEP_REGISTRY } from './steps/stepRegistry';
import { useOnboardingV2State } from './useOnboardingV2State';

interface OnboardingFlowV2Props {
  onComplete: () => void;
}

function OnboardingFlowV2Content({ onComplete }: OnboardingFlowV2Props) {
  const { colors } = useThemeColors();
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
      onBack={state.onBack}
      totalSteps={state.totalSteps}
    >
      <StepComponent
        answers={state.answers}
        onAnswerChange={state.updateAnswers}
        onBack={state.onBack}
        onNext={handleNext}
      />
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
