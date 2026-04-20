import { Text } from 'react-native';

import { useThemeColors } from '@/theme';

import type { StepProps } from '../QuestionnaireFlow.types';
import { PrimaryCTA } from './PrimaryCTA';
import { QuestionnaireScreenFrame } from './QuestionnaireScreenFrame';

interface Props extends StepProps {
  title: string;
  ctaLabel?: string;
}

export function StepStub({
  step,
  title,
  ctaLabel = 'Continue',
  onNext,
  onBack,
}: Props) {
  const { colors } = useThemeColors();

  return (
    <QuestionnaireScreenFrame
      canGoBack={step > 1}
      footer={<PrimaryCTA label={ctaLabel} onPress={onNext} />}
      step={step}
      subtitle={`Step ${step} of 13 — stub. Content arrives in Commit 2+.`}
      title={title}
      onBack={onBack}
    >
      <Text style={{ color: colors.text.tertiary, fontSize: 14 }}>
        This placeholder exists so the state machine can be exercised end-to-end
        before content is wired in.
      </Text>
    </QuestionnaireScreenFrame>
  );
}
