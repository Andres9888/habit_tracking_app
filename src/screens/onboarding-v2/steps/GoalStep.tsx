import { ScrollView, View } from 'react-native';

import { HeroHeader } from '../components/HeroHeader';
import { OptionRow } from '../components/OptionRow';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { GOAL_OPTIONS } from '../data/goals';
import { StepComponentProps } from '../types';

export function GoalStep({ answers, onAnswerChange, onNext }: StepComponentProps) {
  const selected = answers.goal;
  const name = answers.name?.trim();
  const headline = name
    ? `What are you here for, ${name}?`
    : 'What are you here for?';

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <HeroHeader
          headline={headline}
          sub="Pick one to start. You can add more later."
        />
        <View style={{ marginTop: 20 }}>
          {GOAL_OPTIONS.map((option) => (
            <OptionRow
              icon={option.icon}
              key={option.id}
              label={option.label}
              onPress={() => onAnswerChange({ goal: option.id })}
              selected={selected === option.id}
              sub={option.sub}
            />
          ))}
        </View>
      </ScrollView>
      <View style={{ paddingTop: 12 }}>
        <PrimaryCTA disabled={!selected} label="Continue" onPress={onNext} />
      </View>
    </View>
  );
}
