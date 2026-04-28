import { useQuery } from 'convex/react';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { api } from '../../../../convex/_generated/api';
import { DayTag } from '../components/DayTag';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { estimatePath } from '../data/pathLength';
import { StepComponentProps } from '../types';

const COPPER = '#B87333';

function ChainPreview({ borderColor }: { borderColor: string }) {
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 4, marginTop: 32 }}>
      <View
        accessibilityLabel="Day 1 complete, six days until copper holds"
        accessibilityRole="image"
        accessible
        style={{
          backgroundColor: COPPER,
          borderRadius: 12,
          height: 36,
          shadowColor: COPPER,
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          width: 36,
        }}
      />
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <View
          key={i}
          style={{
            backgroundColor: 'rgba(184, 115, 51, 0.12)',
            borderColor,
            borderRadius: 12,
            borderStyle: 'dashed',
            borderWidth: 1.5,
            height: 36,
            width: 36,
          }}
        />
      ))}
    </View>
  );
}

export function CelebrationStep({ answers, onNext }: StepComponentProps) {
  const { colors } = useThemeColors();
  const name = answers.name?.trim();
  const all = useQuery(api.templates.list, {});
  const firstId = answers.firstCheckInIds[0];
  const firstHabit = all && firstId ? all.find((t) => t._id === firstId) : undefined;
  const path = firstHabit ? estimatePath(firstHabit.name) : null;

  const headline = name
    ? `${name},\nyour chain\nhas begun.`
    : 'Your chain\nhas begun.';
  const subcopy = path && firstHabit
    ? `One link forged. ${path.days - 1} days until ${firstHabit.name.toLowerCase()} is yours.`
    : 'One link forged. Six until copper holds for good.';
  const dayTag = path ? `Day 1 of ${path.days}` : 'Day 1';

  return (
    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 8 }}>
        <DayTag label={dayTag} />
        <Text
          accessibilityRole="header"
          style={{
            color: colors.text.primary,
            fontSize: 44,
            fontWeight: '800',
            letterSpacing: -2,
            lineHeight: 48,
            marginTop: 24,
            textAlign: 'center',
          }}
        >
          {headline}
        </Text>
        <ChainPreview borderColor={colors.border} />
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 15,
            lineHeight: 22,
            marginTop: 16,
            maxWidth: 320,
            textAlign: 'center',
          }}
        >
          {subcopy}
        </Text>
      </View>
      <View style={{ paddingBottom: 8, width: '100%' }}>
        <PrimaryCTA label="Continue" onPress={onNext} variant="brand" />
      </View>
    </View>
  );
}
