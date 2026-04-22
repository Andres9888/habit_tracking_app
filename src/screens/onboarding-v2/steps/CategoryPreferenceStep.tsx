import { StepComponentProps } from '../types';
import { StepStub } from '../components/StepStub';

export function CategoryPreferenceStep({ onNext }: StepComponentProps) {
  return (
    <StepStub
      label="Step 7 of 13"
      note="Grid multi-select. Drives which templates appear in the demo."
      onNext={onNext}
      title="Category Preference"
    />
  );
}
