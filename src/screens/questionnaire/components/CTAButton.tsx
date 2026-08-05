/**
 * CTAButton - Full-width call-to-action button for questionnaire screens.
 */

import { Pressable, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography } from '@/theme/typography';
import { borderRadius, spacing, shadows } from '@/theme/spacing';

interface CTAButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function CTAButton({ label, onPress, disabled = false }: CTAButtonProps) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={{
        backgroundColor: disabled ? colors.gray[300] : colors.primary[600],
        borderRadius: borderRadius.medium,
        paddingVertical: spacing.base,
        alignItems: 'center',
        ...shadows.floatingActionButton,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Text style={{ ...typography.button, color: colors.text.inverse }}>
        {label}
      </Text>
    </Pressable>
  );
}
