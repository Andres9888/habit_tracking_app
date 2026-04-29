import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { PrimaryCTA } from '../components/PrimaryCTA';
import { StreakVsStrengthSplit } from '../components/StreakVsStrengthSplit';
import { StepComponentProps } from '../types';

export function StrengthHoldsStep({ onNext }: StepComponentProps) {
  const { colors } = useThemeColors();

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', paddingTop: 8 }}>
      <View>
        <Text
          accessibilityRole="header"
          style={{
            color: colors.text.primary,
            fontSize: 40,
            fontWeight: '800',
            letterSpacing: -1.2,
            lineHeight: 44,
          }}
        >
          You won&rsquo;t end up{'\n'}back at zero.
        </Text>
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 15,
            lineHeight: 22,
            marginTop: 12,
          }}
        >
          Streaks count days. <Text style={{ fontWeight: '700' }}>Strength counts how automatic the habit has become.</Text> Skips dent it — never reset it.
        </Text>
        <StreakVsStrengthSplit />
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 13,
            fontWeight: '600',
            marginTop: 14,
            textAlign: 'center',
          }}
        >
          Same missed day. Different consequence.
        </Text>
        <Text
          style={{
            color: colors.text.tertiary,
            fontSize: 13,
            lineHeight: 20,
            marginTop: 12,
            textAlign: 'center',
          }}
        >
          You get both. Streaks for the vibes. Strength for the science.
        </Text>
      </View>
      <PrimaryCTA label="Continue" onPress={onNext} variant="brand" />
    </View>
  );
}
