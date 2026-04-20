import { StepStub } from '../components/StepStub';
import type { StepProps } from '../QuestionnaireFlow.types';

export function NotificationPrimingStep(props: StepProps) {
  return <StepStub {...props} title='Never miss a check-in.' />;
}
