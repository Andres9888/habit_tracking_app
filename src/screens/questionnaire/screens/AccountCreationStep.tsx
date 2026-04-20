import { StepStub } from '../components/StepStub';
import type { StepProps } from '../QuestionnaireFlow.types';

export function AccountCreationStep(props: StepProps) {
  return <StepStub {...props} title='Save your plan' />;
}
