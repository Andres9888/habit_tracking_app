import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { FirstRouteCard } from '../components/FirstRouteCard';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { StepComponentProps } from '../types';

export function PickFirstRouteStep({ onNext }: StepComponentProps) {
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
          Pick your{'\n'}first route.
        </Text>
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 15,
            lineHeight: 22,
            marginTop: 12,
          }}
        >
          Start with one. We&rsquo;ve picked the easiest — a 10-minute walk. Add more once you&rsquo;re walking.
        </Text>
        <FirstRouteCard />
      </View>
      <View>
        <PrimaryCTA label="Start this route" onPress={onNext} variant="brand" />
        <Pressable
          accessibilityRole="button"
          onPress={onNext}
          style={{
            alignItems: 'center',
            borderColor: '#B87333',
            borderRadius: 10,
            borderWidth: 1,
            marginTop: 10,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <Text style={{ color: '#5C3D17', fontSize: 14, fontWeight: '700' }}>
            Don&rsquo;t know yet?{' '}
            <Text style={{ color: '#B87333', fontWeight: '800' }}>
              Browse 253 ready-made →
            </Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
