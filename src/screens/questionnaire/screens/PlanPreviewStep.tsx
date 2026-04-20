import { Share, Text, View } from 'react-native';

import { useThemeColors } from '@/theme';

import { PrimaryCTA } from '../components/PrimaryCTA';
import { QuestionnaireScreenFrame } from '../components/QuestionnaireScreenFrame';
import type { StepProps } from '../QuestionnaireFlow.types';

const PLACEHOLDER_SLOTS = 3;

export function PlanPreviewStep({
  step,
  selectedTemplateIds,
  onNext,
  onBack,
}: StepProps) {
  const { colors } = useThemeColors();
  const count = Math.max(selectedTemplateIds.length, PLACEHOLDER_SLOTS);

  const handleShare = () => {
    void Share.share({
      message: "I'm starting my first 3 habits with Chain Day. Join me — it's free.",
    });
  };

  return (
    <QuestionnaireScreenFrame
      canGoBack
      footer={<PrimaryCTA label='Continue' onPress={onNext} />}
      step={step}
      subtitle='Built around the areas you picked. You can tweak anything later.'
      title={`Your ${count}-habit starter plan`}
      onBack={onBack}
    >
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={`slot-${index}`}
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: 14,
            borderWidth: 1,
            marginBottom: 10,
            padding: 16,
          }}
        >
          <Text style={{ color: colors.text.secondary, fontSize: 14 }}>
            Habit {index + 1} — selected on the next step
          </Text>
        </View>
      ))}
      <Text
        accessibilityRole='link'
        style={{
          color: colors.primary[600],
          fontSize: 15,
          fontWeight: '600',
          marginTop: 12,
          textAlign: 'center',
        }}
        onPress={handleShare}
      >
        Share my plan
      </Text>
    </QuestionnaireScreenFrame>
  );
}
