import { useQuery } from 'convex/react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { api } from '../../../../convex/_generated/api';
import { DayTag } from '../components/DayTag';
import { HeroHeader } from '../components/HeroHeader';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { StepComponentProps } from '../types';

export function FirstCheckInStep({ answers, onAnswerChange, onNext }: StepComponentProps) {
  const { colors } = useThemeColors();
  const all = useQuery(api.templates.list, {});
  const picked = all
    ? answers.pickedTemplateIds
        .map((id) => all.find((t) => t._id === id))
        .filter((t): t is NonNullable<typeof t> => Boolean(t))
    : [];

  const handleTap = (templateId: string) => {
    onAnswerChange({ firstCheckInIds: [templateId] });
    onNext();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginBottom: 12 }}>
        <DayTag label="Day 1 starts now" />
      </View>
      <HeroHeader
        headline={`Tap a habit\nto begin.`}
        sub="The chain starts the moment you tap."
      />
      <View style={{ marginTop: 24 }}>
        {picked.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 32 }}>
            <ActivityIndicator color={colors.primary[600]} />
          </View>
        ) : (
          picked.map((t) => (
            <Pressable
              accessibilityHint="Begins your chain with this habit"
              accessibilityLabel={`Begin with ${t.name}`}
              accessibilityRole="button"
              key={t._id}
              onPress={() => handleTap(t._id)}
              style={{
                alignItems: 'center',
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: 14,
                borderWidth: 1,
                flexDirection: 'row',
                gap: 12,
                marginBottom: 8,
                padding: 14,
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: t.iconColor ?? '#FEF3C7',
                  borderRadius: 12,
                  height: 40,
                  justifyContent: 'center',
                  width: 40,
                }}
              >
                <Text style={{ fontSize: 20 }}>{t.icon}</Text>
              </View>
              <Text style={{ color: colors.text.primary, flex: 1, fontSize: 15, fontWeight: '600' }}>
                {t.name}
              </Text>
            </Pressable>
          ))
        )}
      </View>
      <View style={{ marginTop: 'auto', paddingTop: 12 }}>
        <PrimaryCTA disabled label="Tap a habit above" onPress={() => {}} />
      </View>
    </View>
  );
}
