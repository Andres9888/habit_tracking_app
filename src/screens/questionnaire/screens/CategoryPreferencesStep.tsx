import { StepStub } from '../components/StepStub';
import type { StepProps } from '../QuestionnaireFlow.types';

export function CategoryPreferencesStep(props: StepProps) {
  return <StepStub {...props} title='What areas do you want to focus on?' />;
}
