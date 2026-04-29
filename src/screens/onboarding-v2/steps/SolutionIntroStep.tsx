import { Pressable, ScrollView, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { BenefitRow } from '../components/BenefitRow';
import { SolutionMapPreview } from '../components/SolutionMapPreview';
import { StepComponentProps } from '../types';

export function SolutionIntroStep({ onNext }: StepComponentProps) {
  const { colors } = useThemeColors();

  return (
    <Pressable accessibilityRole="button" onPress={onNext} style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingTop: 16 }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
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
            We give you{'\n'}the map.
          </Text>
          <SolutionMapPreview />
          <View style={{ marginTop: 8 }}>
            <BenefitRow
              benefit="Know how long, how hard."
              feature="Science-backed length, per habit."
              icon="⏱"
            />
            <BenefitRow
              benefit="Know where you are. Know what to climb to."
              feature="Named markers: Copper, Iron, Gold."
              icon="📍"
            />
            <BenefitRow
              benefit="Watch your chain transform."
              feature="Every 20% of the way, a visible upgrade — proof, not numbers."
              icon="🔗"
            />
          </View>
          <View
            style={{
              backgroundColor: '#F3EEE5',
              borderColor: '#B87333',
              borderRadius: 10,
              borderStyle: 'dashed',
              borderWidth: 1,
              marginTop: 18,
              paddingHorizontal: 16,
              paddingVertical: 14,
            }}
          >
            <Text
              style={{
                color: '#5C3D17',
                fontSize: 14,
                fontWeight: '600',
                lineHeight: 20,
                textAlign: 'center',
              }}
            >
              Don&rsquo;t have a habit in mind?{'\n'}
              <Text style={{ color: '#B87333', fontWeight: '800' }}>
                We have 253 ready to go.
              </Text>
            </Text>
          </View>
        </ScrollView>
        <View style={{ alignItems: 'center', paddingBottom: 16, paddingTop: 12 }}>
          <Text
            style={{
              color: colors.text.tertiary,
              fontSize: 13,
              fontWeight: '500',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            Tap to continue
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
