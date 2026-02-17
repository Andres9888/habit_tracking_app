/**
 * MotivationText Component
 * Displays the motivational message above the create button
 */

import React from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { t } from '@/i18n';

export function MotivationText() {
  const { colors } = useThemeColors();

  return (
    <View
      accessible
      accessibilityLabel={`${t('habits.motivationHighlight')}${t('habits.motivationSuffix')}`}
      accessibilityRole='text'
      className='mb-3 items-center'
    >
      <Text className='text-[13px]' style={{ color: colors.text.secondary }}>
        <Text className='font-semibold' style={{ color: '#059669' }}>
          {t('habits.motivationHighlight')}
        </Text>
        {t('habits.motivationSuffix')}
      </Text>
    </View>
  );
}
