import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { borderRadius, spacing } from '@/theme/spacing';
import { useThemeColors } from '@/theme/ThemeContext';

import { HeroHeader } from '../components/HeroHeader';
import { PAIN_STATEMENTS } from '../data/painStatements';
import { StepComponentProps } from '../types';

export function PainAmplificationStep({ answers, onAnswerChange, onNext }: StepComponentProps) {
  const { colors } = useThemeColors();
  const [index, setIndex] = useState(0);
  const total = PAIN_STATEMENTS.length;
  const card = PAIN_STATEMENTS[index];

  const respond = (agree: boolean) => {
    if (!card) return;
    if (agree) {
      const next = [...answers.painAgreements, card.id];
      onAnswerChange({ painAgreements: next });
    }
    if (index + 1 >= total) {
      onNext();
      return;
    }
    setIndex(index + 1);
  };

  if (!card) return null;

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <View>
        <HeroHeader
          eyebrow={`${index + 1} of ${total}`}
          headline="Does this sound like you?"
          sub="Tap one. You can change your mind later."
        />
        <View
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: 20,
            borderWidth: 1.5,
            marginTop: 28,
            minHeight: 220,
            padding: spacing.lg,
          }}
        >
          <Text
            style={{
              color: colors.text.primary,
              fontSize: 20,
              fontStyle: 'italic',
              fontWeight: '500',
              lineHeight: 28,
            }}
          >
            &ldquo;{card.statement}&rdquo;
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, paddingTop: spacing.md }}>
        <Pressable
          accessibilityRole="button"
          onPress={() => respond(false)}
          style={{
            alignItems: 'center',
            backgroundColor: colors.border,
            borderRadius: borderRadius.button,
            flex: 1,
            padding: spacing.base,
          }}
        >
          <Text style={{ color: colors.text.primary, fontSize: 15, fontWeight: '600' }}>
            Not me
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => respond(true)}
          style={{
            alignItems: 'center',
            backgroundColor: colors.text.primary,
            borderRadius: borderRadius.button,
            flex: 1,
            padding: spacing.base,
          }}
        >
          <Text style={{ color: colors.text.inverse, fontSize: 15, fontWeight: '600' }}>
            That&rsquo;s me
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
