import { StepComponentProps } from '../types';
import { StepStub } from '../components/StepStub';

export function PlanPreviewStep({ onNext }: StepComponentProps) {
  return (
    <StepStub
      label="Step 10 of 13"
      note="Show their plan. Realistic formation windows. Share option."
      onNext={onNext}
      title="Plan Preview"
    />
  );
}
