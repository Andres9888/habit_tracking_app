import { StepStub } from '../components/StepStub';
import type { StepProps } from '../QuestionnaireFlow.types';

export function PainPointsStep(props: StepProps) {
  return <StepStub {...props} title="What's gotten in the way before?" />;
}
