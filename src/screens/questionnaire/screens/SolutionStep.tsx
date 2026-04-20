import { useMemo } from 'react';

import { PainSolutionRow } from '../components/PainSolutionRow';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { QuestionnaireScreenFrame } from '../components/QuestionnaireScreenFrame';
import { PAIN_POINT_OPTIONS } from '../data/painPoints';
import { DEFAULT_SOLUTIONS } from '../data/solutions';
import type { StepProps } from '../QuestionnaireFlow.types';

const MAX_ROWS = 4;

export function SolutionStep({ step, answers, onNext, onBack }: StepProps) {
  const rows = useMemo(() => {
    const painLabel = (id: string) =>
      PAIN_POINT_OPTIONS.find((option) => option.id === id)?.label ?? '';
    const chosen = answers.painPoints.length > 0
      ? DEFAULT_SOLUTIONS.filter((solution) =>
          answers.painPoints.includes(solution.painId)
        )
      : DEFAULT_SOLUTIONS.slice(0, MAX_ROWS);
    return chosen.slice(0, MAX_ROWS).map((solution) => ({
      ...solution,
      painLabel: painLabel(solution.painId),
    }));
  }, [answers.painPoints]);

  return (
    <QuestionnaireScreenFrame
      canGoBack
      footer={<PrimaryCTA label='See my plan' onPress={onNext} />}
      step={step}
      subtitle='A faster path, built around how you actually live.'
      title="Here's how Chain Day fixes this."
      onBack={onBack}
    >
      {rows.map((row) => (
        <PainSolutionRow
          key={row.painId}
          body={row.body}
          icon={row.icon}
          painLabel={row.painLabel || 'Old way'}
          title={row.title}
        />
      ))}
    </QuestionnaireScreenFrame>
  );
}
