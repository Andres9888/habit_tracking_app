/** "Your why" input with the remaining-character counter inside its top-right. */
import { useState } from 'react';
import { Text, View } from 'react-native';
import { ThemedTextInput } from '@/components/ui/TextInput';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';
import { usePanelTokens } from './panel/panelTokens';

/** Client-side cap. Keeps the why to a single readable line on Detail. */
export const WHY_MAX_LENGTH = 140;

interface Props {
  value: string;
  onChange: (text: string) => void;
  /** True while the row is open so the field takes focus on reveal. */
  autoFocus?: boolean;
}

export function WhyField({ value, onChange, autoFocus = false }: Props) {
  const { colors, isDark } = useThemeColors();
  const t = usePanelTokens();
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <ThemedTextInput
        blurOnSubmit
        multiline
        accessibilityLabel='Your why'
        autoFocus={autoFocus}
        maxLength={WHY_MAX_LENGTH}
        placeholder='I want to feel…'
        placeholderTextColor={t.chevron}
        returnKeyType='done'
        style={{
          backgroundColor: isDark ? colors.card : '#FFFFFF',
          // Border width is held constant so focus only swaps the colour and
          // the field never shifts the rows below it.
          borderColor: focused ? t.hues.why.unsetBorder : t.panelBorder,
          borderRadius: 14,
          borderWidth: 1.5,
          color: t.textPrimary,
          fontFamily: fontFamilies.primary.text,
          fontSize: 15,
          fontWeight: fontWeights.medium,
          lineHeight: 22,
          minHeight: 56,
          paddingBottom: 14,
          paddingLeft: 14,
          paddingRight: 44,
          paddingTop: 14,
          textAlignVertical: 'top',
        }}
        value={value}
        onBlur={() => setFocused(false)}
        onChangeText={onChange}
        onFocus={() => setFocused(true)}
      />
      <Text
        style={{
          ...typography.micro,
          position: 'absolute',
          right: 14,
          top: 14,
          fontSize: 11,
          fontWeight: fontWeights.semibold,
          letterSpacing: 0.3,
          lineHeight: 22,
          color: t.chevron,
          fontVariant: ['tabular-nums'],
        }}
      >
        {WHY_MAX_LENGTH - value.length}
      </Text>
    </View>
  );
}
