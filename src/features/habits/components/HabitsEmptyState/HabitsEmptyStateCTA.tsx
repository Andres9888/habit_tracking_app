import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { styles } from './HabitsEmptyState.styles';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}

export function HabitsEmptyStateCTA({ value, onChangeText, onSubmit }: Props) {
  const { colors } = useThemeColors();
  const hasText = value.trim().length > 0;
  const ctaBg = hasText ? colors.primary[600] : colors.gray[200];
  const ctaText = hasText ? colors.text.inverse : colors.gray[400];
  const ctaLabel = hasText
    ? `Add "${value.trim()}" →`
    : 'Enter a habit name first';

  return (
    <View style={styles.ctaRow}>
      <View
        style={[
          styles.inputRow,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={{ fontSize: 20 }}>✍️</Text>
        <TextInput
          accessibilityLabel='Habit name'
          placeholder='Name your habit'
          placeholderTextColor={colors.text.tertiary}
          returnKeyType='done'
          style={[styles.input, { color: colors.text.primary }]}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
        />
      </View>
      <Pressable
        accessibilityLabel={ctaLabel}
        accessibilityRole='button'
        disabled={!hasText}
        style={[
          styles.cta,
          {
            backgroundColor: ctaBg,
            shadowColor: colors.primary[600],
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: hasText ? 0.28 : 0,
            shadowRadius: 12,
          },
        ]}
        onPress={onSubmit}
      >
        <Text style={[styles.ctaText, { color: ctaText }]}>{ctaLabel}</Text>
      </Pressable>
    </View>
  );
}
