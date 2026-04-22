import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { HeroHeader } from '../components/HeroHeader';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { StepComponentProps } from '../types';

export function WelcomeStep({ onNext }: StepComponentProps) {
  const { colors } = useThemeColors();

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <View style={{ paddingTop: 24 }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 6,
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          {['#B87333', '#B87333', '#6B7280', '#6B7280', '#6B7280', '#D4A82A', '#D4A82A'].map(
            (color, i) => (
              <View
                key={`${color}-${i}`}
                style={{
                  backgroundColor: color,
                  borderRadius: 6,
                  height: 18,
                  width: 18,
                }}
              />
            )
          )}
        </View>
        <HeroHeader
          headline="You've tried this before."
          sub="This time, you'll see the habit actually becoming you — not just a streak count."
        />
      </View>
      <View style={{ paddingBottom: 8 }}>
        <PrimaryCTA label="Begin" onPress={onNext} variant="brand" />
        <Text
          style={{
            color: colors.text.tertiary,
            fontSize: 14,
            marginTop: 12,
            textAlign: 'center',
          }}
        >
          Already have an account?{' '}
          <Text style={{ color: colors.text.primary, fontWeight: '600' }}>Log in</Text>
        </Text>
      </View>
    </View>
  );
}
