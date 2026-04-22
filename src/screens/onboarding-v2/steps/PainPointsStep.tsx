import { StepComponentProps } from '../types';
import { StepStub } from '../components/StepStub';

export function PainPointsStep({ onNext }: StepComponentProps) {
  return (
    <StepStub
      label="Step 3 of 13"
      note="Multi-select pain recognition. Confirmed copy from Phase 2."
      onNext={onNext}
      title="Pain Points"
    />
  );
}
