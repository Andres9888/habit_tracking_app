import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { PrimaryCTA } from '../components/PrimaryCTA';
import { TierProgression } from '../components/TierProgression';
import { StepComponentProps } from '../types';

export function WatchItTransformStep({ onNext }: StepComponentProps) {
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
          You&rsquo;ll watch it{'\n'}transform.
        </Text>
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 15,
            lineHeight: 22,
            marginTop: 12,
          }}
        >
          The chain doesn&rsquo;t show a number. Every 20% of the route, it visibly upgrades — earned, not arbitrary.
        </Text>
        <TierProgression />
        <Text
          style={{
            color: colors.text.tertiary,
            fontSize: 14,
            lineHeight: 20,
            textAlign: 'center',
          }}
        >
          Real material. Real progress you can see.
        </Text>
      </View>
      <PrimaryCTA label="Continue" onPress={onNext} variant="brand" />
    </View>
  );
}
