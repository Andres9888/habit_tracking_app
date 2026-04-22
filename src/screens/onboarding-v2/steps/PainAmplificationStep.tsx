import { StepComponentProps } from '../types';
import { StepStub } from '../components/StepStub';

export function PainAmplificationStep({ onNext }: StepComponentProps) {
  return (
    <StepStub
      label="Step 5 of 13"
      note="Swipe-card agree/dismiss on first-person failure statements."
      onNext={onNext}
      title="Pain Amplification"
    />
  );
}
