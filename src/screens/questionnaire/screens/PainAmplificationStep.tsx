import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';

import { useThemeColors } from '@/theme';

import { QuestionnaireScreenFrame } from '../components/QuestionnaireScreenFrame';
import { SwipeCard } from '../components/SwipeCard';
import { PAIN_STATEMENTS } from '../data/painStatements';
import type { StepProps } from '../QuestionnaireFlow.types';

export function PainAmplificationStep({
  step,
  answers,
  updateAnswers,
  onNext,
  onBack,
}: StepProps) {
  const { colors } = useThemeColors();
  const [index, setIndex] = useState(0);
  const current = PAIN_STATEMENTS[index];
  const total = PAIN_STATEMENTS.length;

  const advance = useCallback(
    (agreed: boolean) => {
      if (!current) return;
      if (agreed) {
        const relatable = answers.relatable.includes(current.id)
          ? answers.relatable
          : [...answers.relatable, current.id];
        updateAnswers({ relatable });
      }
      const isLast = index >= total - 1;
      if (isLast) onNext();
      else setIndex((value) => value + 1);
    },
    [answers.relatable, current, index, onNext, total, updateAnswers]
  );

  return (
    <QuestionnaireScreenFrame
      canGoBack
      step={step}
      subtitle={`Card ${Math.min(index + 1, total)} of ${total} — swipe right if it hits.`}
      title='Which of these sound like you?'
      onBack={onBack}
    >
      {current ? (
        <SwipeCard
          key={current.id}
          onSwipeLeft={() => advance(false)}
          onSwipeRight={() => advance(true)}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text
              style={{
                color: colors.text.primary,
                fontSize: 22,
                fontWeight: '600',
                lineHeight: 30,
                textAlign: 'center',
              }}
            >
              “{current.quote}”
            </Text>
          </View>
        </SwipeCard>
      ) : null}
    </QuestionnaireScreenFrame>
  );
}
