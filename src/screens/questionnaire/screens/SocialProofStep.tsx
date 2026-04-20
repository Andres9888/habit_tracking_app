import { StepStub } from '../components/StepStub';
import type { StepProps } from '../QuestionnaireFlow.types';

export function SocialProofStep(props: StepProps) {
  return <StepStub {...props} title="You're not alone." />;
}
