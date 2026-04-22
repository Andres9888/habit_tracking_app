import { StepComponentProps } from '../types';
import { StepStub } from '../components/StepStub';

export function ProcessingStep({ onNext }: StepComponentProps) {
  return (
    <StepStub
      label="Step 8 of 13"
      note="Short dwell animation. Makes the demo feel earned."
      onNext={onNext}
      title="Processing Moment"
    />
  );
}
