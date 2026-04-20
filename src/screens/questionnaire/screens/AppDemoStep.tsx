import { StepStub } from '../components/StepStub';
import type { StepProps } from '../QuestionnaireFlow.types';

export function AppDemoStep(props: StepProps) {
  return <StepStub {...props} title='Swipe right on habits you want.' />;
}
