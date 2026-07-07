import { ScrollView, Text, View } from 'react-native';
import { borderRadius, spacing } from '@/theme/spacing';
import { useThemeColors } from '@/theme/ThemeContext';

import { HeroHeader } from '../components/HeroHeader';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { StepComponentProps } from '../types';

export function SocialProofStep({ onNext }: StepComponentProps) {
  const { colors } = useThemeColors();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.base }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <HeroHeader
          headline="Don't break the chain."
          sub="Popularized by Jerry Seinfeld. Used by comedians, writers, and athletes for decades to build daily habits."
        />
        <View
          style={{
            backgroundColor: colors.primary[100],
            borderRadius: borderRadius.button,
            marginTop: 28,
            padding: 18,
          }}
        >
          <Text
            style={{
              color: colors.primary[700],
              fontSize: 15,
              fontWeight: '600',
              lineHeight: 22,
            }}
          >
            ChainDay takes the chain seriously.
          </Text>
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: 14,
              lineHeight: 20,
              marginTop: spacing.sm,
            }}
          >
            Then removes the part that makes you quit when life happens.
          </Text>
        </View>
      </ScrollView>
      <View style={{ paddingTop: spacing.md }}>
        <PrimaryCTA label="Continue" onPress={onNext} />
      </View>
    </View>
  );
}
