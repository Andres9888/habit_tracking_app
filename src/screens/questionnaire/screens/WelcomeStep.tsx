import { StepStub } from '../components/StepStub';
import type { StepProps } from '../QuestionnaireFlow.types';

export function WelcomeStep(props: StepProps) {
  return <StepStub {...props} ctaLabel='Get started' title='Welcome' />;
}
