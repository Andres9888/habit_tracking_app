import { StepStub } from '../components/StepStub';
import type { StepProps } from '../QuestionnaireFlow.types';

export function SolutionStep(props: StepProps) {
  return <StepStub {...props} title="Here's how Chain Day fixes this." />;
}
