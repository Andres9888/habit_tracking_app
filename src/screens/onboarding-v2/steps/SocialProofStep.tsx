import { ScrollView, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { HeroHeader } from '../components/HeroHeader';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { TestimonialCard } from '../components/TestimonialCard';
import { TESTIMONIALS } from '../data/testimonials';
import { StepComponentProps } from '../types';

export function SocialProofStep({ onNext }: StepComponentProps) {
  const { colors } = useThemeColors();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <HeroHeader
          eyebrow="Step 4 of 13"
          headline="You're not alone in this."
          sub="People who felt the same way and kept going."
        />
        <View style={{ marginTop: 20 }}>
          {TESTIMONIALS.map((t) => (
            <TestimonialCard
              initials={t.initials}
              key={t.id}
              meta={t.meta}
              name={t.name}
              quote={t.quote}
            />
          ))}
        </View>
        <Text
          style={{
            color: colors.text.tertiary,
            fontSize: 11,
            marginTop: 8,
            textAlign: 'center',
          }}
        >
          Community stories shared with permission.
        </Text>
      </ScrollView>
      <View style={{ paddingTop: 12 }}>
        <PrimaryCTA label="Continue" onPress={onNext} />
      </View>
    </View>
  );
}
