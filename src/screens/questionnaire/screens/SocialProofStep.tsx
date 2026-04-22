import { Text, View } from 'react-native';

import { useThemeColors } from '@/theme';
import { fontWeights } from '@/theme/typography';

import { PrimaryCTA } from '../components/PrimaryCTA';
import { QuestionnaireScreenFrame } from '../components/QuestionnaireScreenFrame';
import { TestimonialCard } from '../components/TestimonialCard';
import { TESTIMONIALS } from '../data/testimonials';
import type { StepProps } from '../QuestionnaireFlow.types';

export function SocialProofStep({ step, onNext, onBack }: StepProps) {
  const { colors } = useThemeColors();

  return (
    <QuestionnaireScreenFrame
      canGoBack
      footer={<PrimaryCTA label='Keep going' onPress={onNext} />}
      step={step}
      subtitle='Thousands of people are building chains right now.'
      title="You're not alone."
      onBack={onBack}
    >
      <View
        style={{
          backgroundColor: colors.primary[100],
          borderRadius: 12,
          marginBottom: 18,
          padding: 14,
        }}
      >
        <Text
          style={{
            color: colors.primary[700],
            fontSize: 13,
            fontWeight: fontWeights.semibold,
            letterSpacing: 0.3,
            textTransform: 'uppercase',
          }}
        >
          Real reviews
        </Text>
      </View>
      {TESTIMONIALS.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </QuestionnaireScreenFrame>
  );
}
