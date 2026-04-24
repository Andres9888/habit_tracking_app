import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { AnimatedLogo } from '@/screens/auth/components/AnimatedLogo';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { StepComponentProps } from '../types';

export function WelcomeStep({ onNext }: StepComponentProps) {
  const { colors } = useThemeColors();

  return (
    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
      <View style={{ alignItems: 'center', paddingTop: 56 }}>
        <AnimatedLogo size={108} />
        <Text
          accessibilityRole="header"
          style={{
            color: colors.text.primary,
            fontSize: 32,
            fontWeight: '800',
            letterSpacing: -0.5,
            lineHeight: 38,
            marginTop: 48,
            textAlign: 'center',
          }}
        >
          You&rsquo;re here.
        </Text>
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 17,
            lineHeight: 24,
            marginTop: 12,
            textAlign: 'center',
          }}
        >
          That&rsquo;s the hardest part.
        </Text>
      </View>
      <View style={{ paddingBottom: 8, width: '100%' }}>
        <PrimaryCTA label="Begin" onPress={onNext} variant="brand" />
      </View>
    </View>
  );
}
