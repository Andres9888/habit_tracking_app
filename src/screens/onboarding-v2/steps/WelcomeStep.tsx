import { StepComponentProps } from '../types';
import { StepStub } from '../components/StepStub';

export function WelcomeStep({ onNext }: StepComponentProps) {
  return (
    <StepStub
      label="Step 1 of 13"
      note="Hook. Name their history, promise depth over streak vanity."
      onNext={onNext}
      title="Welcome"
    />
  );
}
