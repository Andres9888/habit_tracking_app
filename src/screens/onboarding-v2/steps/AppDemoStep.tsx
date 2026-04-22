import { StepComponentProps } from '../types';
import { StepStub } from '../components/StepStub';

export function AppDemoStep({ onNext }: StepComponentProps) {
  return (
    <StepStub
      label="Step 9 of 13"
      note="Swipe through templates. Keep 3. The real use-the-app moment."
      onNext={onNext}
      title="App Demo"
    />
  );
}
