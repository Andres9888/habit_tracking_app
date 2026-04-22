import { StepComponentProps } from '../types';
import { StepStub } from '../components/StepStub';

export function GoalStep({ onNext }: StepComponentProps) {
  return (
    <StepStub
      label="Step 2 of 13"
      note="Self-identification. Single-select from life areas."
      onNext={onNext}
      title="Goal"
    />
  );
}
