import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { PrimaryCTA } from '../components/PrimaryCTA';
import { StreakStrengthPanel } from '../components/StreakStrengthPanel';
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
          You won&rsquo;t end up{'\n'}back at{' '}
          <Text style={{ color: '#059669' }}>zero.</Text>
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
        <StreakStrengthPanel />
        <Text
          style={{
            color: colors.text.tertiary,
            fontSize: 13,
            lineHeight: 20,
            marginTop: 16,
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
