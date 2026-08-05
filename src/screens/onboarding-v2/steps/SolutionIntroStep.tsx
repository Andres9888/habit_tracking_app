import { Pressable, ScrollView, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { NumberedSteps } from '../components/NumberedSteps';
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
            Here&rsquo;s your{'\n'}
            <Text style={{ color: '#B87333' }}>map.</Text>
          </Text>
          <SolutionMapPreview />
          <NumberedSteps />
        </ScrollView>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 6,
            justifyContent: 'flex-end',
            paddingBottom: 16,
            paddingRight: 4,
            paddingTop: 12,
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
