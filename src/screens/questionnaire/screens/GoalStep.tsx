import { OptionRow } from '../components/OptionRow';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { QuestionnaireScreenFrame } from '../components/QuestionnaireScreenFrame';
import { GOAL_OPTIONS } from '../data/goals';
import type { StepProps } from '../QuestionnaireFlow.types';

export function GoalStep({
  step,
  answers,
  updateAnswers,
  onNext,
  onBack,
}: StepProps) {
  const selected = answers.goal;

  return (
    <QuestionnaireScreenFrame
      canGoBack
      footer={
        <PrimaryCTA
          disabled={!selected}
          label='Continue'
          onPress={onNext}
        />
      }
      step={step}
      subtitle='Pick one — you can add more later.'
      title='What do you want to change?'
      onBack={onBack}
    >
      {GOAL_OPTIONS.map((option) => (
        <OptionRow
          key={option.id}
          emoji={option.emoji}
          label={option.label}
          selected={selected === option.id}
          onPress={() => updateAnswers({ goal: option.id })}
        />
      ))}
    </QuestionnaireScreenFrame>
  );
}
