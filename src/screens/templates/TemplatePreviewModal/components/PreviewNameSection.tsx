/**
 * Preview icon/description plus the editable habit name input
 */

import React, { useState } from 'react';
import { View, TextInput, Keyboard } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '@/theme/spacing';
import { durations, enterEasing } from '@/theme/animations';
import { entrance } from '../constants';
import { buildTextInputHintProps } from '@/utils/textInputHintProps';
import { TemplatePreview } from '../TemplatePreview';
import type { PreviewNameSectionProps } from '../types';

// eslint-disable-next-line max-lines-per-function
export function PreviewNameSection({
  template,
  isImporting,
  customColor,
  customIcon,
  customName,
  onChangeName,
}: PreviewNameSectionProps) {
  const { colors, isDark } = useThemeColors();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className='items-center px-6'
      style={{ marginBottom: spacing['2xl'], marginTop: spacing.xl }}
    >
      <Animated.View
        className='mb-4'
        entering={FadeInDown.duration(durations.enter)
          .delay(durations.instant)
          .easing(enterEasing)}
      >
        <TemplatePreview
          customColor={customColor}
          description={template.description}
          icon={customIcon ?? template.icon}
        />
      </Animated.View>

      <Animated.View className='w-full' entering={entrance(160)}>
        <TextInput
          accessibilityLabel='Habit name'
          className='w-full rounded-2xl border-2 px-5 py-4 text-center text-2xl font-medium'
          editable={!isImporting}
          maxLength={50}
          returnKeyType='done'
          style={{
            lineHeight: 28,
            color: colors.text.primary,
            backgroundColor: isDark ? colors.card : '#FFFFFF',
            borderColor: isFocused ? colors.primary[600] : colors.border,
          }}
          value={customName}
          {...buildTextInputHintProps('Name your habit', colors.text.tertiary)}
          onBlur={() => setIsFocused(false)}
          onChangeText={onChangeName}
          onFocus={() => setIsFocused(true)}
          onSubmitEditing={Keyboard.dismiss}
        />
      </Animated.View>
    </View>
  );
}
