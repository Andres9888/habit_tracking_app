import { StepComponentProps } from '../types';
import { StepStub } from '../components/StepStub';

export function PaywallStep({ onNext }: StepComponentProps) {
  return (
    <StepStub
      label="Step 13 of 13"
      note='RevenueCat modal. Honest framing: "long enough to hit iron."'
      onNext={onNext}
      title="Paywall"
    />
  );
}
