import { Text, View } from 'react-native';

import { useThemeColors } from '@/theme';

import { PrimaryCTA } from '../components/PrimaryCTA';
import { QuestionnaireScreenFrame } from '../components/QuestionnaireScreenFrame';
import type { StepProps } from '../QuestionnaireFlow.types';

const BULLETS = [
  'Pick the habits that actually fit your life',
  'See a year of check-ins on one screen',
  "Keep the chain going — even on busy days",
];

export function WelcomeStep({ step, onNext, onBack }: StepProps) {
  const { colors } = useThemeColors();

  return (
    <QuestionnaireScreenFrame
      canGoBack={false}
      footer={<PrimaryCTA label='Get started' onPress={onNext} />}
      step={step}
      subtitle='3 minutes to your personalized starter plan.'
      title='Build habits that actually stick.'
      onBack={onBack}
    >
      <View style={{ gap: 14 }}>
        {BULLETS.map((line) => (
          <View
            key={line}
            style={{ alignItems: 'flex-start', flexDirection: 'row', gap: 10 }}
          >
            <Text style={{ color: colors.primary[600], fontSize: 18 }}>•</Text>
            <Text
              style={{
                color: colors.text.primary,
                flex: 1,
                fontSize: 16,
                lineHeight: 22,
              }}
            >
              {line}
            </Text>
          </View>
        ))}
      </View>
    </QuestionnaireScreenFrame>
  );
}
