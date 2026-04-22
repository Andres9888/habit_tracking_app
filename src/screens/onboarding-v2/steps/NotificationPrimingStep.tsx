import { StepComponentProps } from '../types';
import { StepStub } from '../components/StepStub';

export function NotificationPrimingStep({ onNext }: StepComponentProps) {
  return (
    <StepStub
      label="Step 11 of 13"
      note="Uses their real habit names in copy. Triggers system prompt."
      onNext={onNext}
      title="Notification Priming"
    />
  );
}
