import { Text, TextInput, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../../theme/typography';

interface FieldProps {
  label: string;
  hint?: string;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
  minHeight?: number;
}

export function Field({
  label,
  hint,
  placeholder,
  value,
  onChangeText,
  minHeight = 44,
}: FieldProps) {
  const { colors } = useThemeColors();

  return (
    <View className='mb-4'>
      <Text
        className='mb-1'
        style={{
          ...typography.caption,
          color: colors.text.secondary,
          fontWeight: fontWeights.semibold,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      {hint === undefined ? null : (
        <Text
          className='mb-2'
          style={{ ...typography.caption, color: colors.text.tertiary }}
        >
          {hint}
        </Text>
      )}
      <TextInput
        multiline
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        value={value}
        onChangeText={onChangeText}
        style={{
          ...typography.bodySmall,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: 12,
          borderWidth: 1,
          color: colors.text.primary,
          minHeight,
          padding: 12,
          textAlignVertical: 'top',
        }}
      />
    </View>
  );
}
