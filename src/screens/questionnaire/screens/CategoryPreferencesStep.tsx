import { View } from 'react-native';

import { CategoryTile } from '../components/CategoryTile';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { QuestionnaireScreenFrame } from '../components/QuestionnaireScreenFrame';
import { CATEGORY_OPTIONS } from '../data/categories';
import type { StepProps } from '../QuestionnaireFlow.types';

function chunkIntoPairs<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += 2) {
    rows.push(items.slice(index, index + 2));
  }
  return rows;
}

export function CategoryPreferencesStep({
  step,
  answers,
  updateAnswers,
  onNext,
  onBack,
}: StepProps) {
  const selected = answers.categories;
  const rows = chunkIntoPairs(CATEGORY_OPTIONS);

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((value) => value !== id)
      : [...selected, id];
    updateAnswers({ categories: next });
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
      subtitle="We'll tailor your starter plan to these."
      title='Pick a few focus areas.'
      onBack={onBack}
    >
      {rows.map((row) => (
        <View
          key={row.map((item) => item.id).join('-')}
          style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}
        >
          {row.map((option) => (
            <CategoryTile
              key={option.id}
              emoji={option.emoji}
              label={option.label}
              selected={selected.includes(option.id)}
              onPress={() => toggle(option.id)}
            />
          ))}
          {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
        </View>
      ))}
    </QuestionnaireScreenFrame>
  );
}
