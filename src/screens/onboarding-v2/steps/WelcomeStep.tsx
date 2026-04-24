import { Image, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { PrimaryCTA } from '../components/PrimaryCTA';
import { StepComponentProps } from '../types';

const WELCOME_ICON = require('@/assets/onboarding/chainday-welcome-icon.png');
const ICON_SIZE = 108;

export function WelcomeStep({ onNext }: StepComponentProps) {
  const { colors } = useThemeColors();

  return (
    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <Image
          accessibilityLabel="ChainDay icon"
          accessibilityRole="image"
          source={WELCOME_ICON}
          style={{
            borderRadius: 22,
            height: ICON_SIZE,
            shadowColor: colors.gray[900],
            shadowOffset: { height: 6, width: 0 },
            shadowOpacity: 0.12,
            shadowRadius: 18,
            width: ICON_SIZE,
          }}
        />
        <Text
          accessibilityRole="header"
          style={{
            color: colors.text.primary,
            fontSize: 56,
            fontWeight: '800',
            letterSpacing: -2,
            marginTop: 40,
            textAlign: 'center',
          }}
        >
          Hey.
        </Text>
      </View>
      <View style={{ paddingBottom: 8, width: '100%' }}>
        <PrimaryCTA label="Begin" onPress={onNext} variant="brand" />
      </View>
    </View>
  );
}
