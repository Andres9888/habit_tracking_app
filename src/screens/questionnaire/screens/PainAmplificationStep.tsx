import { StepStub } from '../components/StepStub';
import type { StepProps } from '../QuestionnaireFlow.types';

export function PainAmplificationStep(props: StepProps) {
  return <StepStub {...props} title='Which of these sound like you?' />;
}
