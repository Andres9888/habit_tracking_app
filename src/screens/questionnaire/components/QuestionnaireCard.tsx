/**
 * QuestionnaireCard - Selectable option card for questionnaire screens.
 * Supports single-select and multi-select modes.
 */

import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography, fontWeights } from '@/theme/typography';
import { borderRadius, spacing, shadows } from '@/theme/spacing';
import type { SelectOption } from '../questionnaire.types';

interface QuestionnaireCardProps {
  option: SelectOption;
  selected: boolean;
  onPress: () => void;
}

export function QuestionnaireCard({ option, selected, onPress }: QuestionnaireCardProps) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={option.label}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: selected ? colors.primary[100] : colors.card,
        borderColor: selected ? colors.primary[600] : colors.cardBorder,
        borderWidth: selected ? 2 : 1,
        borderRadius: borderRadius.medium,
        padding: spacing.base,
        marginBottom: spacing.md,
        ...shadows.card,
      }}
    >
      <Text style={{ fontSize: 24, marginRight: spacing.md }}>{option.emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            ...typography.body,
            fontWeight: fontWeights.semibold,
            color: colors.text.primary,
          }}
        >
          {option.label}
        </Text>
        {option.sublabel ? (
          <Text style={{ ...typography.caption, color: colors.text.secondary, marginTop: 2 }}>
            {option.sublabel}
          </Text>
        ) : null}
      </View>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: borderRadius.full,
          borderWidth: 2,
          borderColor: selected ? colors.primary[600] : colors.gray[300],
          backgroundColor: selected ? colors.primary[600] : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected ? (
          <Text style={{ color: colors.text.inverse, fontSize: 14, fontWeight: fontWeights.bold }}>
            {'\u2713'}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
