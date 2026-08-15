import { Text, View } from 'react-native';
import { ThemedTextInput } from '../../../components/ui/TextInput';
import { useThemeColors } from '../../../theme/ThemeContext';
import {
  fontFamilies,
  fontWeights,
  typography,
} from '../../../theme/typography';
import type { MotivationFieldProps } from './MotivationSection.types';

export function MotivationField({
  hint,
  label,
  maxLength,
  onChange,
  short = false,
  value,
}: MotivationFieldProps) {
  const { colors } = useThemeColors();

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
      <Text
        style={{
          ...typography.caption,
          color: colors.text.tertiary,
          fontWeight: fontWeights.bold,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          ...typography.caption,
          color: colors.text.tertiary,
          marginBottom: 8,
          marginTop: 4,
        }}
      >
        {hint}
      </Text>
      <ThemedTextInput
        multiline
        accessibilityLabel={label}
        maxLength={maxLength}
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderRadius: 12,
          borderWidth: 1,
          color: colors.text.primary,
          fontFamily: fontFamilies.primary.display,
          fontSize: 15,
          lineHeight: 22,
          minHeight: short ? 56 : 78,
          paddingHorizontal: 12,
          paddingVertical: 10,
          textAlignVertical: 'top',
        }}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}
