/**
 * LanguagePicker — inline language selector for Settings screen.
 * Shows supported languages with the current selection highlighted.
 */
import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react-native';
import { useThemeColors } from '../theme/ThemeContext';
import { SUPPORTED_LANGUAGES, type LanguageCode } from './i18n';

export function LanguagePicker() {
  const { t, i18n } = useTranslation();
  const { colors } = useThemeColors();

  const changeLanguage = useCallback(
    (code: LanguageCode) => {
      void i18n.changeLanguage(code);
    },
    [i18n],
  );

  return (
    <View className="px-4 pb-4 pt-4">
      <View className="mb-2 flex-row items-center gap-2">
        <Globe color={colors.text.secondary} size={14} />
        <Text
          className="text-[13px] font-semibold"
          style={{ color: colors.text.secondary }}
        >
          {t('settings.language')}
        </Text>
      </View>
      <View
        className="flex-row rounded-xl p-1"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
        }}
      >
        {SUPPORTED_LANGUAGES.map(({ code, nativeLabel }) => {
          const selected = i18n.language === code;
          return (
            <Pressable
              key={code}
              accessibilityLabel={`${nativeLabel} language`}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              className="flex-1 items-center justify-center rounded-lg px-2 py-2"
              style={{
                backgroundColor: selected ? colors.card : 'transparent',
              }}
              onPress={() => changeLanguage(code)}
            >
              <Text
                className="text-[13px] font-semibold"
                style={{
                  color: selected
                    ? colors.text.primary
                    : colors.text.secondary,
                }}
              >
                {nativeLabel}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
