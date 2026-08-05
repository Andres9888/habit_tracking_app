/**
 * TipCardContent Component
 *
 * Internal content of the tip card including icon, text, and chevron.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';

import { COLORS } from './constants';

interface TipCardContentProps {
  tip: string;
  subtitle?: string;
  isInteractive: boolean;
}

export function TipCardContent({
  tip,
  subtitle,
  isInteractive,
}: TipCardContentProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View
      className='flex-row items-center gap-3 rounded-xl border p-3'
      style={{
        backgroundColor: COLORS.cardBackground,
        borderColor: themeColors.status.premiumLight,
      }}
    >
      {/* Icon Container */}
      <View
        accessibilityElementsHidden
        className='h-10 w-10 flex-shrink-0 items-center justify-center rounded-full'
        importantForAccessibility='no-hide-descendants'
        style={{ backgroundColor: COLORS.iconBackground }}
      >
        <Text className='text-lg'>💡</Text>
      </View>

      {/* Text Content */}
      <View className='flex-1'>
        <Text
          className='text-sm font-medium'
          style={{ color: COLORS.textPrimary }}
        >
          {tip}
        </Text>
        {subtitle ? <Text
            className='mt-0.5 text-xs'
            style={{ color: COLORS.textSecondary }}
          >
            {subtitle}
          </Text> : null}
      </View>

      {/* Chevron (only when interactive) */}
      {isInteractive ? <View
          accessibilityElementsHidden
          importantForAccessibility='no-hide-descendants'
        >
          <ChevronRight
            color={COLORS.chevron}
            size={iconSizes.medium}
            style={{ flexShrink: 0 }}
          />
        </View> : null}
    </View>
  );
}
