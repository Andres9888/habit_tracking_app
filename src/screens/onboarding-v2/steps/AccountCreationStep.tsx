import { StepComponentProps } from '../types';
import { StepStub } from '../components/StepStub';

export function AccountCreationStep({ onNext }: StepComponentProps) {
  return (
    <StepStub
      label="Step 12 of 13"
      note='Custodial framing: "Save your chain." OAuth via Clerk.'
      onNext={onNext}
      title="Save Your Chain"
    />
  );
}
