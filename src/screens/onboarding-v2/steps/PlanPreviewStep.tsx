import { useQuery } from 'convex/react';
import { ScrollView, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { api } from '../../../../convex/_generated/api';
import { HeroHeader } from '../components/HeroHeader';
import { PlanPathCard } from '../components/PlanPathCard';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { estimatePath } from '../data/pathLength';
import { StepComponentProps } from '../types';

export function PlanPreviewStep({ answers, onNext }: StepComponentProps) {
  const { colors } = useThemeColors();
  const all = useQuery(api.templates.list, {});
  const picked = all
    ? answers.pickedTemplateIds
        .map((id) => all.find((t) => t._id === id))
        .filter((t): t is NonNullable<typeof t> => Boolean(t))
    : [];

  const name = answers.name?.trim();
  const headline = name
    ? `${name},\nyour habit map.`
    : 'Your habit map.';

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <HeroHeader
          headline={headline}
          sub="Three routes. Each takes a different time. Each day, one closer."
        />
        <View style={{ marginTop: 20 }}>
          {picked.map((t) => {
            const path = estimatePath(t.name);
            return (
              <PlanPathCard
                days={path.days}
                difficultyLabel={path.difficultyLabel}
                icon={t.icon}
                iconColor={t.iconColor}
                key={t._id}
                name={t.name}
              />
            );
          })}
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
            Miss a day? Detour. We recalculate the route. Your strength holds.
          </Text>
        </View>
      </ScrollView>
      <View style={{ paddingTop: 12 }}>
        <PrimaryCTA label="Begin Day 1" onPress={onNext} />
      </View>
    </View>
  );
}
