import { ScrollView, View } from 'react-native';

import { HeroHeader } from '../components/HeroHeader';
import { OptionRow } from '../components/OptionRow';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { GOAL_OPTIONS } from '../data/goals';
import { StepComponentProps } from '../types';

export function GoalStep({ answers, onAnswerChange, onNext }: StepComponentProps) {
  const selected = answers.goal;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <HeroHeader
          eyebrow="Step 2 of 13"
          headline="What are you trying to build?"
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
