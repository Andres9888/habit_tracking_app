import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { StepComponentProps } from '../types';

export function WelcomeStep({ onNext }: StepComponentProps) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityHint="Activates to begin onboarding"
      accessibilityLabel="Tap to begin"
      accessibilityRole="button"
      onPress={onNext}
      style={{ flex: 1 }}
    >
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <Text
            accessibilityRole="header"
            style={{
              color: colors.text.primary,
              fontSize: 72,
              fontWeight: '800',
              letterSpacing: -2.5,
              textAlign: 'center',
            }}
          >
            Hey.
          </Text>
        </View>
        <View style={{ alignItems: 'center', paddingBottom: 16 }}>
          <Text
            style={{
              color: colors.text.tertiary,
              fontSize: 13,
              fontWeight: '500',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            Tap to begin
          </Text>
          <View
            style={{
              backgroundColor: colors.primary[600],
              borderRadius: 2,
              height: 3,
              marginTop: 8,
              opacity: 0.7,
              width: 36,
            }}
          />
        </View>
      </View>
    </Pressable>
  );
}
