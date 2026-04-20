import { BulletList } from '../components/BulletList';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { QuestionnaireScreenFrame } from '../components/QuestionnaireScreenFrame';
import type { StepProps } from '../QuestionnaireFlow.types';

const BULLETS = [
  'Pick the habits that actually fit your life',
  'See a year of check-ins on one screen',
  'Keep the chain going — even on busy days',
] as const;

export function WelcomeStep({ step, onNext, onBack }: StepProps) {
  return (
    <QuestionnaireScreenFrame
      canGoBack={false}
      footer={<PrimaryCTA label='Get started' onPress={onNext} />}
      step={step}
      subtitle='3 minutes to your personalized starter plan.'
      title='Build habits that actually stick.'
      onBack={onBack}
    >
      <BulletList items={BULLETS} />
    </QuestionnaireScreenFrame>
  );
}
