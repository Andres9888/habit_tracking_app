import { StepStub } from '../components/StepStub';
import type { StepProps } from '../QuestionnaireFlow.types';

export function PaywallStep(props: StepProps) {
  return <StepStub {...props} title='Start your 7-day free trial' />;
}
