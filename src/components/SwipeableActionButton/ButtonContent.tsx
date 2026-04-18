/* eslint-disable max-lines */
/**
 * ButtonContent - The main pressable button content
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import type { ButtonContentProps } from './ButtonContent.types';
import { IconContainer } from './IconContainer';
import { iconSizes } from '@/theme/iconSizes';
import { triggerHaptic } from '@/utils/haptics';

export function ButtonContent({
  Icon,
  label,
  subtitle,
  isDestructive,
  isBoost,
  showChevron,
  accessibleLabel,
  onPress,
}: ButtonContentProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <Pressable
      accessibilityLabel={accessibleLabel}
      accessibilityRole='button'
      className='flex-row items-center gap-3 rounded-xl border px-4 py-3.5 active:opacity-70'
      style={isBoost ? { borderColor: themeColors.status.premiumLight } : isDestructive ? { borderColor: themeColors.status.errorLight, backgroundColor: themeColors.status.errorLight } : { borderColor: themeColors.border, backgroundColor: themeColors.card }}
      onPress={() => {
        triggerHaptic('tap');
        onPress();
      }}
    >
      {isBoost ? <LinearGradient
          className='absolute inset-0 rounded-xl'
          colors={['#f5f3ff', '#e0e7ff']}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
        /> : null}
      <IconContainer isBoost={isBoost} isDestructive={isDestructive}>
        <Icon
          color={isDestructive ? themeColors.status.error : isBoost ? themeColors.text.inverse : themeColors.text.primary}
          size={iconSizes.medium}
          strokeWidth={2.5}
        />
      </IconContainer>
      <View className='flex-1'>
        <Text
          className='text-base font-medium'
          style={{ color: isDestructive ? themeColors.status.error : isBoost ? themeColors.status.premiumText : themeColors.text.primary }}
        >
          {label}
        </Text>
        {subtitle ? <Text
            className='text-xs'
            style={{ color: isBoost ? themeColors.status.premiumText : themeColors.text.secondary }}
          >
            {subtitle}
          </Text> : null}
      </View>
      {showChevron ? <ChevronRight
          color={isDestructive ? themeColors.status.error : isBoost ? themeColors.status.premium : themeColors.text.tertiary}
          size={iconSizes.medium}
        /> : null}
    </Pressable>
  );
}
