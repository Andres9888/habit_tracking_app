/** Multiline "why" input plus its live character counter. */
import { useState } from 'react';
import { Text, View } from 'react-native';
import { ThemedTextInput } from '@/components/ui/TextInput';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontFamilies, typography } from '@/theme/typography';

/** Client-side cap. Keeps the why to a single readable line on Detail. */
export const WHY_MAX_LENGTH = 140;

interface Props {
  value: string;
  onChange: (text: string) => void;
}

export function WhyField({ value, onChange }: Props) {
  const { colors, isDark } = useThemeColors();
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <ThemedTextInput
        blurOnSubmit
        multiline
        accessibilityLabel='Your why'
        maxLength={WHY_MAX_LENGTH}
        placeholder='Why this one matters to you'
        placeholderTextColor={colors.gray[300]}
        returnKeyType='done'
        style={{
          backgroundColor: isDark ? colors.card : '#FFFFFF',
          // Border width is held constant so focus only swaps the colour and
          // the field never shifts the rows below it.
          borderColor: focused ? colors.primary[500] : colors.border,
          borderRadius: 12,
          borderWidth: 1.5,
          color: colors.text.primary,
          fontFamily: fontFamilies.primary.display,
          fontSize: 15,
          fontStyle: 'italic',
          lineHeight: 22,
          minHeight: 56,
          paddingHorizontal: 14,
          paddingVertical: 12,
          textAlignVertical: 'top',
        }}
        value={value}
        onBlur={() => setFocused(false)}
        onChangeText={onChange}
        onFocus={() => setFocused(true)}
      />
      <Text
        style={{
          ...typography.caption,
          color: colors.text.tertiary,
          marginTop: 8,
          textAlign: 'right',
        }}
      >
        {`${value.length}/${WHY_MAX_LENGTH}`}
      </Text>
    </View>
  );
}
