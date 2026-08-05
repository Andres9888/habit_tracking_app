import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { BlindPathBlock } from '../components/BlindPathBlock';
import { StepComponentProps } from '../types';

export function ProblemStep({ onNext }: StepComponentProps) {
  const { colors } = useThemeColors();

  return (
    <Pressable accessibilityRole="button" onPress={onNext} style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'space-between', paddingTop: 16 }}>
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <Text
            accessibilityRole="header"
            style={{
              color: colors.text.primary,
              fontSize: 52,
              fontWeight: '800',
              letterSpacing: -1.5,
              lineHeight: 56,
              textAlign: 'center',
            }}
          >
            You&rsquo;re building{'\n'}habits{' '}
            <Text style={{ color: '#B87333' }}>blind.</Text>
          </Text>
          <BlindPathBlock />
          <Text
            style={{
              color: '#B45309',
              fontSize: 20,
              fontWeight: '800',
              letterSpacing: -0.4,
              marginTop: 18,
              textAlign: 'center',
            }}
          >
            You&rsquo;re lost.
          </Text>
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: 14,
              lineHeight: 21,
              marginTop: 10,
              maxWidth: 300,
              textAlign: 'center',
            }}
          >
            No map. No markers. So you quit.
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
          <Text style={{ color: colors.text.secondary, fontSize: 14, fontWeight: '500' }}>
            tap to continue
          </Text>
          <Text style={{ color: '#B87333', fontSize: 16, fontWeight: '700' }}>→</Text>
        </View>
      </View>
    </Pressable>
  );
}
