import { StepStub } from '../components/StepStub';
import type { StepProps } from '../QuestionnaireFlow.types';

export function GoalStep(props: StepProps) {
  return <StepStub {...props} title='What do you want to change?' />;
}
