import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { StepComponentProps } from '../types';

export function WelcomeStep({ onNext }: StepComponentProps) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityHint="Activates to begin onboarding"
      accessibilityLabel="Tap to continue"
      accessibilityRole="button"
      onPress={onNext}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
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
            Hey
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 6,
            justifyContent: 'flex-end',
            paddingBottom: 16,
            paddingRight: 4,
          }}
        >
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: 14,
              fontWeight: '500',
            }}
          >
            tap to continue
          </Text>
          <Text
            style={{
              color: '#B87333',
              fontSize: 16,
              fontWeight: '700',
            }}
          >
            →
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
