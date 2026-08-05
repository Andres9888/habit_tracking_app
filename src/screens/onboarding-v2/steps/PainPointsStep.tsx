import { ScrollView, View } from 'react-native';

import { HeroHeader } from '../components/HeroHeader';
import { OptionRow } from '../components/OptionRow';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { PAIN_POINTS } from '../data/painPoints';
import { StepComponentProps } from '../types';

export function PainPointsStep({ answers, onAnswerChange, onNext }: StepComponentProps) {
  const selected = answers.painPoints;

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    onAnswerChange({ painPoints: next });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <HeroHeader
          headline="What usually stops you from sticking with a new habit?"
          sub="Pick any that feel true. More than one is fine."
        />
        <View style={{ marginTop: 20 }}>
          {PAIN_POINTS.map((pp) => (
            <OptionRow
              key={pp.id}
              label={pp.label}
              onPress={() => toggle(pp.id)}
              selected={selected.includes(pp.id)}
            />
          ))}
        </View>
      </ScrollView>
      <View style={{ paddingTop: 12 }}>
        <PrimaryCTA
          disabled={selected.length === 0}
          label="Continue"
          onPress={onNext}
        />
      </View>
    </View>
  );
}
