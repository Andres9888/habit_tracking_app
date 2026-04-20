import { StepStub } from '../components/StepStub';
import type { StepProps } from '../QuestionnaireFlow.types';

export function PlanPreviewStep(props: StepProps) {
  return <StepStub {...props} title='Your 3-habit starter plan' />;
}
