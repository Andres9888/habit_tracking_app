import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { HeroHeader } from '../components/HeroHeader';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { StepComponentProps } from '../types';

export function NameStep({ answers, onAnswerChange, onNext }: StepComponentProps) {
  const { colors } = useThemeColors();
  const [value, setValue] = useState(answers.name ?? '');
  const trimmed = value.trim();
  const canContinue = trimmed.length > 0;

  const handleContinue = () => {
    if (!canContinue) return;
    onAnswerChange({ name: trimmed });
    onNext();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <View style={{ paddingTop: 16 }}>
        <HeroHeader
          headline="What should we call you?"
          sub="Your chain is going to know your name."
        />
        <TextInput
          accessibilityLabel="Your name"
          autoCapitalize="words"
          autoCorrect={false}
          autoFocus
          onChangeText={setValue}
          onSubmitEditing={handleContinue}
          placeholder="Your name"
          placeholderTextColor={colors.text.tertiary}
          returnKeyType="done"
          style={{
            borderBottomColor: colors.border,
            borderBottomWidth: 2,
            color: colors.text.primary,
            fontSize: 22,
            fontWeight: '600',
            marginTop: 32,
            paddingBottom: 10,
            paddingTop: 6,
          }}
          value={value}
        />
      </View>
      <View style={{ paddingBottom: 8 }}>
        <PrimaryCTA
          disabled={!canContinue}
          label="Continue"
          onPress={handleContinue}
          variant="brand"
        />
        <Pressable
          accessibilityRole="button"
          hitSlop={12}
          onPress={onNext}
          style={{ marginTop: 14, paddingVertical: 6 }}
        >
          <Text
            style={{
              color: colors.text.tertiary,
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            Skip for now
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
