import { StepComponentProps } from '../types';
import { StepStub } from '../components/StepStub';

export function SocialProofStep({ onNext }: StepComponentProps) {
  return (
    <StepStub
      label="Step 4 of 13"
      note="Community stories — aspirational placeholders with disclosure."
      onNext={onNext}
      title="Social Proof"
    />
  );
}
