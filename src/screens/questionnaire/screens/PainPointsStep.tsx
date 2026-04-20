import { OptionRow } from '../components/OptionRow';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { QuestionnaireScreenFrame } from '../components/QuestionnaireScreenFrame';
import { PAIN_POINT_OPTIONS } from '../data/painPoints';
import type { StepProps } from '../QuestionnaireFlow.types';

export function PainPointsStep({
  step,
  answers,
  updateAnswers,
  onNext,
  onBack,
}: StepProps) {
  const selected = answers.painPoints;

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((value) => value !== id)
      : [...selected, id];
    updateAnswers({ painPoints: next });
  };

  return (
    <QuestionnaireScreenFrame
      canGoBack
      footer={
        <PrimaryCTA
          disabled={selected.length === 0}
          label='Continue'
          onPress={onNext}
        />
      }
      step={step}
      subtitle='Pick any that sound familiar.'
      title="What's gotten in the way before?"
      onBack={onBack}
    >
      {PAIN_POINT_OPTIONS.map((option) => (
        <OptionRow
          key={option.id}
          multiSelect
          emoji={option.emoji}
          label={option.label}
          selected={selected.includes(option.id)}
          onPress={() => toggle(option.id)}
        />
      ))}
    </QuestionnaireScreenFrame>
  );
}
