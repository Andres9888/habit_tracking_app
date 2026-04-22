import { StepComponentProps } from '../types';
import { StepStub } from '../components/StepStub';

export function SolutionStep({ onNext }: StepComponentProps) {
  return (
    <StepStub
      label="Step 6 of 13"
      note="Bridge. Map each pain to a ChainDay mechanic."
      onNext={onNext}
      title="Personalized Solution"
    />
  );
}
