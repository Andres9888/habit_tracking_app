import { ScrollView, View } from 'react-native';

import { CategoryTile } from '../components/CategoryTile';
import { HeroHeader } from '../components/HeroHeader';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { CATEGORY_OPTIONS } from '../data/categories';
import { StepComponentProps } from '../types';

export function CategoryPreferenceStep({ answers, onAnswerChange, onNext }: StepComponentProps) {
  const selected = answers.categories;

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    onAnswerChange({ categories: next });
  };

  const rows: (typeof CATEGORY_OPTIONS[number])[][] = [];
  for (let i = 0; i < CATEGORY_OPTIONS.length; i += 2) {
    rows.push(CATEGORY_OPTIONS.slice(i, i + 2));
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <HeroHeader
          headline="Which of these are you working on?"
          sub="Pick a few. We'll draw from here."
        />
        <View style={{ gap: 10, marginTop: 20 }}>
          {rows.map((row, rIdx) => (
            <View key={rIdx} style={{ flexDirection: 'row', gap: 10 }}>
              {row.map((c) => (
                <CategoryTile
                  icon={c.icon}
                  key={c.id}
                  label={c.label}
                  onPress={() => toggle(c.id)}
                  selected={selected.includes(c.id)}
                />
              ))}
            </View>
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
