import { useCallback, useEffect, useRef, type ReactElement } from 'react';
import { View } from 'react-native';

import { ScreenErrorBoundary } from '@/components/ErrorBoundary';
import { BrandedLoadingScreen } from '@/components/auth/BrandedLoadingScreen';

import type { QuestionnaireStep, StepProps } from './QuestionnaireFlow.types';
import { TOTAL_STEPS } from './QuestionnaireFlow.types';
import { useQuestionnaireState } from './useQuestionnaireState';
import { WelcomeStep } from './screens/WelcomeStep';
import { GoalStep } from './screens/GoalStep';
import { PainPointsStep } from './screens/PainPointsStep';
import { SocialProofStep } from './screens/SocialProofStep';
import { PainAmplificationStep } from './screens/PainAmplificationStep';
import { SolutionStep } from './screens/SolutionStep';
import { CategoryPreferencesStep } from './screens/CategoryPreferencesStep';
import { ProcessingStep } from './screens/ProcessingStep';
import { AppDemoStep } from './screens/AppDemoStep';
import { PlanPreviewStep } from './screens/PlanPreviewStep';
import { NotificationPrimingStep } from './screens/NotificationPrimingStep';
import { AccountCreationStep } from './screens/AccountCreationStep';
import { PaywallStep } from './screens/PaywallStep';

const STEP_COMPONENTS: Record<
  QuestionnaireStep,
  (props: StepProps) => ReactElement
> = {
  1: WelcomeStep,
  2: GoalStep,
  3: PainPointsStep,
  4: SocialProofStep,
  5: PainAmplificationStep,
  6: SolutionStep,
  7: CategoryPreferencesStep,
  8: ProcessingStep,
  9: AppDemoStep,
  10: PlanPreviewStep,
  11: NotificationPrimingStep,
  12: AccountCreationStep,
  13: PaywallStep,
};

const POST_AUTH_STEP: QuestionnaireStep = 13;

interface Props {
  isSignedIn: boolean;
  onComplete: () => void;
}

function QuestionnaireFlowContent({ isSignedIn, onComplete }: Props) {
  const api = useQuestionnaireState();
  const jumpedRef = useRef(false);

  useEffect(() => {
    if (
      !jumpedRef.current &&
      api.hydrated &&
      isSignedIn &&
      api.step < POST_AUTH_STEP
    ) {
      jumpedRef.current = true;
      api.setStep(POST_AUTH_STEP);
    }
  }, [api, isSignedIn]);

  const handleNext = useCallback(() => {
    if (api.step >= TOTAL_STEPS) {
      void api.markComplete().then(onComplete);
      return;
    }
    api.setStep((api.step + 1) as QuestionnaireStep);
  }, [api, onComplete]);

  const handleBack = useCallback(() => {
    if (api.step <= 1) return;
    api.setStep((api.step - 1) as QuestionnaireStep);
  }, [api]);

  if (!api.hydrated) return <BrandedLoadingScreen />;

  const StepComponent = STEP_COMPONENTS[api.step];

  return (
    <View style={{ flex: 1 }}>
      <StepComponent
        answers={api.answers}
        selectedTemplateIds={api.selectedTemplateIds}
        setSelectedTemplateIds={api.setSelectedTemplateIds}
        step={api.step}
        updateAnswers={api.updateAnswers}
        onBack={handleBack}
        onNext={handleNext}
      />
    </View>
  );
}

export function QuestionnaireFlow(props: Props) {
  return (
    <ScreenErrorBoundary screenName='Questionnaire'>
      <QuestionnaireFlowContent {...props} />
    </ScreenErrorBoundary>
  );
}
