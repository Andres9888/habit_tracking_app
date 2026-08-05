import { ScrollView, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { HeroHeader } from '../components/HeroHeader';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { SolutionRow } from '../components/SolutionRow';
import { SOLUTION_MAPPINGS } from '../data/solutions';
import { StepComponentProps } from '../types';

export function SolutionStep({ answers, onNext }: StepComponentProps) {
  const { colors } = useThemeColors();
  const filtered = SOLUTION_MAPPINGS.filter((m) =>
    answers.painPoints.includes(m.painId)
  );
  const rows = filtered.length > 0 ? filtered : SOLUTION_MAPPINGS.slice(0, 3);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <HeroHeader
          headline="Here's what you're getting."
          sub="Each thing you told us — addressed directly."
        />
        <View
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: 16,
            borderWidth: 1,
            marginTop: 20,
            padding: 18,
          }}
        >
          {rows.map((r, idx) => (
            <SolutionRow fix={r.fix} isFirst={idx === 0} key={r.painId} pain={r.pain} />
          ))}
        </View>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.primary[100],
            borderRadius: 12,
            flexDirection: 'row',
            gap: 10,
            marginTop: 16,
            padding: 14,
          }}
        >
          <Text style={{ fontSize: 18 }}>⏱</Text>
          <Text
            style={{
              color: colors.primary[700],
              flex: 1,
              fontSize: 13,
              lineHeight: 19,
            }}
          >
            Average habit forms in ~66 days. Plan for setbacks.
          </Text>
        </View>
      </ScrollView>
      <View style={{ paddingTop: 12 }}>
        <PrimaryCTA label="Continue" onPress={onNext} />
      </View>
    </View>
  );
}
