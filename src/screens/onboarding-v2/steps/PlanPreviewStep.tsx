import { useQuery } from 'convex/react';
import { ScrollView, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { api } from '../../../../convex/_generated/api';
import { HeroHeader } from '../components/HeroHeader';
import { PlanHabitCard } from '../components/PlanHabitCard';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { StepComponentProps } from '../types';

const IRON_DAYS_BY_INDEX = [40, 52, 45];
const TIMINGS = ['Mornings', 'Evenings', 'Evenings'];

export function PlanPreviewStep({ answers, onNext }: StepComponentProps) {
  const { colors } = useThemeColors();
  const all = useQuery(api.templates.list, {});
  const picked = all
    ? answers.pickedTemplateIds
        .map((id) => all.find((t) => t._id === id))
        .filter((template) => template !== undefined)
    : [];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <HeroHeader
          headline="Your first chain."
          sub="Three habits. One chain each. You'll see strength build as you go."
        />
        <View style={{ marginTop: 20 }}>
          {picked.map((t, i) => (
            <PlanHabitCard
              daysToIron={IRON_DAYS_BY_INDEX[i] ?? 45}
              icon={t.icon}
              iconColor={t.iconColor}
              key={t._id}
              name={t.name}
              timing={TIMINGS[i] ?? 'Anytime'}
            />
          ))}
        </View>
        <View
          style={{
            backgroundColor: colors.primary[100],
            borderRadius: 12,
            marginTop: 8,
            padding: 14,
          }}
        >
          <Text style={{ color: colors.primary[700], fontSize: 13, lineHeight: 19 }}>
            Average time to iron tier: 45 days. That&rsquo;s the honest number.
          </Text>
        </View>
      </ScrollView>
      <View style={{ paddingTop: 12 }}>
        <PrimaryCTA label="Keep going" onPress={onNext} />
      </View>
    </View>
  );
}
